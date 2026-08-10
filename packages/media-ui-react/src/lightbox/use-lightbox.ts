import {
  useState,
  useCallback,
  useEffect,
  type ImgHTMLAttributes,
  type ButtonHTMLAttributes,
} from 'react';

import { type UseLightboxOptions, type UseLightboxReturn, type LightboxItem } from './lightbox.types';
import { type ElementProps } from '../types/prop-getters.types';
import { callAll } from '../shared/call-all';
import { useStableId } from '../shared/use-id';
import { useFocusTrap } from './focus-trap';
import { composeRefs } from '../shared/compose-refs';

/**
 * Headless lightbox hook.
 */
export function useLightbox(options: UseLightboxOptions): UseLightboxReturn {
  const { items, initialIndex = 0, onClose, onNavigate, loop = true } = options;
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const lightboxId = useStableId('lightbox');
  const titleId = useStableId('lightbox-title');

  // Focus trap
  const trapRef = useFocusTrap(isOpen);

  const currentItem: LightboxItem | null =
    isOpen && currentIndex >= 0 && currentIndex < items.length
      ? (items[currentIndex] ?? null)
      : null;

  const open = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      setIsOpen(true);
    },
    [],
  );

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const next = useCallback(() => {
    setCurrentIndex((prev) => {
      const nextIdx = prev + 1;
      if (nextIdx >= items.length) {
        return loop ? 0 : prev;
      }
      onNavigate?.(nextIdx);
      return nextIdx;
    });
  }, [items.length, loop, onNavigate]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => {
      const prevIdx = prev - 1;
      if (prevIdx < 0) {
        const wrapped = loop ? items.length - 1 : 0;
        onNavigate?.(wrapped);
        return wrapped;
      }
      onNavigate?.(prevIdx);
      return prevIdx;
    });
  }, [items.length, loop, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          close();
          break;
        case 'ArrowRight':
          e.preventDefault();
          next();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prev();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close, next, prev]);

  // Lock body scroll when open
  useEffect(() => {
    if (!isOpen) return;
    const prevStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevStyle;
    };
  }, [isOpen]);

  const getBackdropProps = useCallback(
    <E extends HTMLElement = HTMLDivElement>(overrides: ElementProps<E> = {}): ElementProps<E> => ({
      role: 'presentation',
      'aria-hidden': true,
      ...overrides,
      onClick: callAll(
        (e: React.MouseEvent<HTMLElement>) => {
          if (e.target === e.currentTarget) {
            close();
          }
        },
        overrides.onClick,
      ),
    }),
    [close],
  );

  const getContentProps = useCallback(
    <E extends HTMLElement = HTMLDivElement>(overrides: ElementProps<E> = {}): ElementProps<E> => ({
      role: 'dialog',
      'aria-modal': true,
      'aria-labelledby': titleId,
      id: lightboxId,
      tabIndex: -1,
      ...overrides,
      ref: composeRefs(trapRef as React.Ref<E>, overrides.ref),
    }),
    [lightboxId, titleId, trapRef],
  );

  const getImageProps = useCallback(
    <E extends HTMLImageElement = HTMLImageElement>(
      overrides: ElementProps<E, ImgHTMLAttributes<E>> = {},
    ): ElementProps<E, ImgHTMLAttributes<E>> => ({
      src: currentItem?.src ?? '',
      alt: currentItem?.alt ?? '',
      role: 'img',
      ...overrides,
    }),
    [currentItem],
  );

  const getCloseButtonProps = useCallback(
    <E extends HTMLButtonElement = HTMLButtonElement>(
      overrides: ElementProps<E, ButtonHTMLAttributes<E>> = {},
    ): ElementProps<E, ButtonHTMLAttributes<E>> => ({
      type: 'button',
      'aria-label': 'Close lightbox',
      ...overrides,
      onClick: callAll(() => close(), overrides.onClick),
    }),
    [close],
  );

  const getNextButtonProps = useCallback(
    <E extends HTMLButtonElement = HTMLButtonElement>(
      overrides: ElementProps<E, ButtonHTMLAttributes<E>> = {},
    ): ElementProps<E, ButtonHTMLAttributes<E>> => ({
      type: 'button',
      'aria-label': 'Next image',
      disabled: !loop && currentIndex >= items.length - 1,
      ...overrides,
      onClick: callAll(() => next(), overrides.onClick),
    }),
    [next, loop, currentIndex, items.length],
  );

  const getPrevButtonProps = useCallback(
    <E extends HTMLButtonElement = HTMLButtonElement>(
      overrides: ElementProps<E, ButtonHTMLAttributes<E>> = {},
    ): ElementProps<E, ButtonHTMLAttributes<E>> => ({
      type: 'button',
      'aria-label': 'Previous image',
      disabled: !loop && currentIndex <= 0,
      ...overrides,
      onClick: callAll(() => prev(), overrides.onClick),
    }),
    [prev, loop, currentIndex],
  );

  return {
    isOpen,
    currentIndex,
    currentItem,
    open,
    close,
    next,
    prev,
    getBackdropProps,
    getContentProps,
    getImageProps,
    getCloseButtonProps,
    getNextButtonProps,
    getPrevButtonProps,
  };
}
