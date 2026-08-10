import { useState, useMemo, useCallback, useEffect } from 'react';
import { MediaProvider, useMediaEvents } from '@headless-media/react';
import { createApiKey, type MediaEvent, type MediaClientConfig } from '@headless-media/core';

import { Header } from './components/Header';
import { PhotoGrid } from './components/PhotoGrid';
import { VideoReels } from './components/VideoReels';
import { FavoritesView } from './components/FavoritesView';
import { EventLogDrawer } from './components/EventLogDrawer';
import { ApiKeyModal } from './components/ApiKeyModal';
import { FavoritesProvider } from './context/FavoritesContext';

import './styles/app.css';

export function App() {
  const [apiKey, setApiKey] = useState(() => {
    const envKey = (import.meta.env.VITE_PEXELS_API_KEY as string | undefined)?.trim();
    if (envKey) return envKey;
    const stored = localStorage.getItem('PEXELS_API_KEY')?.trim();
    if (stored) return stored;
    return '';
  });

  // Persist and restore active tab from URL query param / localStorage
  const [activeTab, setActiveTab] = useState<'photos' | 'reels' | 'favorites'>(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'reels' || tabParam === 'photos' || tabParam === 'favorites') return tabParam;

    const storedTab = localStorage.getItem('ACTIVE_TAB');
    if (storedTab === 'reels' || storedTab === 'photos' || storedTab === 'favorites') return storedTab;

    return 'photos';
  });

  const handleTabChange = useCallback((tab: 'photos' | 'reels' | 'favorites') => {
    setActiveTab(tab);
    localStorage.setItem('ACTIVE_TAB', tab);

    // Sync tab param in URL without full page reload
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.replaceState(null, '', url.toString());
  }, []);

  const [isEventDrawerOpen, setIsEventDrawerOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [events, setEvents] = useState<readonly MediaEvent[]>([]);

  // Automatically prompt for API key only if completely missing
  useEffect(() => {
    if (!apiKey) {
      setIsApiKeyModalOpen(true);
    }
  }, [apiKey]);

  const handleSaveApiKey = useCallback((newKey: string) => {
    setApiKey(newKey);
    localStorage.setItem('PEXELS_API_KEY', newKey);
  }, []);

  const handleRemoveApiKey = useCallback(() => {
    setApiKey('');
    localStorage.removeItem('PEXELS_API_KEY');
  }, []);

  // Construct SDK Config dynamically based on API key
  const sdkConfig = useMemo<MediaClientConfig>(() => {
    return {
      apiKey: createApiKey(apiKey),
      cache: { ttl: 5 * 60 * 1000, maxEntries: 100 },
      retry: { maxRetries: 3, baseDelay: 1000, maxDelay: 8000, jitter: true },
      logger: false, // Logged via custom subscriber below
    };
  }, [apiKey]);

  const handleEvent = useCallback((ev: MediaEvent) => {
    setEvents((prev) => [ev, ...prev].slice(0, 100)); // Keep last 100 events
  }, []);

  return (
    <MediaProvider config={sdkConfig}>
      <FavoritesProvider>
        <SDKEventListener onEvent={handleEvent} />

        <div className="app-container">
          <Header
            activeTab={activeTab}
            onTabChange={handleTabChange}
            eventCount={events.length}
            onToggleEventDrawer={() => setIsEventDrawerOpen((prev) => !prev)}
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
            hasApiKey={Boolean(apiKey)}
          />

          <main className="main-content">
            {activeTab === 'photos' && <PhotoGrid onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)} />}
            {activeTab === 'reels' && <VideoReels />}
            {activeTab === 'favorites' && <FavoritesView onNavigateToTab={handleTabChange} />}
          </main>

          <EventLogDrawer
            isOpen={isEventDrawerOpen}
            onClose={() => setIsEventDrawerOpen(false)}
            events={events}
            onClear={() => setEvents([])}
          />

          {isApiKeyModalOpen && (
            <ApiKeyModal
              currentKey={apiKey}
              onSave={handleSaveApiKey}
              onRemove={handleRemoveApiKey}
              onClose={() => setIsApiKeyModalOpen(false)}
            />
          )}
        </div>
      </FavoritesProvider>
    </MediaProvider>
  );
}

function SDKEventListener({ onEvent }: { readonly onEvent: (ev: MediaEvent) => void }) {
  useMediaEvents('search', onEvent);
  useMediaEvents('download', onEvent);
  useMediaEvents('view', onEvent);
  useMediaEvents('cache-hit', onEvent);
  useMediaEvents('cache-miss', onEvent);
  useMediaEvents('error', onEvent);
  return null;
}
