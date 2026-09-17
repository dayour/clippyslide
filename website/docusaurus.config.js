// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'ClippySlide',
  tagline: 'A ClippyFlow-first slide design system for premium, dark, agentic presentations.',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://dayour.github.io',
  baseUrl: '/clippyslide/',

  organizationName: 'dayour',
  projectName: 'clippyslide',
  trailingSlash: false,

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/dayour/clippyslide/tree/main/website/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/contact-sheet.png',
      colorMode: {
        defaultMode: 'dark',
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'ClippySlide',
        logo: {
          alt: 'ClippySlide',
          src: 'img/logo.svg',
        },
        items: [
          {type: 'docSidebar', sidebarId: 'wiki', position: 'left', label: 'Wiki'},
          {to: '/quick-start', label: 'Quick Start', position: 'left'},
          {to: '/presenter/overview', label: 'Presenter', position: 'left'},
          {to: '/library', label: 'Library', position: 'left'},
          {href: 'https://github.com/dayour/clippyslide', label: 'GitHub', position: 'right'},
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Wiki',
            items: [
              {label: 'Introduction', to: '/intro'},
              {label: 'Quick Start', to: '/quick-start'},
              {label: 'ClippyFlow Tokens', to: '/design-system/tokens'},
            ],
          },
          {
            title: 'Build',
            items: [
              {label: 'Deck Generator', to: '/generator/overview'},
              {label: 'Deck Library', to: '/library'},
              {label: 'Presenter', to: '/presenter/overview'},
              {label: 'Clawpilot Skill', to: '/skill/overview'},
            ],
          },
          {
            title: 'More',
            items: [
              {label: 'GitHub', href: 'https://github.com/dayour/clippyslide'},
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} ClippySlide. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash', 'json', 'yaml', 'css', 'powershell'],
      },
    }),
};

export default config;
