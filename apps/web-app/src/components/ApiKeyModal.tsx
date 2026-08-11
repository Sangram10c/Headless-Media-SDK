import React, { useState } from 'react';
import { Key, Trash2, Check, ExternalLink, AlertTriangle, Loader2 } from 'lucide-react';

interface ApiKeyModalProps {
  readonly currentKey: string;
  readonly errorMessage?: string | null;
  readonly onSave: (key: string) => Promise<boolean> | boolean;
  readonly onRemove: () => void;
  readonly onClose: () => void;
}

export function ApiKeyModal({ currentKey, errorMessage, onSave, onRemove, onClose }: ApiKeyModalProps) {
  const [inputKey, setInputKey] = useState(currentKey);
  const [isValidating, setIsValidating] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const activeError = localError || errorMessage;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const keyToTest = inputKey.trim();
    if (!keyToTest || isValidating) return;

    setIsValidating(true);
    setLocalError(null);

    try {
      const isValid = await onSave(keyToTest);
      if (isValid) {
        onClose();
      } else {
        setLocalError('Invalid Pexels API Key. Authentication failed. Please enter a valid API key.');
      }
    } catch {
      setLocalError('Unable to validate API key. Please check your network connection.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemove = () => {
    setInputKey('');
    onRemove();
    onClose();
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <Key size={20} />
          </div>
          <h2 className="modal-title" style={{ margin: 0 }}>Manage Pexels API Key</h2>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.5 }}>
          {currentKey
            ? 'Your Pexels API key is active. You can update it or remove it anytime below.'
            : 'Enter your Pexels API key to power the Headless Media SDK feed. Your key is kept secure in local storage.'}
        </p>

        {activeError && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#f87171',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.82rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontWeight: 500
          }}>
            <AlertTriangle size={18} style={{ flexShrink: 0, color: '#f87171' }} />
            <span>{activeError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.4rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Pexels API Key
            </label>
            <input
              type="password"
              className="search-input"
              style={{ paddingLeft: '1rem' }}
              placeholder="Paste your valid Pexels API Key here..."
              value={inputKey}
              onChange={(e) => {
                setInputKey(e.target.value);
                if (localError) setLocalError(null);
              }}
              disabled={isValidating}
              autoFocus
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem' }}>
            {currentKey ? (
              <button
                type="button"
                className="btn-icon"
                onClick={handleRemove}
                disabled={isValidating}
                style={{ background: 'rgba(239, 68, 68, 0.12)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#f87171' }}
                title="Remove saved API Key"
              >
                <Trash2 size={15} />
                <span>Remove Key</span>
              </button>
            ) : (
              <div />
            )}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn-icon"
                onClick={onClose}
                disabled={isValidating}
                style={{ background: 'transparent' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="nav-btn active"
                style={{ border: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                disabled={!inputKey.trim() || isValidating}
              >
                {isValidating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Validating Key...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>{currentKey ? 'Update Key' : 'Save Key'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', margin: 0 }}>
            Don't have a Pexels API Key?
          </p>
          <a
            href="https://www.pexels.com/api/"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <span>Get Free Key (30s)</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
