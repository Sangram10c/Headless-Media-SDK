import {
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import { type UseReelSwiperOptions, type UseReelSwiperReturn } from './reel-swiper.types';
import { type ElementProps } from '../types/prop-getters.types';
import { useStableId } from '../shared/use-id';
import { composeRefs } from '../shared/compose-refs';

/**
 * Headless vertical reel/swiper hook.
 */
export function useReelSwiper<T>(options: UseReelSwiperOptions<T>): UseReelSwiperReturn<T> {
  const { items, onActiveChange, threshold = 0.5 } = options;
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLElement | null>(null);
  const slideRefs = useRef<Map<number, HTMLElement>>(new Map());
  const reelId = useStableId('reel');

  const itemsRef = useRef(items);
  itemsRef.current = items;

  // Ref-stabilize callback to prevent useEffect reference loops
  const onActiveChangeRef = useRef(onActiveChange);
  onActiveChangeRef.current = onActiveChange;

  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  // IntersectionObserver for active item detection
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-reel-index'));
            if (!isNaN(index) && index !== activeIndexRef.current) {
              setActiveIndex(index);
              const activeItem = itemsRef.current[index];
              if (activeItem !== undefined) {
                onActiveChangeRef.current?.(index, activeItem);
              }
            }
          }
        }
      },
      {
        root: container,
        threshold,
      },
    );

    for (const [, element] of slideRefs.current) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [items.length, threshold]);

  const scrollTo = useCallback(
    (index: number) => {
      const slide = slideRefs.current.get(index);
      if (slide) {
        slide.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [],
  );

  // Keyboard navigation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (activeIndex < items.length - 1) {
            scrollTo(activeIndex + 1);
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (activeIndex > 0) {
            scrollTo(activeIndex - 1);
          }
          break;
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, items.length, scrollTo]);

  const getContainerProps = useCallback(
    <E extends HTMLElement = HTMLDivElement>(overrides: ElementProps<E> = {}): ElementProps<E> => ({
      role: 'feed',
      id: reelId,
      tabIndex: 0,
      'aria-label': overrides['aria-label'] ?? 'Media reel',
      ...overrides,
      ref: composeRefs((node: HTMLElement | null) => {
        containerRef.current = node;
      }, overrides.ref),
      style: {
        '--reel-active-index': activeIndex,
        ...overrides.style,
      } as React.CSSProperties,
    }),
    [reelId, activeIndex],
  );

  const getSlideProps = useCallback(
    <E extends HTMLElement = HTMLDivElement>(
      index: number,
      overrides: ElementProps<E> = {},
    ): ElementProps<E> => ({
      role: 'article',
      'aria-label': overrides['aria-label'] ?? `Media item ${String(index + 1)} of ${String(items.length)}`,
      'aria-setsize': items.length,
      'aria-posinset': index + 1,
      'data-reel-index': index,
      'data-active': index === activeIndex ? '' : undefined,
      tabIndex: index === activeIndex ? 0 : -1,
      ...overrides,
      ref: composeRefs((node: HTMLElement | null) => {
        if (node) {
          slideRefs.current.set(index, node);
        } else {
          slideRefs.current.delete(index);
        }
      }, overrides.ref),
    }),
    [items.length, activeIndex],
  );

  const activeItem = items[activeIndex] ?? null;

  return { activeIndex, activeItem, getContainerProps, getSlideProps, scrollTo };
}
