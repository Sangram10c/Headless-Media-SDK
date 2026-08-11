import { useState, useMemo, useCallback, useEffect } from 'react';
import { MediaProvider, useMediaEvents } from '@headless-media/react';
import { createApiKey, type MediaEvent, type MediaClientConfig } from '@headless-media/core';
import { Key } from 'lucide-react';

import { Header } from './components/Header';
import { PhotoGrid } from './components/PhotoGrid';
import { VideoReels } from './components/VideoReels';
import { FavoritesView } from './components/FavoritesView';
import { EventLogDrawer } from './components/EventLogDrawer';
import { ApiKeyModal } from './components/ApiKeyModal';
import { FavoritesProvider } from './context/FavoritesContext';

import './styles/app.css';

/**
 * Validates a raw API key string against Pexels API endpoint.
 * Returns true if the Pexels API accepts the key (status 200 + valid JSON payload).
 */
async function validatePexelsApiKey(key: string): Promise<boolean> {
  const trimmed = key.trim();
  if (!trimmed || trimmed.length < 20) return false; // Pexels keys are always long
  try {
    const res = await fetch('https://api.pexels.com/v1/curated?per_page=1', {
      method: 'GET',
      headers: {
        Authorization: trimmed,
      },
    });
    if (!res.ok) return false; // 401, 403, etc.
    // Verify the response actually contains Pexels data (not a redirect or error page)
    const json = await res.json() as Record<string, unknown>;
    return typeof json === 'object' && json !== null && ('photos' in json || 'videos' in json);
  } catch {
    // Network error or JSON parse error
    return false;
  }
}

export function App() {
  const [apiKey, setApiKey] = useState(() => {
    const isExplicitlyRemoved = localStorage.getItem('PEXELS_KEY_REMOVED') === 'true';
    if (isExplicitlyRemoved) {
      return '';
    }
    const stored = localStorage.getItem('PEXELS_API_KEY')?.trim();
    if (stored) return stored;
    const envKey = (import.meta.env.VITE_PEXELS_API_KEY as string | undefined)?.trim();
    if (envKey) return envKey;
    return '';
  });

  const [isKeyValid, setIsKeyValid] = useState<boolean>(false);

  // Validate active API key on mount / change
  useEffect(() => {
    if (apiKey) {
      validatePexelsApiKey(apiKey).then((valid) => setIsKeyValid(valid));
    } else {
      setIsKeyValid(false);
    }
  }, [apiKey]);

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
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [events, setEvents] = useState<readonly MediaEvent[]>([]);

  // Automatically prompt for API key only if completely missing or invalid
  useEffect(() => {
    if (!apiKey) {
      setIsApiKeyModalOpen(true);
    }
  }, [apiKey]);

  const handleSaveApiKey = useCallback(async (newKey: string): Promise<boolean> => {
    const isValid = await validatePexelsApiKey(newKey);
    if (isValid) {
      setApiKey(newKey);
      setIsKeyValid(true);
      setApiKeyError(null);
      localStorage.setItem('PEXELS_API_KEY', newKey);
      localStorage.removeItem('PEXELS_KEY_REMOVED');
      return true;
    } else {
      setIsKeyValid(false);
      return false;
    }
  }, []);

  const handleRemoveApiKey = useCallback(() => {
    setApiKey('');
    setIsKeyValid(false);
    setApiKeyError(null);
    localStorage.removeItem('PEXELS_API_KEY');
    localStorage.setItem('PEXELS_KEY_REMOVED', 'true');
  }, []);

  // Construct SDK Config dynamically based on API key
  const sdkConfig = useMemo<MediaClientConfig>(() => {
    return {
      apiKey: createApiKey(apiKey || 'UNCONFIGURED_PEXELS_API_KEY'),
      cache: { ttl: 5 * 60 * 1000, maxEntries: 100 },
      retry: { maxRetries: 3, baseDelay: 1000, maxDelay: 8000, jitter: true },
      logger: false, // Logged via custom subscriber below
    };
  }, [apiKey]);

  const handleEvent = useCallback((ev: MediaEvent) => {
    setEvents((prev) => [ev, ...prev].slice(0, 100)); // Keep last 100 events

    // Catch invalid / wrong API key authentication errors and open modal
    if (ev.type === 'error') {
      const isAuthError =
        ev.error.name === 'AuthenticationError' ||
        ev.error.code === 'AUTHENTICATION_ERROR' ||
        (ev.error as unknown as { statusCode?: number }).statusCode === 401 ||
        ev.error.message.toLowerCase().includes('auth') ||
        ev.error.message.toLowerCase().includes('key') ||
        ev.error.message.toLowerCase().includes('unauthorized');

      if (isAuthError) {
        setIsKeyValid(false);
        setApiKeyError('Invalid Pexels API Key. Please enter a valid key from pexels.com/api.');
        setIsApiKeyModalOpen(true);
      }
    }
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
            onOpenApiKeyModal={() => {
              setApiKeyError(null);
              setIsApiKeyModalOpen(true);
            }}
            hasApiKey={isKeyValid}
          />

          <main className="main-content">
            {!isKeyValid && (
              <div className="api-key-alert-banner">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div className="alert-icon-pulse">
                    <Key size={20} color="#f59e0b" />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#f59e0b' }}>
                      Valid Pexels API Key Required
                    </h4>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      You are browsing without a validated API key. Please add a valid Pexels API key to explore live photos and video reels.
                    </p>
                  </div>
                </div>
                <button
                  className="nav-btn active"
                  onClick={() => {
                    setApiKeyError(null);
                    setIsApiKeyModalOpen(true);
                  }}
                  style={{ border: 'none', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#fff', fontWeight: 600, padding: '0.55rem 1.1rem', cursor: 'pointer' }}
                >
                  <Key size={15} />
                  <span>Configure Valid API Key</span>
                </button>
              </div>
            )}

            {activeTab === 'photos' && <PhotoGrid onOpenApiKeyModal={() => { setApiKeyError(null); setIsApiKeyModalOpen(true); }} />}
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
              errorMessage={apiKeyError}
              onSave={handleSaveApiKey}
              onRemove={handleRemoveApiKey}
              onClose={() => {
                setIsApiKeyModalOpen(false);
                setApiKeyError(null);
              }}
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
