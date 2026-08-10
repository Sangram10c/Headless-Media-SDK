import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGrid, useLightbox, useReelSwiper, callAll } from '../src';

describe('callAll utility', () => {
  it('invokes all non-null functions in sequence', () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    const combined = callAll(fn1, undefined, fn2);

    combined('test-arg');
    expect(fn1).toHaveBeenCalledWith('test-arg');
    expect(fn2).toHaveBeenCalledWith('test-arg');
  });
});

describe('useGrid hook', () => {
  const sampleItems = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];

  it('generates grid items and prop getters with ARIA list roles', () => {
    const onItemClick = vi.fn();
    const { result } = renderHook(() =>
      useGrid({
        items: sampleItems,
        columns: 3,
        gap: 16,
        getItemKey: (item) => item.id,
        onItemClick,
      }),
    );

    expect(result.current.gridItems).toHaveLength(2);
    expect(result.current.gridItems[0]?.key).toBe(1);

    const containerProps = result.current.getGridProps();
    expect(containerProps.role).toBe('list');

    const itemProps = result.current.getItemProps(result.current.gridItems[0]!);
    expect(itemProps.role).toBe('listitem');
    expect(itemProps.tabIndex).toBe(0);

    itemProps.onClick?.({} as React.MouseEvent<HTMLElement>);
    expect(onItemClick).toHaveBeenCalledWith(sampleItems[0], 0);
  });
});

describe('useLightbox hook', () => {
  const sampleItems = [
    { src: 'https://example.com/1.jpg', alt: 'One' },
    { src: 'https://example.com/2.jpg', alt: 'Two' },
  ];

  it('manages open/close state and item navigation', () => {
    const onClose = vi.fn();
    const { result } = renderHook(() =>
      useLightbox({
        items: sampleItems,
        onClose,
      }),
    );

    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.open(0);
    });
    expect(result.current.isOpen).toBe(true);
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentItem?.src).toBe('https://example.com/1.jpg');

    act(() => {
      result.current.next();
    });
    expect(result.current.currentIndex).toBe(1);

    act(() => {
      result.current.close();
    });
    expect(result.current.isOpen).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('useReelSwiper hook', () => {
  const sampleItems = ['Video 1', 'Video 2', 'Video 3'];

  it('manages active index and provides feed/article ARIA props', () => {
    const { result } = renderHook(() =>
      useReelSwiper({
        items: sampleItems,
      }),
    );

    expect(result.current.activeIndex).toBe(0);

    const containerProps = result.current.getContainerProps();
    expect(containerProps.role).toBe('feed');

    const slideProps = result.current.getSlideProps(0);
    expect(slideProps.role).toBe('article');
    expect(slideProps['data-reel-index']).toBe(0);
  });
});
