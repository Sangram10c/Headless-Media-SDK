import { useReducer, useEffect, useCallback, useRef } from 'react';
import { type PexelsPhoto, type CuratedParams, type MediaError } from '@headless-media/core';

import { useMedia } from './use-media';
import { type QueryStatus } from '../types/hook.types';

export interface UseCuratedOptions {
  readonly page?: number;
  readonly perPage?: number;
  readonly enabled?: boolean;
}

export interface UseCuratedReturn {
  readonly data: readonly PexelsPhoto[];
  readonly status: QueryStatus;
  readonly error: MediaError | null;
  readonly fetchNextPage: () => void;
  readonly hasNextPage: boolean;
  readonly isFetchingNextPage: boolean;
  readonly refetch: () => void;
}

interface CuratedState {
  readonly photos: readonly PexelsPhoto[];
  readonly status: QueryStatus;
  readonly error: MediaError | null;
  readonly page: number;
  readonly hasNextPage: boolean;
  readonly isFetchingNextPage: boolean;
}

type CuratedAction =
  | { readonly type: 'FETCH_START'; readonly initialPage: number }
  | { readonly type: 'FETCH_SUCCESS'; readonly photos: readonly PexelsPhoto[]; readonly hasNextPage: boolean }
  | { readonly type: 'FETCH_ERROR'; readonly error: MediaError }
  | { readonly type: 'FETCH_NEXT_START' }
  | { readonly type: 'FETCH_NEXT_SUCCESS'; readonly photos: readonly PexelsPhoto[]; readonly hasNextPage: boolean };

function curatedReducer(state: CuratedState, action: CuratedAction): CuratedState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, status: 'loading', error: null, page: action.initialPage, photos: [] };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        status: 'success',
        photos: action.photos,
        hasNextPage: action.hasNextPage,
        isFetchingNextPage: false,
      };
    case 'FETCH_ERROR':
      return { ...state, status: 'error', error: action.error, isFetchingNextPage: false };
    case 'FETCH_NEXT_START':
      return { ...state, isFetchingNextPage: true, page: state.page + 1 };
    case 'FETCH_NEXT_SUCCESS':
      return {
        ...state,
        photos: [...state.photos, ...action.photos],
        hasNextPage: action.hasNextPage,
        isFetchingNextPage: false,
      };
  }
}

const INITIAL_STATE: CuratedState = {
  photos: [],
  status: 'idle',
  error: null,
  page: 1,
  hasNextPage: false,
  isFetchingNextPage: false,
};

/**
 * Hook for fetching curated/trending photos with infinite scroll.
 *
 * Auto-fetches on mount. Supports pagination via fetchNextPage().
 */
export function useCurated(options: UseCuratedOptions = {}): UseCuratedReturn {
  const client = useMedia();
  const [state, dispatch] = useReducer(curatedReducer, INITIAL_STATE);
  const abortRef = useRef<AbortController | null>(null);
  const { page: initialPage = 1, perPage, enabled = true } = options;

  const fetchCurated = useCallback(
    (pageNumber: number) => {
      const params: CuratedParams = { page: pageNumber, per_page: perPage };
      return client.getCurated(params);
    },
    [client, perPage],
  );

  // Initial fetch
  useEffect(() => {
    if (!enabled) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    dispatch({ type: 'FETCH_START', initialPage });

    fetchCurated(initialPage)
      .then((result) => {
        if (!controller.signal.aborted) {
          dispatch({
            type: 'FETCH_SUCCESS',
            photos: result.data,
            hasNextPage: result.nextPage !== null,
          });
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          dispatch({ type: 'FETCH_ERROR', error: error as MediaError });
        }
      });

    return () => {
      controller.abort();
    };
  }, [enabled, fetchCurated, initialPage]);

  const fetchNextPage = useCallback(() => {
    if (!state.hasNextPage || state.isFetchingNextPage) return;

    const nextPage = state.page + 1;
    dispatch({ type: 'FETCH_NEXT_START' });

    fetchCurated(nextPage)
      .then((result) => {
        dispatch({
          type: 'FETCH_NEXT_SUCCESS',
          photos: result.data,
          hasNextPage: result.nextPage !== null,
        });
      })
      .catch((error: unknown) => {
        dispatch({ type: 'FETCH_ERROR', error: error as MediaError });
      });
  }, [fetchCurated, state.hasNextPage, state.isFetchingNextPage, state.page]);

  const refetch = useCallback(() => {
    dispatch({ type: 'FETCH_START', initialPage });
    fetchCurated(initialPage)
      .then((result) => {
        dispatch({
          type: 'FETCH_SUCCESS',
          photos: result.data,
          hasNextPage: result.nextPage !== null,
        });
      })
      .catch((error: unknown) => {
        dispatch({ type: 'FETCH_ERROR', error: error as MediaError });
      });
  }, [fetchCurated, initialPage]);

  return {
    data: state.photos,
    status: state.status,
    error: state.error,
    fetchNextPage,
    hasNextPage: state.hasNextPage,
    isFetchingNextPage: state.isFetchingNextPage,
    refetch,
  };
}
