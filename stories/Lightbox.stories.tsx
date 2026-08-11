import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useLightbox } from '@headless-media/ui-react';

const MOCK_ITEMS = [
  { src: 'https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Mountain Landscape' },
  { src: 'https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Cyberpunk Neon City' },
  { src: 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Deep Ocean Waves' },
];

function LightboxDemo({
  initialOpen = false,
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

  const isOpen = lightbox.isOpen || initialOpen;

  return (
    <div style={{ padding: 24, minHeight: isOpen ? 520 : 'auto', position: 'relative' }}>
      <button
        onClick={() => lightbox.open(0)}
        style={{ padding: '10px 18px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: 20, cursor: 'pointer', fontWeight: 600 }}
      >
        Open Lightbox Modal
      </button>

      {isOpen && (
        <div {...lightbox.getBackdropProps({ style: { position: 'absolute', inset: 0, background: 'rgba(10,10,12,0.92)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24, borderRadius: 16 } })}>
          <div {...lightbox.getContentProps({ style: { position: 'relative', maxWidth: 680, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' } })}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
              <button {...lightbox.getCloseButtonProps({ style: { background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' } })}>
                ✕
              </button>
            </div>

            <img
              src={lightbox.currentItem?.src}
              alt={lightbox.currentItem?.alt}
              style={{ maxWidth: '100%', maxHeight: 380, borderRadius: 16, objectFit: 'contain', boxShadow: '0 20px 40px rgba(0,0,0,0.8)' }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: 14 }}>
              <button onClick={lightbox.prev} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: 20, cursor: 'pointer', fontWeight: 600 }}>
                ← Prev
              </button>
              <span style={{ color: '#a1a1aa', fontSize: 14, fontWeight: 600 }}>
                {lightbox.currentIndex + 1} / {MOCK_ITEMS.length}
              </span>
              <button onClick={lightbox.next} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: 20, cursor: 'pointer', fontWeight: 600 }}>
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const LIGHTBOX_SOURCE = `import { useLightbox } from '@headless-media/ui-react';

function LightboxExample({ items }) {
  const lightbox = useLightbox({
    items,
    initialIndex: 0,
    loop: true,
  });

  return (
    <div>
      <button onClick={() => lightbox.open(0)}>Open Lightbox</button>

      {lightbox.isOpen && (
        <div {...lightbox.getBackdropProps()}>
          <div {...lightbox.getContentProps()}>
            <button {...lightbox.getCloseButtonProps()}>✕</button>
            <img src={lightbox.currentItem?.src} alt={lightbox.currentItem?.alt} />
            <button onClick={lightbox.prev}>Prev</button>
            <button onClick={lightbox.next}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}`;

const meta: Meta<typeof LightboxDemo> = {
  title: 'Headless UI/Lightbox',
  component: LightboxDemo,
  tags: ['autodocs'],
  parameters: {
    docs: {
      source: {
        code: LIGHTBOX_SOURCE,
        language: 'tsx',
        type: 'code',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LightboxDemo>;

export const Default: Story = {
  args: { initialOpen: false, loop: true },
};

export const OpenModal: Story = {
  args: { initialOpen: true, loop: true },
};
