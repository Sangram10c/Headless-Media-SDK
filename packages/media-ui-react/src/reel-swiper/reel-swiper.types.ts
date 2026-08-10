import { type ElementProps } from '../types/prop-getters.types';

export interface UseReelSwiperOptions<T> {
  /** Items to display in the reel */
  readonly items: readonly T[];
  /** Called when the active item changes */
  readonly onActiveChange?: (index: number, item: T) => void;
  /** Snap threshold as fraction of slide height. Default: 0.5 */
  readonly threshold?: number;
}

export interface UseReelSwiperReturn<T> {
  /** Index of the currently active (snapped) item */
  readonly activeIndex: number;
  /** Currently active item data */
  readonly activeItem: T | null;
  /** Props for the scroll container */
  readonly getContainerProps: <E extends HTMLElement = HTMLDivElement>(
    overrides?: ElementProps<E>,
  ) => ElementProps<E>;
  /** Props for each slide element */
  readonly getSlideProps: <E extends HTMLElement = HTMLDivElement>(
    index: number,
    overrides?: ElementProps<E>,
  ) => ElementProps<E>;
  /** Programmatically scroll to a specific index */
  readonly scrollTo: (index: number) => void;
}
