import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Heart,
  Download,
  Share2,
  Volume2,
  VolumeX,
  Play,
  RefreshCw,
  Search,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  VideoOff,
  Check,
  Loader2,
} from 'lucide-react';
import { useMedia, type PexelsVideo } from '@headless-media/react';
import { useLightbox, useGrid } from '@headless-media/ui-react';
import { useInfiniteScroll } from '../hooks/use-infinite-scroll';
import { getVideoSource, triggerFileDownload } from '../utils/media-adapters';
import { useFavorites } from '../context/FavoritesContext';

const PRESET_REEL_TOPICS = [
  'Nature',
  'Urban',
  'Travel',
  'Ocean',
  'Cyberpunk',
  'Drone',
  'Abstract',
  'Neon',
  'Fitness',
  'Night Life',
];

function getRandomTopic(): string {
  return PRESET_REEL_TOPICS[Math.floor(Math.random() * PRESET_REEL_TOPICS.length)] ?? 'Nature';
}

function getRandomPage(): number {
  return Math.floor(Math.random() * 6) + 1;
}

const MASONRY_ASPECT_RATIOS = [0.85, 0.6, 1.05, 0.55, 0.75, 0.65, 1.15, 0.58];

function getDynamicAspectRatio(index: number, width: number, height: number): number {
  const hash = Math.abs(width ^ height ^ (index * 37));
  return MASONRY_ASPECT_RATIOS[hash % MASONRY_ASPECT_RATIOS.length] ?? 0.65;
}

