import { useEffect, useRef } from 'react';
import { type MediaEventType, type EventHandler } from '@headless-media/core';

import { useMedia } from './use-media';

/**
 * Hook for subscribing to SDK events reactively.
 *
 * Automatically subscribes on mount and unsubscribes on unmount.
 * Uses a ref for the handler to avoid re-subscribing when the
 * handler function identity changes (common with inline functions).
 *
 * @example
 * useMediaEvents('search', (event) => {
 *   console.log('Search:', event.query);
 * });
 */
export function useMediaEvents<E extends MediaEventType>(
  event: E,
  handler: EventHandler<E>,
): void {
  const client = useMedia();
  const handlerRef = useRef(handler);

  // Update ref on every render so we always call the latest handler
  handlerRef.current = handler;

  useEffect(() => {
    // Stable wrapper that delegates to the latest handler via ref
    const stableHandler: EventHandler<E> = (e) => {
      handlerRef.current(e);
    };

    const unsubscribe = client.subscribe(event, stableHandler);
    return unsubscribe;
  }, [client, event]);
}
