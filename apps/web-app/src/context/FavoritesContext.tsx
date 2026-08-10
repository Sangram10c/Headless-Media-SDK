import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { PexelsPhoto, PexelsVideo } from '@headless-media/react';

interface FavoritesContextType {
  readonly favoritePhotos: readonly PexelsPhoto[];
  readonly favoriteVideos: readonly PexelsVideo[];
  readonly favoritePhotoIds: Set<number>;
  readonly favoriteVideoIds: Set<number>;
  readonly totalFavoritesCount: number;
  readonly toggleFavoritePhoto: (photo: PexelsPhoto) => void;
  readonly toggleFavoriteVideo: (video: PexelsVideo) => void;
  readonly clearAllFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

const STORAGE_KEY_PHOTOS = 'HEADLESS_MEDIA_FAV_PHOTOS';
const STORAGE_KEY_VIDEOS = 'HEADLESS_MEDIA_FAV_VIDEOS';

export function FavoritesProvider({ children }: { readonly children: React.ReactNode }) {
  const [favoritePhotos, setFavoritePhotos] = useState<readonly PexelsPhoto[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PHOTOS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [favoriteVideos, setFavoriteVideos] = useState<readonly PexelsVideo[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_VIDEOS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PHOTOS, JSON.stringify(favoritePhotos));
    } catch {
      // Ignored
    }
  }, [favoritePhotos]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VIDEOS, JSON.stringify(favoriteVideos));
    } catch {
      // Ignored
    }
  }, [favoriteVideos]);

  const favoritePhotoIds = useMemo(() => new Set(favoritePhotos.map((p) => p.id)), [favoritePhotos]);
  const favoriteVideoIds = useMemo(() => new Set(favoriteVideos.map((v) => v.id)), [favoriteVideos]);

  const toggleFavoritePhoto = useCallback((photo: PexelsPhoto) => {
    setFavoritePhotos((prev) => {
      const exists = prev.some((p) => p.id === photo.id);
      if (exists) {
        return prev.filter((p) => p.id !== photo.id);
      }
      return [photo, ...prev];
    });
  }, []);

  const toggleFavoriteVideo = useCallback((video: PexelsVideo) => {
    setFavoriteVideos((prev) => {
      const exists = prev.some((v) => v.id === video.id);
      if (exists) {
        return prev.filter((v) => v.id !== video.id);
      }
      return [video, ...prev];
    });
  }, []);

  const clearAllFavorites = useCallback(() => {
    setFavoritePhotos([]);
    setFavoriteVideos([]);
  }, []);

  const value = useMemo<FavoritesContextType>(
    () => ({
      favoritePhotos,
      favoriteVideos,
      favoritePhotoIds,
      favoriteVideoIds,
      totalFavoritesCount: favoritePhotos.length + favoriteVideos.length,
      toggleFavoritePhoto,
      toggleFavoriteVideo,
      clearAllFavorites,
    }),
    [
      favoritePhotos,
      favoriteVideos,
      favoritePhotoIds,
      favoriteVideoIds,
      toggleFavoritePhoto,
      toggleFavoriteVideo,
      clearAllFavorites,
    ],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
