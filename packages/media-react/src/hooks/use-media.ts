import { useContext } from 'react';
import { type MediaClient } from '@headless-media/core';

import { MediaContext } from '../provider/media-context';

/**
 * Hook to access the raw MediaClient from context.
 *
 * Throws if used outside of <MediaProvider>.
 * This is intentional — silent failures are worse than loud ones.
 */
export function useMedia(): MediaClient {
  const client = useContext(MediaContext);

  if (client === null) {
    throw new Error(
      '[MediaSDK] useMedia() must be used within a <MediaProvider>. ' +
        'Wrap your component tree with <MediaProvider config={...}>.',
    );
  }

  return client;
}
