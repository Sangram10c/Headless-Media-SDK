import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useReelSwiper } from '@headless-media/ui-react';

const MOCK_REELS = [
  { id: 101, title: 'Mountain Drone Shot', duration: 15, author: '@nature_creator' },
  { id: 102, title: 'Urban Neon Timelapse', duration: 22, author: '@tokyo_vibes' },
  { id: 103, title: 'Surfing Big Waves', duration: 18, author: '@ocean_surf' },
];

function ReelSwiperDemo() {
  const swiper = useReelSwiper({
    items: MOCK_REELS,
    onActiveChange: (index, reel) => console.log('Active reel index:', index, reel.title),
  });

  return (
    <div style={{ maxWidth: 360, margin: '0 auto', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 16, background: '#000', color: '#fff' }}>
      <h4 style={{ margin: '0 0 12px 0', textAlign: 'center' }}>Vertical Video Reels</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {MOCK_REELS.map((reel, index) => {
          const isActive = index === swiper.activeIndex;
          return (
            <div
              key={reel.id}
              onClick={() => swiper.scrollTo(index)}
              style={{
                padding: 16,
                borderRadius: 16,
                background: isActive ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#18181b',
                border: isActive ? '2px solid #ec4899' : '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ fontWeight: 700 }}>{reel.title}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{reel.author} • {reel.duration}s</div>
              {isActive && <div style={{ fontSize: 11, marginTop: 6, color: '#4ade80', fontWeight: 600 }}>▶ Playing</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const meta: Meta<typeof ReelSwiperDemo> = {
  title: 'Headless UI/ReelSwiper',
  component: ReelSwiperDemo,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ReelSwiperDemo>;

export const Default: Story = {};
