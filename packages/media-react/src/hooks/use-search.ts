import { useReducer, useEffect, useCallback, useRef } from 'react';
import {
  type PexelsPhoto,
  type PhotoSearchParams,
  type MediaError,
  type Orientation,
  type Size,
  type Color,
  type Locale,
} from '@headless-media/core';

import { useMedia } from './use-media';
import { type QueryStatus } from '../types/hook.types';

export interface UseSearchOptions {
  readonly orientation?: Orientation;
  readonly size?: Size;
  readonly color?: Color;
  readonly locale?: Locale;
  readonly perPage?: number;
  readonly enabled?: boolean;
}

export interface UseSearchReturn {
  readonly data: readonly PexelsPhoto[];
  readonly status: QueryStatus;
  readonly error: MediaError | null;
  readonly fetchNextPage: () => void;
  readonly hasNextPage: boolean;
  readonly isFetchingNextPage: boolean;
}

interface SearchState {
  readonly photos: readonly PexelsPhoto[];
  readonly page: number;
  readonly hasNextPage: boolean;
  readonly isFetchingNextPage: boolean;
}

type SearchAction =
  | { readonly type: 'FETCH_START' }
  | { readonly type: 'FETCH_SUCCESS'; readonly photos: readonly PexelsPhoto[]; readonly hasNextPage: boolean }
  | { readonly type: 'FETCH_ERROR'; readonly error: MediaError }
  | { readonly type: 'FETCH_NEXT_START' }
  | { readonly type: 'FETCH_NEXT_SUCCESS'; readonly photos: readonly PexelsPhoto[]; readonly hasNextPage: boolean }
  | { readonly type: 'RESET' };

interface FullState {
  readonly search: SearchState;
  readonly status: QueryStatus;
  readonly error: MediaError | null;
}

function searchReducer(state: FullState, action: SearchAction): FullState {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        status: 'loading',
        error: null,
        search: { ...state.search, page: 1, photos: [], hasNextPage: false, isFetchingNextPage: false },
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        status: 'success',
        error: null,
        search: { ...state.search, photos: action.photos, hasNextPage: action.hasNextPage, isFetchingNextPage: false },
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        status: 'error',
        error: action.error,
        search: { ...state.search, isFetchingNextPage: false },
      };
    case 'FETCH_NEXT_START':
      return {
        ...state,
        search: { ...state.search, isFetchingNextPage: true, page: state.search.page + 1 },
      };
    case 'FETCH_NEXT_SUCCESS':
      return {
        ...state,
        search: {
          ...state.search,
          photos: [...state.search.photos, ...action.photos],
          hasNextPage: action.hasNextPage,
          isFetchingNextPage: false,
        },
      };
    case 'RESET':
      return {
        status: 'idle',
        error: null,
        search: { photos: [], page: 1, hasNextPage: false, isFetchingNextPage: false },
      };
  }
}

const INITIAL_STATE: FullState = {
  status: 'idle',
  error: null,
  search: { photos: [], page: 1, hasNextPage: false, isFetchingNextPage: false },
};

/**
 * Hook for searching photos with pagination and infinite scroll support.
 *
 * Features:
 * - Auto-fetches when query or options change
 * - Supports infinite scroll via fetchNextPage()
 * - Aborts stale requests on re-fetch or unmount
 * - Debounce-friendly: empty query resets state without API call
 */
export function useSearch(query: string, options: UseSearchOptions = {}): UseSearchReturn {
  const client = useMedia();
  const [state, dispatch] = useReducer(searchReducer, INITIAL_STATE);
  const abortRef = useRef<AbortController | null>(null);
  const { orientation, size, color, locale, perPage, enabled = true } = options;

  // Initial search — fires when query or filter options change
  useEffect(() => {
    if (!enabled || !query.trim()) {
      dispatch({ type: 'RESET' });
      return;
    }

    // Abort any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    dispatch({ type: 'FETCH_START' });

    const params: PhotoSearchParams = {
      query: query.trim(),
      orientation,
      size,
      color,
      locale,
      per_page: perPage,
      page: 1,
    };

    client
      .searchPhotos(params)
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
  }, [client, query, orientation, size, color, locale, perPage, enabled]);

  // Fetch next page for infinite scroll
  const fetchNextPage = useCallback(() => {
    if (!state.search.hasNextPage || state.search.isFetchingNextPage || !query.trim()) {
      return;
    }

    const nextPage = state.search.page + 1;
    dispatch({ type: 'FETCH_NEXT_START' });

    const params: PhotoSearchParams = {
      query: query.trim(),
      orientation,
      size,
      color,
      locale,
      per_page: perPage,
      page: nextPage,
    };

    client
      .searchPhotos(params)
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
  }, [client, query, orientation, size, color, locale, perPage, state.search.hasNextPage, state.search.isFetchingNextPage, state.search.page]);

  return {
    data: state.search.photos,
    status: state.status,
    error: state.error,
    fetchNextPage,
    hasNextPage: state.search.hasNextPage,
    isFetchingNextPage: state.search.isFetchingNextPage,
  };
}
