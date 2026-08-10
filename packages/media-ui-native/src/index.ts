/**
 * @headless-media/ui-native — Headless UI primitives for React Native.
 *
 * Exposes prop getters adapted for React Native elements (View, Image, Pressable, FlatList).
 */

export interface GridItem<T> {
  readonly item: T;
  readonly index: number;
  readonly key: string | number;
}

export interface UseGridOptions<T> {
  readonly items: readonly T[];
  readonly columns?: number;
  readonly getItemKey: (item: T, index: number) => string | number;
  readonly onItemClick?: (item: T, index: number) => void;
}

export interface UseGridReturn<T> {
  readonly gridItems: readonly GridItem<T>[];
  readonly getGridProps: () => Record<string, unknown>;
  readonly getItemProps: (item: GridItem<T>) => Record<string, unknown>;
}

export interface LightboxItem {
  readonly src: string;
  readonly alt?: string;
  readonly width?: number;
  readonly height?: number;
}

export interface UseLightboxOptions {
  readonly items: readonly LightboxItem[];
  readonly initialIndex?: number;
  readonly onClose?: () => void;
  readonly onNavigate?: (index: number) => void;
}

export interface UseLightboxReturn {
  readonly isOpen: boolean;
  readonly currentIndex: number;
  readonly currentItem: LightboxItem | null;
  readonly open: (index: number) => void;
  readonly close: () => void;
  readonly next: () => void;
  readonly prev: () => void;
  readonly getBackdropProps: () => Record<string, unknown>;
  readonly getContentProps: () => Record<string, unknown>;
  readonly getImageProps: () => Record<string, unknown>;
  readonly getCloseButtonProps: () => Record<string, unknown>;
}

export interface UseReelSwiperOptions<T> {
  readonly items: readonly T[];
  readonly onActiveChange?: (index: number, item: T) => void;
}

export interface UseReelSwiperReturn<T> {
  readonly activeIndex: number;
  readonly activeItem: T | null;
  readonly getFlatListProps: () => Record<string, unknown>;
  readonly getItemProps: (index: number) => Record<string, unknown>;
  readonly scrollTo: (index: number) => void;
}

export function useGrid<T>(options: UseGridOptions<T>): UseGridReturn<T> {
  const gridItems = options.items.map((item, index) => ({
    item,
    index,
    key: options.getItemKey(item, index),
  }));

  return {
    gridItems,
    getGridProps: () => ({ numColumns: options.columns ?? 2 }),
    getItemProps: (gi) => ({
      onPress: () => options.onItemClick?.(gi.item, gi.index),
    }),
  };
}

export function useLightbox(options: UseLightboxOptions): UseLightboxReturn {
  return {
    isOpen: false,
    currentIndex: options.initialIndex ?? 0,
    currentItem: options.items[options.initialIndex ?? 0] ?? null,
    open: () => {},
    close: () => {},
    next: () => {},
    prev: () => {},
    getBackdropProps: () => ({ style: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 } }),
    getContentProps: () => ({ style: { flex: 1 } }),
    getImageProps: () => ({ resizeMode: 'contain' }),
    getCloseButtonProps: () => ({ onPress: options.onClose }),
  };
}

export function useReelSwiper<T>(options: UseReelSwiperOptions<T>): UseReelSwiperReturn<T> {
  return {
    activeIndex: 0,
    activeItem: options.items[0] ?? null,
    getFlatListProps: () => ({ pagingEnabled: true, showsVerticalScrollIndicator: false }),
    getItemProps: (index) => ({ key: String(index) }),
    scrollTo: () => {},
  };
}
