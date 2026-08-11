import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Headless Media SDK',
  description: 'Production-grade Headless Media SDK Ecosystem for Pexels API in React & React Native',
  cleanUrls: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#8b5cf6' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:title', content: 'Headless Media SDK Documentation' }],
    ['meta', { name: 'og:description', content: 'Type-safe, zero-dependency headless media engine for Pexels photo & video streaming.' }],
  ],
  themeConfig: {
    logo: '/favicon.svg',
    nav: [
      { text: 'Guide', link: '/getting-started' },
      { text: 'Architecture', link: '/architecture' },
      { text: 'API Reference', link: '/api' },
      { text: 'Hooks', link: '/hooks' },
      { text: 'Events', link: '/events' },
      { text: 'Caching', link: '/caching' },
      { text: 'Examples', link: '/examples' },
    ],
    sidebar: [
      {
        text: 'Overview',
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Installation', link: '/installation' },
          { text: 'Architecture', link: '/architecture' },
          { text: 'Packages Overview', link: '/packages' },
        ],
      },
      {
        text: 'Core SDK Reference',
        items: [
          { text: 'API Reference', link: '/api' },
          { text: 'React & Native Hooks', link: '/hooks' },
          { text: 'Event Streaming System', link: '/events' },
          { text: 'Caching & Resilience', link: '/caching' },
        ],
      },
      {
        text: 'Guides & Resources',
        items: [
          { text: 'Production Examples', link: '/examples' },
          { text: 'Frequently Asked Questions', link: '/faq' },
          { text: 'Changelog', link: '/changelog' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Sangram10c/Headless-Media-SDK' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 Headless Media SDK Maintainers',
    },
    search: {
      provider: 'local',
    },
  },
});
