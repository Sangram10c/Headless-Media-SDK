import { useState, useCallback } from 'react';
import { type MediaError } from '@headless-media/core';

import { useMedia } from './use-media';

export interface UseDownloadReturn {
  readonly download: (url: string) => Promise<void>;
  readonly isDownloading: boolean;
  readonly error: MediaError | null;
}

/**
 * Hook for tracking download events.
 *
 * Calls the SDK's download() method which emits a 'download' event
 * for analytics/attribution. Does not perform the actual file download.
 */
export function useDownload(): UseDownloadReturn {
  const client = useMedia();
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<MediaError | null>(null);

  const download = useCallback(
    async (url: string) => {
      setIsDownloading(true);
      setError(null);

      try {
        await client.download(url);
      } catch (err) {
        setError(err as MediaError);
      } finally {
        setIsDownloading(false);
      }
    },
    [client],
  );

  return { download, isDownloading, error };
}
