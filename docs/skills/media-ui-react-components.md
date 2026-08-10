---
name: media-ui-react-components
description: Teaches AI coding assistants how to correctly consume @headless-media/ui-react (useGrid, useLightbox, useReelSwiper, prop-getters pattern).
---

# Skill: `@headless-media/ui-react` Headless Component Consumption

This skill instructs AI coding assistants on how to build UI layouts using `@headless-media/ui-react` headless hooks and the prop-getters pattern.

## Core Rules

1. **Zero Styles Included**: `@headless-media/ui-react` provides behavior, ARIA attributes, keyboard navigation, and focus management ONLY. The consumer supplies ALL CSS/markup.
2. **Prop-Getters Pattern**: Always spread prop getter functions onto DOM elements (e.g., `<div {...getGridProps()}>`).
3. **Handler Merging**: Never overwrite event handlers directly. Pass custom handlers inside the getter function: `getGridProps({ onClick: myCustomHandler })`. Handlers will automatically be merged via `callAll`.
4. **Data Source Agnostic**: `@headless-media/ui-react` has NO dependency on `@headless-media/core` or Pexels. Map data into simple objects before passing to hooks.

## 1. Headless Grid (`useGrid`)

```tsx
import { useGrid } from '@headless-media/ui-react';

function PhotoGrid({ photos, onSelectPhoto }) {
  const { gridItems, getGridProps, getItemProps } = useGrid({
    items: photos,
    columns: 3,
    gap: 16,
    getItemKey: (item) => item.id,
    onItemClick: (item, index) => onSelectPhoto(index),
  });

  return (
    <div
      {...getGridProps({
        className: 'my-custom-grid',
        style: { display: 'grid', gridTemplateColumns: 'repeat(var(--grid-columns), 1fr)', gap: 'var(--grid-gap)' },
      })}
    >
      {gridItems.map((gi) => (
        <div {...getItemProps(gi, { className: 'my-grid-card' })} key={gi.key}>
          <img src={gi.item.src.medium} alt={gi.item.alt} />
        </div>
      ))}
    </div>
  );
}
```

## 2. Headless Lightbox (`useLightbox`)

```tsx
import { useLightbox } from '@headless-media/ui-react';

function PhotoLightbox({ photos }) {
  const lightbox = useLightbox({
    items: photos.map((p) => ({ src: p.src.large, alt: p.alt })),
    loop: true,
  });

  if (!lightbox.isOpen) return null;

  return (
    <div {...lightbox.getBackdropProps({ className: 'modal-backdrop' })}>
      <div {...lightbox.getContentProps({ className: 'modal-dialog' })}>
        <button {...lightbox.getCloseButtonProps()}>Close</button>
        <button {...lightbox.getPrevButtonProps()}>‹</button>
        
        <img {...lightbox.getImageProps({ className: 'lightbox-image' })} />
        
        <button {...lightbox.getNextButtonProps()}>›</button>
      </div>
    </div>
  );
}
```

## 3. Headless Vertical Reel Swiper (`useReelSwiper`)

```tsx
import { useReelSwiper } from '@headless-media/ui-react';

function VideoReelFeed({ videos }) {
  const { activeIndex, getContainerProps, getSlideProps, scrollTo } = useReelSwiper({
    items: videos,
    onActiveChange: (index, video) => console.log('Active video:', video.id),
  });

  return (
    <div
      {...getContainerProps({
        className: 'vertical-snap-feed',
        style: { height: '100vh', overflowY: 'scroll', scrollSnapType: 'y mandatory' },
      })}
    >
      {videos.map((video, index) => (
        <div
          {...getSlideProps(index, {
            className: 'reel-slide',
            style: { height: '100vh', scrollSnapAlign: 'start' },
          })}
          key={video.id}
        >
          <video src={video.src} autoPlay={index === activeIndex} muted loop />
        </div>
      ))}
    </div>
  );
}
```

## Accessibility Built-In

- **ARIA Roles**: Automatically attached (`role="list"`, `role="listitem"`, `role="dialog"`, `role="feed"`, `role="article"`).
- **Keyboard Navigation**:
  - Grid: `Enter` / `Space` selects item.
  - Lightbox: `Escape` closes, `←` / `→` navigates slides.
  - ReelSwiper: `↑` / `↓` scrolls between slides.
- **Focus Management**: Lightbox automatically traps focus inside the modal when open and restores focus to the trigger element when closed.
