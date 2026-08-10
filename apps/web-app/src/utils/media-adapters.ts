import { type PexelsPhoto, type PexelsVideo } from '@headless-media/core';
import { type LightboxItem } from '@headless-media/ui-react';

/**
 * Maps a PexelsPhoto object to a LightboxItem expected by useLightbox.
 */
export function photoToLightboxItem(photo: PexelsPhoto): LightboxItem {
  return {
    src: photo.src.large2x || photo.src.large || photo.src.original,
    alt: photo.alt || `Photo by ${photo.photographer}`,
    width: photo.width,
    height: photo.height,
  };
}

/**
 * Extracts the best MP4 video source link from a PexelsVideo.
 */
export function getVideoSource(video: PexelsVideo): string {
  const mp4File =
    video.video_files.find((f) => f.file_type === 'video/mp4' && f.quality === 'hd') ||
    video.video_files.find((f) => f.file_type === 'video/mp4' && f.quality === 'sd') ||
    video.video_files[0];
  return mp4File?.link ?? '';
}

/**
 * Downloads a remote image file directly to the user's computer.
 * Uses blob URLs for instant browser download, with new window fallback.
 */
export async function triggerFileDownload(url: string, filename?: string): Promise<void> {
  const defaultName = filename || `pexels-media-${Date.now()}.jpg`;

  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = defaultName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  } catch {
    // Fallback: open directly if CORS blocks blob fetch
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
