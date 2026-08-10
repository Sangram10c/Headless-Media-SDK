import { Search, X, Sparkles, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { type Orientation, type Color } from '@headless-media/core';

interface SearchBarProps {
  readonly query: string;
  readonly onQueryChange: (query: string) => void;
  readonly orientation?: Orientation;
  readonly onOrientationChange: (orientation: Orientation | undefined) => void;
  readonly color?: Color;
  readonly onColorChange: (color: Color | undefined) => void;
  readonly onResetFilters?: () => void;
  readonly placeholder?: string;
}

const PRESET_TOPICS = [
  'Nature',
  'Architecture',
  'Cyberpunk',
  'Ocean',
  'Minimalist',
  'Portrait',
  'Landscape',
  'Neon',
  'Abstract',
];

export function SearchBar({
  query,
  onQueryChange,
  orientation,
  onOrientationChange,
  color,
  onColorChange,
  onResetFilters,
  placeholder = 'Search millions of high-res photos via Headless SDK...',
}: SearchBarProps) {
  const hasActiveFilters = Boolean(query || orientation || color);

  return (
    <div className="search-container">
      {/* Floating Pill Search Bar */}
      <div className="search-input-wrapper">
        <span className="search-icon">
          <Search size={20} />
        </span>
        <input
          type="text"
          className="search-input"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
        />
        {query && (
          <button className="search-clear-btn" onClick={() => onQueryChange('')} title="Clear search">
            <X size={15} />
          </button>
        )}
      </div>

      {/* Pinterest Pill Filter Chips */}
      <div className="filters-row">
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Sparkles size={14} color="var(--primary)" />
          Explore:
        </span>

        {PRESET_TOPICS.map((preset) => (
          <button
            key={preset}
            className={`filter-chip ${query.toLowerCase() === preset.toLowerCase() ? 'active' : ''}`}
            onClick={() => onQueryChange(preset)}
          >
            {preset}
          </button>
        ))}

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 600 }}>
            <SlidersHorizontal size={14} />
          </div>

          <select
            className={`filter-select ${orientation ? 'active' : ''}`}
            value={orientation ?? ''}
            onChange={(e) => onOrientationChange((e.target.value as Orientation) || undefined)}
          >
            <option value="">All Orientations</option>
            <option value="landscape">Landscape 📐</option>
            <option value="portrait">Portrait 📱</option>
            <option value="square">Square 🔲</option>
          </select>

          <select
            className={`filter-select ${color ? 'active' : ''}`}
            value={color ?? ''}
            onChange={(e) => onColorChange((e.target.value as Color) || undefined)}
          >
            <option value="">All Colors</option>
            <option value="red">Red 🔴</option>
            <option value="blue">Blue 🔵</option>
            <option value="green">Green 🟢</option>
            <option value="violet">Violet 🟣</option>
            <option value="yellow">Yellow 🟡</option>
            <option value="turquoise">Turquoise 🌐</option>
            <option value="black">Black ⬛</option>
          </select>

          {hasActiveFilters && onResetFilters && (
            <button
              type="button"
              className="filter-chip"
              onClick={onResetFilters}
              style={{ background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }}
              title="Reset all search queries and filters"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
