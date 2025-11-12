import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'en-US',
  title: 'Authjoy',
  description: 'Strategy-based authentication library for Node.js and TypeScript',
  base: "/Authjoy/",
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'TypeDoc', link: '/api/README' },
      { text: 'GitHub', link: 'https://github.com/kodeforgeX/Authjoy' },
    ],
    sidebar: {
      '/guide/': [
        { text: 'Getting Started', link: '/guide/getting-started' },
        { text: 'Configuration', link: '/guide/configuration' },
        { text: 'JWT Strategy', link: '/guide/jwt-strategy' },
      ],
      '/concept/': [
        { text: 'Concepts', link: '/concept/extending' },
        { text: 'Overview', link: '/concept/VISION' },
        { text: 'Designe v0', link: '/concept/DESIGN-V0' },
        { text: 'Stateless JWT Strategy', link: '/concept/STATELESS-JWT' },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/kodeforgeX/Authjoy' }],
    footer: {
      message: 'Released under the MIT License.',
      copyright: '© 2025 kodeforgeX'
    }
  }
})
