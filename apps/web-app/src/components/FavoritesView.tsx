import { useState, useRef } from 'react';
import {
  Heart,
  Image as ImageIcon,
  Film,
  Download,
  Share2,
  Trash2,
  Sparkles,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { PexelsPhoto, PexelsVideo } from '@headless-media/react';
import type { VideoFile } from '@headless-media/core';
import { useLightbox } from '@headless-media/ui-react';
import { useFavorites } from '../context/FavoritesContext';
import { PhotoLightboxModal } from './PhotoLightboxModal';
import { photoToLightboxItem, getVideoSource, triggerFileDownload } from '../utils/media-adapters';

const MASONRY_ASPECT_RATIOS = [0.85, 0.6, 1.05, 0.55, 0.75, 0.65, 1.15, 0.58];

function getDynamicAspectRatio(index: number, width: number, height: number): number {
  const hash = Math.abs(width ^ height ^ (index * 37));
  return MASONRY_ASPECT_RATIOS[hash % MASONRY_ASPECT_RATIOS.length] ?? 0.65;
}

interface FavoritesViewProps {
  readonly onNavigateToTab: (tab: 'photos' | 'reels') => void;
}

export function FavoritesView({ onNavigateToTab }: FavoritesViewProps) {
  const { favoritePhotos, favoriteVideos, totalFavoritesCount, toggleFavoritePhoto, toggleFavoriteVideo, clearAllFavorites } = useFavorites();

  const [filter, setFilter] = useState<'all' | 'photos' | 'reels'>('all');

  // Photo Lightbox hook
  const photoLightbox = useLightbox({
    items: favoritePhotos.map(photoToLightboxItem),
    loop: true,
  });

  // Video Lightbox hook
  const videoLightbox = useLightbox({
    items: favoriteVideos.map((v) => ({
      src: getVideoSource(v),
      alt: `Video by ${v.user.name}`,
      width: v.width,
      height: v.height,
    })),
    loop: true,
  });

  const photoItems = filter === 'reels' ? [] : favoritePhotos;
  const videoItems = filter === 'photos' ? [] : favoriteVideos;

  const handleShare = async (e: React.MouseEvent, url: string, title: string) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // Ignored
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const handleDownloadPhoto = async (e: React.MouseEvent, photo: PexelsPhoto) => {
    e.stopPropagation();
    const downloadUrl = photo.src.original;
    await triggerFileDownload(downloadUrl, `pexels-fav-photo-${photo.id}.jpg`);
  };

  const handleDownloadVideo = async (e: React.MouseEvent, video: PexelsVideo) => {
    e.stopPropagation();
    const hdFile = video.video_files.find((f: VideoFile) => f.quality === 'hd') || video.video_files[0];
    if (hdFile?.link) {
      await triggerFileDownload(hdFile.link, `pexels-fav-video-${video.id}.mp4`);
    }
  };

  if (totalFavoritesCount === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Heart size={40} color="#ec4899" fill="rgba(236, 72, 153, 0.2)" />
        </div>

        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Your Favorites Collection is Empty
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.35rem', maxWidth: 460 }}>
            Click the heart <Heart size={14} style={{ display: 'inline', verticalAlign: 'middle', color: '#ec4899' }} /> icon on any photo or video reel while browsing to save it to your personal collection.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <button className="btn-icon" onClick={() => onNavigateToTab('photos')}>
            <ImageIcon size={16} />
            <span>Explore Photos</span>
          </button>
          <button className="btn-icon" onClick={() => onNavigateToTab('reels')}>
            <Film size={16} />
            <span>Explore Video Reels</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Heart size={22} color="#ec4899" fill="currentColor" />
            Saved Favorites ({totalFavoritesCount})
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            Your saved collection of photos and video reels
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            className="btn-icon"
            onClick={clearAllFavorites}
            style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#f87171' }}
            title="Clear all saved favorites"
          >
            <Trash2 size={15} />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filters-row">
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Sparkles size={14} color="var(--primary)" />
          Filter Collection:
        </span>
        <button
          className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Items ({totalFavoritesCount})
        </button>
        <button
          className={`filter-chip ${filter === 'photos' ? 'active' : ''}`}
          onClick={() => setFilter('photos')}
        >
          Photos ({favoritePhotos.length})
        </button>
        <button
          className={`filter-chip ${filter === 'reels' ? 'active' : ''}`}
          onClick={() => setFilter('reels')}
        >
          Video Reels ({favoriteVideos.length})
        </button>
      </div>

      {/* Masonry Grid of Saved Photos & Video Reels */}
      <div className="photo-masonry">
        {/* Saved Photos */}
        {photoItems.map((photo, index) => {
          const imgSrc = photo.src.large || photo.src.medium;
          return (
            <div key={`fav-photo-${photo.id}`} className="masonry-item">
              <div
                className="pin-card"
                onClick={() => photoLightbox.open(index)}
                style={{ position: 'relative' }}
              >
                <img
                  src={imgSrc}
                  alt={photo.alt || `Photo by ${photo.photographer}`}
                  className="pin-img"
                  style={{ aspectRatio: `${photo.width / photo.height}` }}
                  loading="lazy"
                />

                <div className="pin-overlay">
                  <div className="pin-top-actions">
                    <button
                      className="pin-btn-icon favorited"
                      onClick={(e) => { e.stopPropagation(); toggleFavoritePhoto(photo); }}
                      title="Remove from favorites"
                    >
                      <Heart size={16} fill="currentColor" color="#ec4899" />
                    </button>
                    <button
                      className="pin-btn-icon"
                      onClick={(e) => handleShare(e, photo.url, `Photo by ${photo.photographer}`)}
                      title="Share photo"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>

                  <div className="pin-bottom-info">
                    <span className="pin-author">@{photo.photographer}</span>
                    <div className="pin-meta">
                      <span>📸 Photo • {photo.width}×{photo.height}</span>
                      <button
                        className="pin-download-btn"
                        onClick={(e) => handleDownloadPhoto(e, photo)}
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

        {/* Saved Videos */}
        {videoItems.map((video, index) => {
          const aspectRatio = getDynamicAspectRatio(index, video.width, video.height);
          return (
            <div key={`fav-video-${video.id}`} className="masonry-item">
              <FavVideoCard
                video={video}
                aspectRatio={aspectRatio}
                onRemove={() => toggleFavoriteVideo(video)}
                onClick={() => videoLightbox.open(index)}
                onDownload={(e) => handleDownloadVideo(e, video)}
                onShare={(e) => handleShare(e, video.url, `Video by ${video.user.name}`)}
              />
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal for Photo viewing */}
      <PhotoLightboxModal
        lightbox={photoLightbox}
        photos={favoritePhotos}
        onDownload={(url) => triggerFileDownload(url, 'favorite-photo.jpg')}
      />

      {/* Lightbox Modal for Video Reel viewing */}
      <FavVideoLightboxModal lightbox={videoLightbox} videos={favoriteVideos} />
    </div>
  );
}

/* Video Card Component for Favorites Grid */
function FavVideoCard({
  video,
  aspectRatio,
  onRemove,
  onClick,
  onDownload,
  onShare,
}: {
  readonly video: PexelsVideo;
  readonly aspectRatio: number;
  readonly onRemove: () => void;
  readonly onClick: () => void;
  readonly onDownload: (e: React.MouseEvent) => void;
  readonly onShare: (e: React.MouseEvent) => void;
}) {
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
      onClick={onClick}
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
            className="pin-btn-icon favorited"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            title="Remove from favorites"
          >
            <Heart size={16} fill="currentColor" color="#ec4899" />
          </button>
          <button className="pin-btn-icon" onClick={onShare} title="Share video">
            <Share2 size={16} />
          </button>
        </div>

        <div className="pin-bottom-info">
          <span className="pin-author">@{video.user.name || 'Pexels Creator'}</span>
          <div className="pin-meta">
            <span>🎥 Reel • {video.duration}s</span>
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

/* Lightbox Modal for Favorited Videos */
function FavVideoLightboxModal({ lightbox, videos }: { readonly lightbox: ReturnType<typeof useLightbox>; readonly videos: readonly PexelsVideo[] }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!lightbox.isOpen) return null;

  const currentVideo = videos[lightbox.currentIndex];
  const videoSrc = currentVideo ? getVideoSource(currentVideo) : '';

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
    }
  };

  const handleTimeUpdate = () => {
    const videoEl = videoRef.current;
    if (videoEl && videoEl.duration > 0) {
      setProgress((videoEl.currentTime / videoEl.duration) * 100);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentVideo || downloading) return;
    setDownloading(true);
    try {
      const hdFile = currentVideo.video_files.find((f: VideoFile) => f.quality === 'hd') || currentVideo.video_files[0];
      if (hdFile?.link) {
        await triggerFileDownload(hdFile.link, `pexels-fav-video-${currentVideo.id}.mp4`);
      }
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch {
      // Ignored
    } finally {
      setDownloading(false);
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

            <button {...lightbox.getCloseButtonProps({ className: 'lightbox-btn-close', title: 'Close (Esc)' })}>
              <X size={18} />
            </button>
          </div>
        </div>

        <button {...lightbox.getPrevButtonProps({ className: 'lightbox-nav-btn lightbox-prev' })}>
          <ChevronLeft size={24} />
        </button>

        <div className="reel-slide" onClick={togglePlay} style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--border-glass-bright)' }}>
          <button className="reel-audio-btn" onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          {videoSrc ? (
            <video ref={videoRef} src={videoSrc} autoPlay loop playsInline className="reel-video" onTimeUpdate={handleTimeUpdate} />
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
            <div className="reel-overlay">
              <span className="reel-user">@{currentVideo.user.name || 'Pexels Creator'}</span>
              <span className="reel-meta">⏱ {currentVideo.duration}s</span>
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
