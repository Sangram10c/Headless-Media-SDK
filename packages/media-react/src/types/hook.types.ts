import { type MediaError } from '@headless-media/core';

/**
 * Query status for async operations.
 * Uses discriminated union pattern for exhaustive state handling.
 */
export type QueryStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Generic async query state.
 * Used by all data-fetching hooks for consistent state shape.
 */
export interface QueryState<T> {
  readonly data: T;
  readonly status: QueryStatus;
  readonly error: MediaError | null;
}

/**
 * State machine actions for query state transitions.
 * Using discriminated union ensures only valid transitions are possible.
 */
export type QueryAction<T> =
  | { readonly type: 'FETCH_START' }
  | { readonly type: 'FETCH_SUCCESS'; readonly payload: T }
  | { readonly type: 'FETCH_ERROR'; readonly error: MediaError }
  | { readonly type: 'RESET' };

/**
 * Generic query reducer.
 * Manages state transitions for async data fetching.
 */
export function queryReducer<T>(state: QueryState<T>, action: QueryAction<T>): QueryState<T> {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, status: 'loading', error: null };
    case 'FETCH_SUCCESS':
      return { data: action.payload, status: 'success', error: null };
    case 'FETCH_ERROR':
      return { ...state, status: 'error', error: action.error };
    case 'RESET':
      return { ...state, status: 'idle', error: null };
  }
}

/**
 * Creates initial query state for a given default data value.
 */
export function createInitialState<T>(defaultData: T): QueryState<T> {
  return {
    data: defaultData,
    status: 'idle',
    error: null,
  };
}
