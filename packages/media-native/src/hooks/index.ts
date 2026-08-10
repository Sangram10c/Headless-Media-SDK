import { useContext, useEffect, useRef } from 'react';
import {
  type MediaClient,
  type PexelsPhoto,
  type MediaError,
  type MediaEventType,
  type EventHandler,
  type Orientation,
  type Size,
  type Color,
  type Locale,
} from '@headless-media/core';
import { MediaContext } from '../provider/media-context';

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
  readonly status: 'idle' | 'loading' | 'success' | 'error';
  readonly error: MediaError | null;
  readonly fetchNextPage: () => void;
  readonly hasNextPage: boolean;
  readonly isFetchingNextPage: boolean;
}

export interface UseCuratedOptions {
  readonly perPage?: number;
  readonly enabled?: boolean;
}

export interface UseCuratedReturn {
  readonly data: readonly PexelsPhoto[];
  readonly status: 'idle' | 'loading' | 'success' | 'error';
  readonly error: MediaError | null;
  readonly fetchNextPage: () => void;
  readonly hasNextPage: boolean;
  readonly isFetchingNextPage: boolean;
  readonly refetch: () => void;
}

export interface UseDownloadReturn {
  readonly download: (url: string) => Promise<void>;
  readonly isDownloading: boolean;
  readonly error: MediaError | null;
}

export function useMedia(): MediaClient {
  const client = useContext(MediaContext);
  if (client === null) {
    throw new Error('[MediaSDK Native] useMedia() must be used within a <MediaProvider>.');
  }
  return client;
}

export function useSearch(_query: string, _options?: UseSearchOptions): UseSearchReturn {
  useMedia();
  return {
    data: [],
    status: 'idle',
    error: null,
    fetchNextPage: () => {},
    hasNextPage: false,
    isFetchingNextPage: false,
  };
}

export function useCurated(_options?: UseCuratedOptions): UseCuratedReturn {
  useMedia();
  return {
    data: [],
    status: 'idle',
    error: null,
    fetchNextPage: () => {},
    hasNextPage: false,
    isFetchingNextPage: false,
    refetch: () => {},
  };
}

export function useDownload(): UseDownloadReturn {
  const client = useMedia();
  return {
    download: async (url) => client.download(url),
    isDownloading: false,
    error: null,
  };
}

export function useMediaEvents<E extends MediaEventType>(event: E, handler: EventHandler<E>): void {
  const client = useMedia();
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    return client.subscribe(event, (e) => handlerRef.current(e));
  }, [client, event]);
}
