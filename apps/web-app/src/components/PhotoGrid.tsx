import { useState, useCallback } from 'react';
import { Heart, Share2, Download, RefreshCw, ImageOff } from 'lucide-react';
import { useSearch, useCurated, useDownload, type PexelsPhoto } from '@headless-media/react';
import type { Orientation } from '@headless-media/core';
import { useLightbox, useGrid, type GridItem } from '@headless-media/ui-react';
import { SearchBar } from './SearchBar';
import { PhotoLightboxModal } from './PhotoLightboxModal';
import { photoToLightboxItem, triggerFileDownload } from '../utils/media-adapters';
import { useInfiniteScroll } from '../hooks/use-infinite-scroll';
import { useFavorites } from '../context/FavoritesContext';

function getRandomPage(): number {
  return Math.floor(Math.random() * 10) + 1;
}

interface PhotoGridProps {
  readonly onOpenApiKeyModal?: () => void;
}

export function PhotoGrid({ onOpenApiKeyModal }: PhotoGridProps) {
  const [query, setQuery] = useState('');
  const [orientation, setOrientation] = useState<Orientation | undefined>(undefined);
  const [color, setColor] = useState<string | undefined>(undefined);
  const [curatedPage, setCuratedPage] = useState(() => getRandomPage());

  const { favoritePhotoIds, toggleFavoritePhoto } = useFavorites();

  const hasFilters = Boolean(orientation || color);
  const isSearching = Boolean(query.trim() || hasFilters);

  const activeQuery = query.trim() || (hasFilters ? 'nature' : '');

  const searchResult = useSearch(activeQuery, { orientation, color, enabled: isSearching });
  const curatedResult = useCurated({ page: curatedPage, perPage: 20, enabled: !isSearching });

  const activeResult = isSearching ? searchResult : curatedResult;
  const photos = activeResult.data;

  const { download } = useDownload();

  const lightbox = useLightbox({
    items: photos.map(photoToLightboxItem),
    loop: true,
  });

  const { gridItems, getGridProps, getItemProps } = useGrid<PexelsPhoto>({
    items: photos,
    columns: 5,
    gap: 16,
    getItemKey: (p: PexelsPhoto) => p.id,
    onItemClick: (_: PexelsPhoto, index: number) => lightbox.open(index),
  });

  const sentinelRef = useInfiniteScroll({
    onLoadMore: activeResult.fetchNextPage,
    hasMore: activeResult.hasNextPage,
    isLoading: activeResult.isFetchingNextPage || activeResult.status === 'loading',
  });

  const handleResetFilters = useCallback(() => {
    setQuery('');
    setOrientation(undefined);
    setColor(undefined);
    setCuratedPage(getRandomPage());
  }, []);

  const handleRefreshFeed = useCallback(() => {
    setQuery('');
    setOrientation(undefined);
    setColor(undefined);
    setCuratedPage(getRandomPage());
  }, []);

  const handleDirectDownload = async (e: React.MouseEvent, photo: PexelsPhoto) => {
    e.stopPropagation();
    download(photo.src.original);
    await triggerFileDownload(photo.src.original, `pexels-photo-${photo.id}.jpg`);
  };

  const handleShare = async (e: React.MouseEvent, photo: PexelsPhoto) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Photo by ${photo.photographer}`,
          text: photo.alt || 'Check out this photo on Pexels',
          url: photo.url,
        });
      } catch {
        // Ignored fallback
      }
    } else {
      await navigator.clipboard.writeText(photo.url);
      alert('Photo URL copied to clipboard!');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <SearchBar
        query={query}
        onQueryChange={setQuery}
        orientation={orientation}
        onOrientationChange={setOrientation}
        color={color}
        onColorChange={setColor}
        onResetFilters={handleResetFilters}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
          {query.trim()
            ? `Results for "${query}"`
            : hasFilters
            ? `Filtered Photos (${[orientation, color].filter(Boolean).join(', ')})`
            : 'Curated Inspiration Feed'}
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {!isSearching && (
            <button
              className="btn-icon"
              onClick={handleRefreshFeed}
              style={{ background: 'rgba(255, 255, 255, 0.05)', fontSize: '0.8rem' }}
              title="Refresh curated photo feed"
            >
              <RefreshCw size={14} />
              <span>New Photos</span>
            </button>
          )}
        </div>
      </div>

      {activeResult.status === 'error' && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-error)', color: '#f87171', padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            ⚠️ {activeResult.error?.message || 'An error occurred while fetching photos.'}
          </div>
          {onOpenApiKeyModal && (
            <button
              className="btn-icon"
              style={{ background: 'var(--color-error)', color: '#fff', border: 'none', fontWeight: 600 }}
              onClick={onOpenApiKeyModal}
            >
              Set Valid API Key
            </button>
          )}
        </div>
      )}

      {/* Shimmer Skeleton Cards while loading */}
      {activeResult.status === 'loading' && (
        <div className="photo-masonry">
          {Array.from({ length: 12 }).map((_, idx) => (
            <div key={idx} className="masonry-item">
              <div className="skeleton-card" style={{ paddingTop: idx % 2 === 0 ? '133%' : '100%' }}>
                <div className="skeleton-shimmer" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pinterest-style Column Masonry Grid */}
      {activeResult.status !== 'loading' && photos.length > 0 && (
        <div {...getGridProps({ className: 'photo-masonry' })}>
          {gridItems.map((gi: GridItem<PexelsPhoto>) => {
            const isFav = favoritePhotoIds.has(gi.item.id);
            return (
              <div {...getItemProps(gi, { className: 'masonry-item' })} key={gi.key}>
                <div className="pin-card" style={{ position: 'relative' }}>
                  <img
                    src={gi.item.src.large || gi.item.src.medium}
                    alt={gi.item.alt || `Photo by ${gi.item.photographer}`}
                    className="pin-img"
                    loading="lazy"
                  />

                  {/* Card Hover Action Bar & Info */}
                  <div className="pin-overlay">
                    <div className="pin-top-actions">
                      <button
                        className={`pin-btn-icon ${isFav ? 'favorited' : ''}`}
                        onClick={(e) => { e.stopPropagation(); toggleFavoritePhoto(gi.item); }}
                        title={isFav ? 'Saved to favorites' : 'Save to favorites'}
                      >
                        <Heart size={16} fill={isFav ? 'currentColor' : 'none'} color={isFav ? '#ec4899' : 'currentColor'} />
                      </button>
                      <button
                        className="pin-btn-icon"
                        onClick={(e) => handleShare(e, gi.item)}
                        title="Share photo"
                      >
                        <Share2 size={16} />
                      </button>
                    </div>

                    <div className="pin-bottom-info">
                      <span className="pin-author">{gi.item.photographer}</span>
                      <div className="pin-meta">
                        <span>{gi.item.width} × {gi.item.height} px</span>
                        <button
                          className="pin-download-btn"
                          onClick={(e) => handleDirectDownload(e, gi.item)}
                          title="Download photo"
                        >
                          <Download size={13} />
                          <span>Save</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {activeResult.status === 'success' && photos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ImageOff size={32} color="var(--text-dim)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)' }}>No inspiration found</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Try searching for something else or reset your active filters.
            </p>
          </div>
          <button className="btn-icon" onClick={handleResetFilters}>
            <span>Reset Search</span>
          </button>
        </div>
      )}

      {/* Infinite Scroll Sentinel */}
      <div ref={sentinelRef} className="sentinel">
        {activeResult.isFetchingNextPage && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
            <span className="animate-spin" style={{ fontSize: '1.25rem' }}>⏳</span>
            <span>Discovering more inspiration...</span>
          </div>
        )}
        {!activeResult.hasNextPage && photos.length > 0 && <p style={{ color: 'var(--text-dim)' }}>✦ End of collection ✦</p>}
      </div>

      {/* Headless Lightbox Modal */}
      <PhotoLightboxModal lightbox={lightbox} photos={photos} onDownload={download} />
    </div>
  );
}
