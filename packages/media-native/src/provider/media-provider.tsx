import { useEffect, useRef, type ReactNode } from 'react';
import { type MediaClientConfig, createMediaClient } from '@headless-media/core';
import { MediaContext } from './media-context';

export interface MediaProviderProps {
  readonly config: MediaClientConfig;
  readonly children: ReactNode;
}

export function MediaProvider({ config, children }: MediaProviderProps) {
  const clientRef = useRef<ReturnType<typeof createMediaClient> | null>(null);

  if (clientRef.current === null) {
    clientRef.current = createMediaClient(config);
  }

  useEffect(() => {
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
