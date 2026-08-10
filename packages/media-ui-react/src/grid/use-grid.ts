import { useMemo, useCallback } from 'react';

import { type UseGridOptions, type UseGridReturn, type GridItem } from './grid.types';
import { type ElementProps } from '../types/prop-getters.types';
import { callAll } from '../shared/call-all';
import { useStableId } from '../shared/use-id';

/**
 * Headless grid hook.
 */
export function useGrid<T>(options: UseGridOptions<T>): UseGridReturn<T> {
  const { items, columns = 3, gap = 16, getItemKey, onItemClick } = options;
  const gridId = useStableId('grid');

  const gridItems: readonly GridItem<T>[] = useMemo(
    () =>
      items.map((item, index) => ({
        item,
        index,
        key: getItemKey(item, index),
      })),
    [items, getItemKey],
  );

  const getGridProps = useCallback(
    <E extends HTMLElement = HTMLDivElement>(overrides: ElementProps<E> = {}): ElementProps<E> => ({
      role: 'list',
      id: gridId,
      'aria-label': overrides['aria-label'] ?? 'Media grid',
      ...overrides,
      style: {
        '--grid-columns': columns,
        '--grid-gap': `${String(gap)}px`,
        ...overrides.style,
      } as React.CSSProperties,
    }),
    [gridId, columns, gap],
  );

  const getItemProps = useCallback(
    <E extends HTMLElement = HTMLDivElement>(
      gridItem: GridItem<T>,
      overrides: ElementProps<E> = {},
    ): ElementProps<E> => ({
      role: 'listitem',
      tabIndex: 0,
      'aria-label': overrides['aria-label'] ?? `Media item ${String(gridItem.index + 1)}`,
      ...overrides,
      onClick: callAll(
        onItemClick ? () => onItemClick(gridItem.item, gridItem.index) : undefined,
        overrides.onClick,
      ),
      onKeyDown: callAll(
        (e: React.KeyboardEvent<HTMLElement>) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onItemClick?.(gridItem.item, gridItem.index);
          }
        },
        overrides.onKeyDown,
      ),
    }),
    [onItemClick],
  );

  return { gridItems, getGridProps, getItemProps };
}
