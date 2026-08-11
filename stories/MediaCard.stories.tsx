import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

function MediaCardDemo({
  photographer = 'Jane Doe',
  alt = 'Scenic Alpine Lake',
  dimensions = '4000 × 2667',
  isFavorited = false,
}: {
  photographer?: string;
  alt?: string;
  dimensions?: string;
  isFavorited?: boolean;
}) {
  const [fav, setFav] = useState(isFavorited);

  return (
    <div style={{ maxWidth: 300, background: '#18181b', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
      <img
        src="https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&w=400"
        alt={alt}
        style={{ width: '100%', height: 240, objectFit: 'cover', display: 'block' }}
      />
      <div style={{ padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>@{photographer}</div>
          <div style={{ fontSize: 12, color: '#a1a1aa' }}>{dimensions}</div>
        </div>
        <button
          onClick={() => setFav(!fav)}
          style={{
            background: fav ? '#ec4899' : 'rgba(255,255,255,0.1)',
            border: 'none',
            color: '#fff',
            borderRadius: '50%',
            width: 36,
            height: 36,
            cursor: 'pointer',
            fontSize: 16,
          }}
        >
          {fav ? '♥' : '♡'}
        </button>
      </div>
    </div>
  );
}

const meta: Meta<typeof MediaCardDemo> = {
  title: 'Headless UI/MediaCard',
  component: MediaCardDemo,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MediaCardDemo>;

export const Default: Story = {
  args: {
    photographer: 'Jane Doe',
    alt: 'Scenic Alpine Lake',
    dimensions: '4000 × 2667',
    isFavorited: false,
  },
};

export const Favorited: Story = {
  args: {
    photographer: 'Jane Doe',
    alt: 'Scenic Alpine Lake',
    dimensions: '4000 × 2667',
    isFavorited: true,
  },
};
