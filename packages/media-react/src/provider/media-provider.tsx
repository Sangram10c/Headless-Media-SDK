import { useEffect, useRef, type ReactNode } from 'react';
import { type MediaClientConfig, createMediaClient } from '@headless-media/core';

import { MediaContext } from './media-context';

export interface MediaProviderProps {
  /** SDK configuration. Changes to this object will re-create the client. */
  readonly config: MediaClientConfig;
  readonly children: ReactNode;
}

/**
 * MediaProvider — initializes the SDK and provides it to all descendants.
 *
 * Design decisions:
 * - Client is created once on mount and destroyed on unmount.
 * - Uses a ref to avoid re-creating the client on every render.
 * - If config changes (referential equality), the old client is destroyed
 *   and a new one is created. This handles API key rotation gracefully.
 */
export function MediaProvider({ config, children }: MediaProviderProps) {
  const clientRef = useRef<ReturnType<typeof createMediaClient> | null>(null);

  // Create or re-create client when config reference changes
  if (clientRef.current === null) {
    clientRef.current = createMediaClient(config);
  }

  useEffect(() => {
    // Re-create client if config object identity changed
    const client = createMediaClient(config);
    clientRef.current = client;

    return () => {
      client.destroy();
      clientRef.current = null;
    };
  }, [config]);

  return (
    <MediaContext.Provider value={clientRef.current}>
      {children}
    </MediaContext.Provider>
  );
}
