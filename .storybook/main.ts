import type { StorybookConfig } from '@storybook/react-vite';
import path from 'node:path';

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  async viteFinal(config) {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          '@headless-media/core': path.resolve(__dirname, '../packages/media-core/src/index.ts'),
          '@headless-media/react': path.resolve(__dirname, '../packages/media-react/src/index.ts'),
          '@headless-media/ui-react': path.resolve(__dirname, '../packages/media-ui-react/src/index.ts'),
        },
      },
    };
  },
};

export default config;