export function VideoReels() {
  const client = useMedia();
  const [videos, setVideos] = useState<readonly PexelsVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState(() => getRandomTopic());

  // Pagination state for infinite scrolling
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  // Favorites context
  const { favoriteVideoIds, toggleFavoriteVideo } = useFavorites();

  // Lightbox hook for video reel modal player
  const lightbox = useLightbox({
    items: videos.map((v) => ({
      src: getVideoSource(v),
      alt: `Video by ${v.user.name}`,
      width: v.width,
      height: v.height,
    })),
    loop: true,
  });

  // Headless grid hook
  const { gridItems, getGridProps, getItemProps } = useGrid<PexelsVideo>({
    items: videos,
    columns: 5,
    gap: 16,
    getItemKey: (v) => v.id,
    onItemClick: (_, index) => lightbox.open(index),
  });

  // Fetch videos for a target topic/query
  const fetchReelTopic = useCallback(
    async (topicQuery: string, targetPage = 1) => {
      setLoading(true);
      setError(null);
      setActiveTopic(topicQuery);
      setPage(targetPage);

      try {
        const res = await client.searchVideos({
          query: `${topicQuery} vertical`,
          orientation: 'portrait',
          per_page: 15,
          page: targetPage,
        });

        if (res.data.length > 0) {
          setVideos(res.data);
          setHasNextPage(Boolean(res.nextPage));
        } else {
          const popularRes = await client.getPopularVideos({ per_page: 15, page: targetPage });
          setVideos(popularRes.data);
          setHasNextPage(Boolean(popularRes.nextPage));
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch video reels');
      } finally {
        setLoading(false);
      }
    },
    [client],
  );

  useEffect(() => {
    fetchReelTopic(activeTopic, getRandomPage());
  }, [fetchReelTopic]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchReelTopic(searchQuery.trim(), 1);
    }
  };

  const handleTopicClick = (topic: string) => {
    setSearchQuery('');
    fetchReelTopic(topic, 1);
  };

  const handleRefreshFeed = () => {
    const nextTopic = getRandomTopic();
    setSearchQuery('');
    fetchReelTopic(nextTopic, getRandomPage());
  };

  // Fetch next page for infinite scroll
  const fetchNextPage = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    setIsFetchingNextPage(true);
    const nextPage = page + 1;

    client
      .searchVideos({
        query: `${activeTopic} vertical`,
        orientation: 'portrait',
        per_page: 15,
        page: nextPage,
      })
      .then((res) => {
        if (res.data.length > 0) {
          setVideos((prev) => [...prev, ...res.data]);
          setPage(nextPage);
          setHasNextPage(Boolean(res.nextPage));
        } else {
          setHasNextPage(false);
        }
      })
      .catch((err: unknown) => {
        console.error('[SDK] Error loading next video page:', err);
      })
      .finally(() => {
        setIsFetchingNextPage(false);
      });
  }, [client, activeTopic, hasNextPage, isFetchingNextPage, page]);

  const sentinelRef = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasMore: hasNextPage,
    isLoading: isFetchingNextPage || loading,
  });

  const handleDirectDownload = async (e: React.MouseEvent, video: PexelsVideo) => {
    e.stopPropagation();
    const hdFile = video.video_files.find((f) => f.quality === 'hd') || video.video_files[0];
    if (hdFile?.link) {
      client.download(hdFile.link);
      await triggerFileDownload(hdFile.link, `pexels-video-${video.id}.mp4`);
    }
  };

  const handleShare = async (e: React.MouseEvent, video: PexelsVideo) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({ title: `Video by ${video.user.name}`, url: video.url });
      } catch {
        // Ignored
      }
    } else {
      await navigator.clipboard.writeText(video.url);
      alert('Video link copied to clipboard!');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Floating Search & Topic Filter Pills */}
      <div className="search-container">
        <form onSubmit={handleSearchSubmit} className="search-input-wrapper">
          <span className="search-icon">
            <Search size={20} />
          </span>
          <input
            type="text"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vertical video reels & motions..."
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => { setSearchQuery(''); fetchReelTopic('Nature', 1); }}
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </form>

        <div className="filters-row">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={14} color="var(--primary)" />
            Explore Topics:
          </span>

          {PRESET_REEL_TOPICS.map((topic) => (
            <button
              key={topic}
              className={`filter-chip ${activeTopic.toLowerCase() === topic.toLowerCase() ? 'active' : ''}`}
              onClick={() => handleTopicClick(topic)}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Header section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700 }}>
            {searchQuery.trim() ? `Video Reels for "${searchQuery}"` : `Trending Video Reels: ${activeTopic}`}
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            Click any video reel to open fullscreen player and scroll through related reels
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            className="btn-icon"
            onClick={handleRefreshFeed}
            style={{ background: 'rgba(255, 255, 255, 0.05)', fontSize: '0.8rem' }}
            title="Refresh feed with new video reels"
          >
            <RefreshCw size={14} />
            <span>New Reels</span>
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-error)', color: '#f87171', padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="photo-masonry">
          {Array.from({ length: 12 }).map((_, idx) => {
            const ratio = MASONRY_ASPECT_RATIOS[idx % MASONRY_ASPECT_RATIOS.length] ?? 0.65;
            return (
              <div key={idx} className="masonry-item">
                <div className="skeleton-card" style={{ paddingTop: `${(1 / ratio) * 100}%` }}>
                  <div className="skeleton-shimmer" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && videos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <VideoOff size={32} color="var(--text-dim)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)' }}>No video reels found</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Try searching for a different topic like "Nature" or "Cyberpunk".
            </p>
          </div>
          <button className="btn-icon" onClick={() => handleTopicClick('Nature')}>
            <span>Reset Search</span>
          </button>
        </div>
      )}

      {/* Pinterest Video Masonry Grid */}
      {!loading && videos.length > 0 && (
        <div {...getGridProps({ className: 'photo-masonry' })}>
          {gridItems.map((gi, index) => {
            const isFav = favoriteVideoIds.has(gi.item.id);
            const aspectRatio = getDynamicAspectRatio(index, gi.item.width, gi.item.height);
            return (
              <div {...getItemProps(gi, { className: 'masonry-item' })} key={gi.key}>
                <VideoMasonryCard
                  video={gi.item}
                  aspectRatio={aspectRatio}
                  isFav={isFav}
                  onToggleFav={(e) => { e.stopPropagation(); toggleFavoriteVideo(gi.item); }}
                  onDownload={(e) => handleDirectDownload(e, gi.item)}
                  onShare={(e) => handleShare(e, gi.item)}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Infinite Scroll Sentinel */}
      <div ref={sentinelRef} className="sentinel">
        {isFetchingNextPage && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
            <Loader2 size={18} className="animate-spin" />
            <span>Loading more video reels...</span>
          </div>
        )}
        {!hasNextPage && videos.length > 0 && <p style={{ color: 'var(--text-dim)' }}>✦ End of collection ✦</p>}
      </div>

      {/* Fullscreen Video Reel Lightbox Modal */}
      <VideoLightboxModal lightbox={lightbox} videos={videos} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PINTEREST VIDEO MASONRY CARD
   ───────────────────────────────────────────────────────────── */
interface VideoMasonryCardProps {
  readonly video: PexelsVideo;
  readonly aspectRatio: number;
  readonly isFav: boolean;
  readonly onToggleFav: (e: React.MouseEvent) => void;
  readonly onDownload: (e: React.MouseEvent) => void;
  readonly onShare: (e: React.MouseEvent) => void;
}

function VideoMasonryCard({ video, aspectRatio, isFav, onToggleFav, onDownload, onShare }: VideoMasonryCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const videoSrc = getVideoSource(video);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="pin-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative' }}
    >
      {videoSrc ? (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={video.image}
          loop
          playsInline
          className="pin-img"
          style={{ objectFit: 'cover', aspectRatio: `${aspectRatio}` }}
        />
      ) : (
        <img src={video.image} alt="Video thumbnail" className="pin-img" style={{ aspectRatio: `${aspectRatio}` }} />
      )}

      {!isHovered && (
        <div style={{ position: 'absolute', top: '0.85rem', left: '0.85rem', zIndex: 3, background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(8px)', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <Play size={14} fill="currentColor" style={{ marginLeft: 2 }} />
        </div>
      )}

      <div className="pin-overlay">
        <div className="pin-top-actions">
          <button
            className={`pin-btn-icon ${isFav ? 'favorited' : ''}`}
            onClick={onToggleFav}
            title={isFav ? 'Saved to favorites' : 'Save to favorites'}
          >
            <Heart size={16} fill={isFav ? 'currentColor' : 'none'} color={isFav ? '#ec4899' : 'currentColor'} />
          </button>
          <button className="pin-btn-icon" onClick={onShare} title="Share video">
            <Share2 size={16} />
          </button>
        </div>

        <div className="pin-bottom-info">
          <span className="pin-author">@{video.user.name || 'Pexels Creator'}</span>
          <div className="pin-meta">
            <span>⏱ {video.duration}s • {video.width}×{video.height}</span>
            <button className="pin-download-btn" onClick={onDownload} title="Download video">
              <Download size={13} />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FULLSCREEN VIDEO REEL LIGHTBOX MODAL
   ───────────────────────────────────────────────────────────── */
function VideoLightboxModal({ lightbox, videos }: { readonly lightbox: ReturnType<typeof useLightbox>; readonly videos: readonly PexelsVideo[] }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { favoriteVideoIds, toggleFavoriteVideo } = useFavorites();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!lightbox.isOpen) return null;

  const currentVideo = videos[lightbox.currentIndex];
  const videoSrc = currentVideo ? getVideoSource(currentVideo) : '';
  const isLiked = currentVideo ? favoriteVideoIds.has(currentVideo.id) : false;

  const togglePlay = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (videoEl.paused) {
      videoEl.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoEl.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      videoRef.current.volume = 1.0;
    }
  };

  const handleTimeUpdate = () => {
    const videoEl = videoRef.current;
    if (videoEl && videoEl.duration > 0) {
      const currentProgress = (videoEl.currentTime / videoEl.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentVideo || downloading) return;

    setDownloading(true);
    setDownloaded(false);

    try {
      const hdFile = currentVideo.video_files.find((f) => f.quality === 'hd') || currentVideo.video_files[0];
      if (hdFile?.link) {
        await triggerFileDownload(hdFile.link, `pexels-video-${currentVideo.id}.mp4`);
      }
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch {
      // Ignored
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentVideo) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: `Video by ${currentVideo.user.name}`, url: currentVideo.url });
      } catch {
        // Ignored
      }
    } else {
      await navigator.clipboard.writeText(currentVideo.url);
      alert('Video link copied to clipboard!');
    }
  };

  return (
    <div {...lightbox.getBackdropProps({ className: 'lightbox-backdrop animate-fade-in' })}>
      <div {...lightbox.getContentProps({ className: 'lightbox-content', style: { maxWidth: 420, height: '85vh' } })}>
        <div className="lightbox-header-bar">
          <div className="lightbox-action-group">
            <button
              type="button"
              className={`lightbox-btn-download ${downloaded ? 'downloaded' : ''}`}
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Downloading...</span>
                </>
              ) : downloaded ? (
                <>
                  <Check size={16} />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>Download Video</span>
                </>
              )}
            </button>

            <button
              {...lightbox.getCloseButtonProps({
                className: 'lightbox-btn-close',
                title: 'Close (Esc)',
              })}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <button {...lightbox.getPrevButtonProps({ className: 'lightbox-nav-btn lightbox-prev' })}>
          <ChevronLeft size={24} />
        </button>

        <div
          className="reel-slide"
          onClick={togglePlay}
          style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--border-glass-bright)' }}
        >
          <button className="reel-audio-btn" onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <div
            style={{
              position: 'absolute',
              right: '1rem',
              bottom: '5rem',
              zIndex: 15,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <button
              className={`pin-btn-icon ${isLiked ? 'favorited' : ''}`}
              onClick={(e) => { e.stopPropagation(); if (currentVideo) toggleFavoriteVideo(currentVideo); }}
              title={isLiked ? 'Saved to favorites' : 'Save to favorites'}
            >
              <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} color={isLiked ? '#ec4899' : 'currentColor'} />
            </button>

            <button className="pin-btn-icon" onClick={handleDownload} title="Download video">
              <Download size={18} />
            </button>

            <button className="pin-btn-icon" onClick={handleShare} title="Share video">
              <Share2 size={18} />
            </button>
          </div>

          {videoSrc ? (
            <video
              ref={videoRef}
              src={videoSrc}
              autoPlay
              loop
              playsInline
              className="reel-video"
              onTimeUpdate={handleTimeUpdate}
            />
          ) : (
            <img src={currentVideo?.image} alt="Video preview" className="reel-video" />
          )}

          {!isPlaying && (
            <div className="reel-play-indicator">
              <div className="reel-play-icon">
                <Play size={32} fill="currentColor" style={{ marginLeft: 4 }} />
              </div>
            </div>
          )}

          {currentVideo && (
            <div className="reel-overlay" style={{ paddingRight: '4rem' }}>
              <span className="reel-user">@{currentVideo.user.name || 'Pexels Creator'}</span>
              <span className="reel-meta">
                ⏱ {currentVideo.duration}s • {currentVideo.width} × {currentVideo.height} px
              </span>
            </div>
          )}

          <div className="reel-progress-bar">
            <div className="reel-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <button {...lightbox.getNextButtonProps({ className: 'lightbox-nav-btn lightbox-next' })}>
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
