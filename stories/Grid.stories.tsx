import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useGrid } from '@headless-media/ui-react';

interface MockPhoto {
  id: number;
  url: string;
  title: string;
}

const MOCK_PHOTOS: MockPhoto[] = [
  { id: 1, url: 'https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&w=400', title: 'Mountain Sunset' },
  { id: 2, url: 'https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=400', title: 'Neon Cyberpunk' },
  { id: 3, url: 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=400', title: 'Ocean Waves' },
  { id: 4, url: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=400', title: 'Autumn Forest' },
];

function GridComponent({
  items = MOCK_PHOTOS,
  columns = 4,
  isLoading = false,
  isError = false,
  errorMessage = 'Failed to load grid items',
}: {
  items?: MockPhoto[];
  columns?: number;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const { gridItems, getItemProps } = useGrid({
    items: isError ? [] : items,
    columns,
    getItemKey: (item) => item.id,
    onItemClick: (item) => setSelected(item.title),
  });

  if (isLoading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 16 }}>
        {[1, 2, 3, 4].map((n) => (
          <div key={n} style={{ height: 180, background: '#27272a', borderRadius: 12 }} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: 20, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: 12 }}>
        ⚠️ {errorMessage}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {selected && <div style={{ padding: '8px 16px', background: '#8b5cf6', color: '#fff', borderRadius: 8, fontWeight: 600 }}>Selected: {selected}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 16 }}>
        {gridItems.map((gi) => (
          <div
            key={gi.key}
            {...getItemProps(gi)}
            style={{ borderRadius: 12, overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', background: '#18181b' }}
          >
            <img src={gi.item.url} alt={gi.item.title} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
            <div style={{ padding: 10, color: '#f4f4f5', fontSize: 13, fontWeight: 600 }}>{gi.item.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const GRID_SOURCE = `import { useState } from 'react';
import { useGrid } from '@headless-media/ui-react';

function PhotoGridExample({ photos, columns = 4 }) {
  const [selected, setSelected] = useState(null);

  const { gridItems, getItemProps } = useGrid({
    items: photos,
    columns,
    getItemKey: (item) => item.id,
    onItemClick: (item) => setSelected(item.title),
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: \`repeat(\${columns}, 1fr)\`, gap: 16 }}>
      {gridItems.map((gi) => (
        <div key={gi.key} {...getItemProps(gi)}>
          <img src={gi.item.url} alt={gi.item.title} />
          <span>{gi.item.title}</span>
        </div>
      ))}
    </div>
  );
}`;

const meta: Meta<typeof GridComponent> = {
  title: 'Headless UI/Grid',
  component: GridComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      source: {
        code: GRID_SOURCE,
        language: 'tsx',
        type: 'code',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GridComponent>;

export const Default: Story = {
  args: { columns: 4, items: MOCK_PHOTOS },
};

export const Loading: Story = {
  args: { isLoading: true, columns: 4 },
};

export const Empty: Story = {
  args: { items: [] },
};

export const ErrorState: Story = {
  args: { isError: true, errorMessage: 'Pexels API Rate Limit Exceeded (HTTP 429)' },
};
