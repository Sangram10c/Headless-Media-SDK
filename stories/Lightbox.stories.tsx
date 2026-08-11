import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useLightbox } from '@headless-media/ui-react';

const MOCK_ITEMS = [
  { src: 'https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Mountain Landscape' },
  { src: 'https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Cyberpunk Neon City' },
  { src: 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Deep Ocean Waves' },
];

function LightboxDemo({
  initialOpen = true,
  loop = true,
}: {
  initialOpen?: boolean;
  loop?: boolean;
}) {
  const lightbox = useLightbox({
    items: MOCK_ITEMS,
    initialIndex: 0,
    loop,
  });

  return (
    <div style={{ padding: 24 }}>
      <button
        onClick={() => lightbox.open(0)}
        style={{ padding: '10px 18px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: 20, cursor: 'pointer', fontWeight: 600 }}
      >
        Open Lightbox Modal
      </button>

      {(initialOpen || lightbox.isOpen) && (
        <div {...lightbox.getBackdropProps({ style: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 } })}>
          <div {...lightbox.getContentProps({ style: { position: 'relative', maxWidth: 700, width: '90%' } })}>
            <div style={{ position: 'absolute', top: -40, right: 0, display: 'flex', gap: 8 }}>
              <button {...lightbox.getCloseButtonProps({ style: { background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' } })}>
                ✕
              </button>
            </div>

            <img src={lightbox.currentItem?.src} alt={lightbox.currentItem?.alt} style={{ width: '100%', borderRadius: 16, objectFit: 'contain' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
              <button onClick={lightbox.prev} style={{ padding: '8px 16px', background: '#27272a', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                ← Prev
              </button>
              <span style={{ color: '#a1a1aa', fontSize: 14 }}>
                {lightbox.currentIndex + 1} / {MOCK_ITEMS.length}
              </span>
              <button onClick={lightbox.next} style={{ padding: '8px 16px', background: '#27272a', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const meta: Meta<typeof LightboxDemo> = {
  title: 'Headless UI/Lightbox',
  component: LightboxDemo,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LightboxDemo>;

export const Default: Story = {
  args: {
    initialOpen: false,
    loop: true,
  },
};

export const OpenModal: Story = {
  args: {
    initialOpen: true,
    loop: true,
  },
};
