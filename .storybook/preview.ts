import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0f0f10' },
        { name: 'light', value: '#ffffff' },
      ],
    },
    viewport: {
      viewports: {
        mobileSmall: { name: 'Mobile Small (320px)', styles: { width: '320px', height: '568px' } },
        mobileMedium: { name: 'Mobile Medium (375px)', styles: { width: '375px', height: '667px' } },
        mobileLarge: { name: 'Mobile Large (414px)', styles: { width: '414px', height: '896px' } },
        tablet: { name: 'Tablet (768px)', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop (1280px)', styles: { width: '1280px', height: '800px' } },
        ultraWide: { name: 'Ultra Wide (1920px)', styles: { width: '1920px', height: '1080px' } },
      },
    },
  },
};

export default preview;
