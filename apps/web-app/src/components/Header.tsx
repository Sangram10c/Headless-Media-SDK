import { Zap, Image as ImageIcon, Film, Heart, Key, Radio } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';

interface HeaderProps {
  readonly activeTab: 'photos' | 'reels' | 'favorites';
  readonly onTabChange: (tab: 'photos' | 'reels' | 'favorites') => void;
  readonly eventCount: number;
  readonly onToggleEventDrawer: () => void;
  readonly onOpenApiKeyModal: () => void;
  readonly hasApiKey: boolean;
}

export function Header({
  activeTab,
  onTabChange,
  eventCount,
  onToggleEventDrawer,
  onOpenApiKeyModal,
  hasApiKey,
}: HeaderProps) {
  const { totalFavoritesCount } = useFavorites();

  return (
    <header className="header">
      <div className="header-content">
        {/* Left: Brand Logo */}
        <a href="#" className="brand-logo" onClick={(e) => { e.preventDefault(); onTabChange('photos'); }}>
          <div className="brand-icon-wrapper">
            <Zap size={20} fill="currentColor" />
          </div>
          <span>Headless Media <span className="brand-badge">SDK</span></span>
        </a>

        {/* Center: Navigation Tabs (Photos, Video Reels, Favorites) */}
        <nav className="nav-tabs">
          <button
            className={`nav-btn ${activeTab === 'photos' ? 'active' : ''}`}
            onClick={() => onTabChange('photos')}
          >
            <ImageIcon size={16} />
            <span>Photos</span>
          </button>
          <button
            className={`nav-btn ${activeTab === 'reels' ? 'active' : ''}`}
            onClick={() => onTabChange('reels')}
          >
            <Film size={16} />
            <span>Video Reels</span>
          </button>
          <button
            className={`nav-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => onTabChange('favorites')}
            style={{
              borderColor: activeTab === 'favorites' ? 'rgba(236, 72, 153, 0.4)' : undefined,
              color: activeTab === 'favorites' ? '#ec4899' : undefined,
            }}
          >
            <Heart size={16} fill={activeTab === 'favorites' ? 'currentColor' : 'none'} color="#ec4899" />
            <span>Favorites</span>
            {totalFavoritesCount > 0 && (
              <span className="fav-count-badge">{totalFavoritesCount}</span>
            )}
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="header-actions">
          <button
            className="btn-icon"
            onClick={onOpenApiKeyModal}
            title={hasApiKey ? 'Pexels API Key is active.' : 'Configure Pexels API Key.'}
            style={{
              borderColor: hasApiKey ? 'rgba(16, 185, 129, 0.4)' : undefined,
              background: hasApiKey ? 'rgba(16, 185, 129, 0.1)' : undefined,
            }}
          >
            <Key size={15} color={hasApiKey ? '#34d399' : 'currentColor'} />
            <span style={{ color: hasApiKey ? '#34d399' : undefined }}>
              {hasApiKey ? 'API Key Active' : 'Set Key'}
            </span>
          </button>

          <button className="btn-icon" onClick={onToggleEventDrawer}>
            <Radio size={15} color="#8b5cf6" />
            <span>SDK Events</span>
            {eventCount > 0 && <span className="event-count-badge">{eventCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
