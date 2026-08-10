import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  X,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Download,
  Check,
  Loader2,
  Maximize2,
  RotateCcw,
  ChevronDown,
  Smile,
  Gift,
  Image as ImageIcon,
  Send,
  Sparkles,
} from 'lucide-react';
import { useMedia, type PexelsPhoto } from '@headless-media/react';
import { type UseLightboxReturn } from '@headless-media/ui-react';
import { triggerFileDownload } from '../utils/media-adapters';
import { useFavorites } from '../context/FavoritesContext';

interface PhotoLightboxModalProps {
  readonly lightbox: UseLightboxReturn;
  readonly photos: readonly PexelsPhoto[];
  readonly onDownload?: (url: string) => void;
}

interface CommentItem {
  readonly id: string;
  readonly user: string;
  readonly avatarColor: string;
  readonly text: string;
  readonly time: string;
}

export function PhotoLightboxModal({ lightbox, photos, onDownload }: PhotoLightboxModalProps) {
  const client = useMedia();
  const { favoritePhotoIds, toggleFavoritePhoto } = useFavorites();

  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [comments, setComments] = useState<readonly CommentItem[]>([]);

  // Truly related photos fetched from SDK API for the selected photo
  const [relatedPhotos, setRelatedPhotos] = useState<readonly PexelsPhoto[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  // Active selected photo (either from photos prop or clicked related photo)
  const [activePhotoOverride, setActivePhotoOverride] = useState<PexelsPhoto | null>(null);

  const currentPhoto = activePhotoOverride || photos[lightbox.currentIndex];

  // Reset override on index change
  useEffect(() => {
    setActivePhotoOverride(null);
  }, [lightbox.currentIndex]);

  // Load photo-specific comments dynamically from localStorage
  useEffect(() => {
    if (!currentPhoto) return;
    try {
      const storageKey = `PHOTO_COMMENTS_${currentPhoto.id}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setComments(JSON.parse(stored));
      } else {
        setComments([]);
      }
    } catch {
      setComments([]);
    }
  }, [currentPhoto]);

  // Dynamically fetch TRULY RELATED photos from Pexels API matching the photo topic
  useEffect(() => {
    if (!currentPhoto) return;

    let keyword = 'nature';
    if (currentPhoto.alt && currentPhoto.alt.trim().length > 2) {
      // Pick first 2-3 words for relevant topic search
      keyword = currentPhoto.alt.split(/\s+/).slice(0, 2).join(' ');
    } else if (currentPhoto.photographer) {
      keyword = currentPhoto.photographer;
    }

    setLoadingRelated(true);
    client
      .searchPhotos({ query: keyword, per_page: 9 })
      .then((res) => {
        const filtered = res.data.filter((p) => p.id !== currentPhoto.id);
        if (filtered.length > 0) {
          setRelatedPhotos(filtered);
        } else {
          setRelatedPhotos(photos.filter((p) => p.id !== currentPhoto.id).slice(0, 6));
        }
      })
      .catch(() => {
        setRelatedPhotos(photos.filter((p) => p.id !== currentPhoto.id).slice(0, 6));
      })
      .finally(() => {
        setLoadingRelated(false);
      });
  }, [client, currentPhoto, photos]);

  if (!lightbox.isOpen || !currentPhoto) return null;

  const isLiked = favoritePhotoIds.has(currentPhoto.id);
  const dynamicLikeCount = (currentPhoto.id % 89) + 12 + (isLiked ? 1 : 0);

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoritePhoto(currentPhoto);
  };

  const handleDownloadClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (downloading) return;

    setDownloading(true);
    setDownloaded(false);

    try {
      if (onDownload) onDownload(currentPhoto.src.original);
      const filename = `pexels-photo-${currentPhoto.id}.jpg`;
      await triggerFileDownload(currentPhoto.src.original, filename);

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err) {
      console.error('[Download] Error saving file:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Photo by ${currentPhoto.photographer}`,
          url: currentPhoto.url,
        });
      } catch {
        // Ignored
      }
    } else {
      await navigator.clipboard.writeText(currentPhoto.url);
      alert('Photo link copied to clipboard!');
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !currentPhoto) return;

    const newComment: CommentItem = {
      id: Date.now().toString(),
      user: 'You',
      avatarColor: '#8b5cf6',
      text: newCommentText.trim(),
      time: 'Just now',
    };

    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    setNewCommentText('');

    try {
      localStorage.setItem(`PHOTO_COMMENTS_${currentPhoto.id}`, JSON.stringify(updatedComments));
    } catch {
      // Ignored
    }
  };

  const handleSelectRelatedPhoto = (relPhoto: PexelsPhoto) => {
    const mainListIndex = photos.findIndex((p) => p.id === relPhoto.id);
    if (mainListIndex !== -1) {
      lightbox.open(mainListIndex);
      setActivePhotoOverride(null);
    } else {
      setActivePhotoOverride(relPhoto);
    }
  };

  const photographerInitial = (currentPhoto.photographer || 'P').charAt(0).toUpperCase();

  return (
    <div className="pin-detail-backdrop animate-fade-in" onClick={() => lightbox.close()}>
      <div className="pin-detail-wrapper" onClick={(e) => e.stopPropagation()}>
        {/* Top Sticky Header Bar */}
        <div className="pin-detail-top-nav">
          <button className="pin-detail-back-btn" onClick={() => lightbox.close()} title="Go Back (Esc)">
            <ArrowLeft size={20} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button className="pin-detail-back-btn" onClick={() => lightbox.close()} title="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Main Pinterest Pin Detail Card */}
        <div className="pin-detail-card">
          {/* Left Column: High-Res Photo & Media Controls */}
          <div className="pin-detail-media-container">
            <img
              src={currentPhoto.src.large2x || currentPhoto.src.large || currentPhoto.src.original}
              alt={currentPhoto.alt || `Photo by ${currentPhoto.photographer}`}
              className="pin-detail-img"
            />

            <div className="pin-media-floating-left">
              <span>✦ Pexels API • {currentPhoto.width} × {currentPhoto.height} px</span>
            </div>

            <div className="pin-media-floating-right">
              <button
                className="pin-media-icon-btn"
                onClick={() => window.open(currentPhoto.src.original, '_blank')}
                title="Open Original High-Res Image"
              >
                <Maximize2 size={16} />
              </button>
              <button
                className="pin-media-icon-btn"
                onClick={() => alert(`Photo ID: ${currentPhoto.id}\nPhotographer: ${currentPhoto.photographer}\nDimensions: ${currentPhoto.width}x${currentPhoto.height}`)}
                title="API Details"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {/* Right Column: Action Bar, Creator Info & Comments */}
          <div className="pin-detail-info-panel">
            {/* Action Bar */}
            <div className="pin-detail-action-bar">
              <div className="pin-action-group-left">
                <button
                  className={`pin-action-btn ${isLiked ? 'favorited' : ''}`}
                  onClick={handleToggleLike}
                  title={isLiked ? 'Unlike photo' : 'Like photo'}
                  style={{ color: isLiked ? '#ec4899' : undefined }}
                >
                  <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} color={isLiked ? '#ec4899' : 'currentColor'} />
                  <span>{dynamicLikeCount}</span>
                </button>

                <button className="pin-action-btn" title="Comments">
                  <MessageCircle size={18} />
                  <span>{comments.length}</span>
                </button>

                <button className="pin-action-btn" onClick={handleShare} title="Share photo">
                  <Share2 size={18} />
                </button>

                <button className="pin-action-btn" onClick={handleShare} title="More actions">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              {/* Red Save Button */}
              <button
                className="pin-save-btn"
                onClick={handleDownloadClick}
                disabled={downloading}
                title="Save & Download Original High-Res Image"
              >
                {downloading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : downloaded ? (
                  <>
                    <Check size={16} />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    <span>Save</span>
                  </>
                )}
              </button>
            </div>

            {/* Photographer Info Section */}
            <div className="pin-author-section">
              <div className="pin-author-profile">
                <div className="pin-avatar-circle">{photographerInitial}</div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    {currentPhoto.photographer}
                  </h4>
                  <a
                    href={currentPhoto.photographer_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'none' }}
                  >
                    View profile on Pexels ↗
                  </a>
                </div>
              </div>

              <button
                className="pin-action-btn"
                onClick={() => setIsFollowing((prev) => !prev)}
                style={{
                  background: isFollowing ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                  borderColor: isFollowing ? 'rgba(16, 185, 129, 0.4)' : undefined,
                  color: isFollowing ? '#34d399' : undefined,
                }}
              >
                {isFollowing ? '✓ Following' : 'Follow'}
              </button>
            </div>

            {/* Photo Alt Description */}
            {currentPhoto.alt && (
              <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5, fontWeight: 500 }}>
                {currentPhoto.alt}
              </div>
            )}

            {/* Comments List Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {comments.length} Comments <ChevronDown size={14} />
                </span>
              </div>

              <div className="pin-comments-container">
                {comments.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    💬 No comments yet. Be the first to share your thoughts on this photo!
                  </div>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="pin-comment-item">
                      <div className="pin-avatar-mini" style={{ background: c.avatarColor }}>
                        {c.user.charAt(0).toUpperCase()}
                      </div>
                      <div className="pin-comment-bubble">
                        <span style={{ fontWeight: 700, marginRight: '0.4rem', color: 'var(--text-main)' }}>
                          {c.user}
                        </span>
                        <span>{c.text}</span>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                          {c.time}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Comment Input Bar */}
            <form onSubmit={handlePostComment} className="pin-comment-input-bar">
              <input
                type="text"
                className="pin-comment-input"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Add a comment..."
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                <button type="button" className="btn-icon" style={{ padding: '0.25rem', border: 'none', background: 'transparent' }} title="Add emoji">
                  <Smile size={18} />
                </button>
                <button type="button" className="btn-icon" style={{ padding: '0.25rem', border: 'none', background: 'transparent' }} title="Add sticker">
                  <Gift size={18} />
                </button>
                <button type="button" className="btn-icon" style={{ padding: '0.25rem', border: 'none', background: 'transparent' }} title="Attach image">
                  <ImageIcon size={18} />
                </button>
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="pin-send-btn"
                  style={{
                    background: newCommentText.trim() ? '#e60023' : 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    cursor: newCommentText.trim() ? 'pointer' : 'default',
                  }}
                  title="Send Comment"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom TRULY RELATED Photos Grid (Fetched live from Pexels API search matching photo topic) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="var(--primary)" />
              More like this
            </h3>
            {loadingRelated && (
              <span style={{ fontSize: '0.8rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Loader2 size={14} className="animate-spin" />
                Fetching related photos...
              </span>
            )}
          </div>

          {!loadingRelated && relatedPhotos.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No related photos found.</p>
          ) : (
            <div className="photo-masonry">
              {relatedPhotos.map((photo) => (
                <div
                  key={`related-${photo.id}`}
                  className="masonry-item"
                  onClick={() => handleSelectRelatedPhoto(photo)}
                >
                  <div className="pin-card" style={{ position: 'relative', cursor: 'pointer' }}>
                    <img
                      src={photo.src.medium}
                      alt={photo.alt || `Photo by ${photo.photographer}`}
                      className="pin-img"
                      style={{ aspectRatio: `${photo.width / photo.height}` }}
                    />
                    <div className="pin-overlay">
                      <div className="pin-bottom-info">
                        <span className="pin-author">@{photo.photographer}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
