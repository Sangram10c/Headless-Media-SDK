import { Activity, X, Trash2 } from 'lucide-react';
import { type MediaEvent } from '@headless-media/core';

interface EventLogDrawerProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly events: readonly MediaEvent[];
  readonly onClear: () => void;
}

export function EventLogDrawer({ isOpen, onClose, events, onClear }: EventLogDrawerProps) {
  return (
    <div className={`event-drawer ${isOpen ? 'open' : ''}`}>
      <div className="drawer-header">
        <div className="drawer-title">
          <Activity size={18} color="var(--primary)" />
          <span>Live SDK Event Stream</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {events.length > 0 && (
            <button className="btn-icon" onClick={onClear} title="Clear event log" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
              <Trash2 size={13} />
              <span>Clear</span>
            </button>
          )}
          <button className="btn-icon" onClick={onClose} style={{ borderRadius: '50%', padding: '0.35rem' }} title="Close drawer">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="event-list">
        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            📡 Listening for SDK events...
            <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-dim)' }}>
              Perform searches, view photos, or click downloads to observe real-time event emissions.
            </p>
          </div>
        ) : (
          events.map((ev, index) => {
            const time = new Date(ev.timestamp).toLocaleTimeString();
            return (
              <div key={`${ev.timestamp}-${index}`} className="event-card">
                <span className={`event-tag ${ev.type}`}>{ev.type}</span>
                <span style={{ float: 'right', color: 'var(--text-dim)', fontSize: '0.7rem' }}>{time}</span>
                <div style={{ color: 'var(--text-main)', marginTop: '0.2rem', wordBreak: 'break-all' }}>
                  {renderEventPayload(ev)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function renderEventPayload(ev: MediaEvent): string {
  switch (ev.type) {
    case 'search':
      return `query: "${ev.query}" (${ev.mediaType})`;
    case 'view':
      return `id: ${String(ev.id)} (${ev.mediaType})`;
    case 'download':
      return `url: ${ev.url}`;
    case 'cache-hit':
    case 'cache-miss':
      return `key: ${ev.key}`;
    case 'error':
      return `error: ${ev.error.message}`;
    default:
      return '';
  }
}
