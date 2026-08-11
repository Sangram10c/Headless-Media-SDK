import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useReelSwiper } from '@headless-media/ui-react';

const MOCK_REELS = [
  { id: 101, title: 'Mountain Drone Shot', duration: 15, author: '@nature_creator' },
  { id: 102, title: 'Urban Neon Timelapse', duration: 22, author: '@tokyo_vibes' },
  { id: 103, title: 'Surfing Big Waves', duration: 18, author: '@ocean_surf' },
];

function ReelSwiperDemo() {
  const [active, setActive] = useState(0);

  const swiper = useReelSwiper({
    items: MOCK_REELS,
    onActiveChange: (index) => {
      setActive(index);
    },
  });

  return (
    <div style={{ maxWidth: 380, margin: '0 auto', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: 20, background: '#09090b', color: '#fff' }}>
      <h4 style={{ margin: '0 0 16px 0', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>Vertical Video Reels Swiper</h4>
      
      <div {...swiper.getContainerProps({ style: { display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 360, overflowY: 'auto', paddingRight: 4 } })}>
        {MOCK_REELS.map((reel, index) => {
          const isActive = index === active;
          return (
            <div
              key={reel.id}
              {...swiper.getSlideProps(index, {
                onClick: () => {
                  setActive(index);
                  swiper.scrollTo(index);
                },
                style: {
                  padding: 18,
                  borderRadius: 16,
                  background: isActive ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : '#18181b',
                  border: isActive ? '2px solid #ec4899' : '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isActive ? '0 10px 25px rgba(139, 92, 246, 0.4)' : 'none',
                },
              })}
            >
              <div style={{ fontWeight: 700, fontSize: 15, fontFamily: 'system-ui, sans-serif' }}>{reel.title}</div>
              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4, fontFamily: 'system-ui, sans-serif' }}>{reel.author} • {reel.duration}s</div>
              {isActive && <div style={{ fontSize: 12, marginTop: 8, color: '#4ade80', fontWeight: 700, fontFamily: 'system-ui, sans-serif' }}>▶ Active Video Reel</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const REEL_SWIPER_SOURCE = `import { useState } from 'react';
import { useReelSwiper } from '@headless-media/ui-react';

function ReelSwiperExample() {
  const [active, setActive] = useState(0);

  const swiper = useReelSwiper({
    items: MOCK_REELS,
    onActiveChange: (index) => setActive(index),
  });

  return (
    <div {...swiper.getContainerProps({ style: { display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 360, overflowY: 'auto' } })}>
      {MOCK_REELS.map((reel, index) => (
        <div
          key={reel.id}
          {...swiper.getSlideProps(index, {
            onClick: () => {
              setActive(index);
              swiper.scrollTo(index);
            },
          })}
        >
          <h4>{reel.title}</h4>
          <p>{reel.author} • {reel.duration}s</p>
        </div>
      ))}
    </div>
  );
}`;

const meta: Meta<typeof ReelSwiperDemo> = {
  title: 'Headless UI/ReelSwiper',
  component: ReelSwiperDemo,
  tags: ['autodocs'],
  parameters: {
    docs: {
      source: {
        code: REEL_SWIPER_SOURCE,
        language: 'tsx',
        type: 'code',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ReelSwiperDemo>;

export const Default: Story = {};
