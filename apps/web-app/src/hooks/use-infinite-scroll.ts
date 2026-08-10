import { useEffect, useRef } from 'react';

export interface UseInfiniteScrollOptions {
  readonly onLoadMore: () => void;
  readonly hasMore: boolean;
  readonly isLoading: boolean;
  readonly rootMargin?: string;
}

/**
 * Custom hook for infinite scroll sentinel detection using IntersectionObserver.
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  rootMargin = '400px',
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [onLoadMore, hasMore, isLoading, rootMargin]);

  return sentinelRef;
}
