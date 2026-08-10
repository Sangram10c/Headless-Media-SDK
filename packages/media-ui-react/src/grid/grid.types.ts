import { type ElementProps } from '../types/prop-getters.types';

/** A grid item wrapping the consumer's data with layout metadata */
export interface GridItem<T> {
  readonly item: T;
  readonly index: number;
  readonly key: string | number;
}

export interface UseGridOptions<T> {
  /** Items to render in the grid */
  readonly items: readonly T[];
  /** Number of columns. Default: 3 */
  readonly columns?: number;
  /** Gap between items in pixels. Default: 16 */
  readonly gap?: number;
  /** Extracts a unique key from each item */
  readonly getItemKey: (item: T, index: number) => string | number;
  /** Called when an item is clicked */
  readonly onItemClick?: (item: T, index: number) => void;
}

export interface UseGridReturn<T> {
  /** Items wrapped with layout metadata */
  readonly gridItems: readonly GridItem<T>[];
  /** Props to spread on the grid container */
  readonly getGridProps: <E extends HTMLElement = HTMLDivElement>(
    overrides?: ElementProps<E>,
  ) => ElementProps<E>;
  /** Props to spread on each grid item */
  readonly getItemProps: <E extends HTMLElement = HTMLDivElement>(
    gridItem: GridItem<T>,
    overrides?: ElementProps<E>,
  ) => ElementProps<E>;
}
