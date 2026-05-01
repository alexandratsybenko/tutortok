import {themes as prismThemes} from 'prism-react-renderer';

const simplePlantUML = require("@akebifiky/remark-simple-plantuml");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Tutortok',
  tagline: 'Документация сервиса для поиска репетитора',
  favicon: 'img/favicon.ico',
  url: 'https://alexandratsybenko.github.io',
  baseUrl: '/tutortok/',
  organizationName: 'alexandratsybenko',
  projectName: 'tutortok',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  trailingSlash: false,
  deploymentBranch: 'gh-pages',

  plugins: [
    ['docusaurus-plugin-drawio', {}],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: 'docs',
          remarkPlugins: [simplePlantUML],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
    [
      'redocusaurus',
      {
        specs: [
          {
            id: 'tutortok',
            spec: 'api_specs/tutortok_openapi.yaml',
          },
        ],
        theme: {
          primaryColor: '#045eb2',
        },
      }
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Tutortok',
      logo: {
        alt: 'Tutortok Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'scope',
          position: 'left',
          label: 'Документация',
        },
        {
          type: 'doc',
          docId: 'api/real',
          label: 'API',
          position: 'left',
        },
        {
          href: 'https://github.com/alexandratsybenko/tutortok',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Документация',
          items: [
            {
              label: 'Карточка сервиса',
              to: '/docs/scope',              // ✅ твой существующий файл
            },
            {
              label: 'Архитектура',
              to: '/docs/architecture/data-storage-tech',  // ✅ существующий файл
            },
            {
              label: 'API Reference',
              to: '/docs/api/real',           // ✅ твой файл с API
            },
          ],
        },
        {
          title: 'Для авторов',
          items: [
            {
              label: 'Репозиторий',
              href: 'https://github.com/alexandratsybenko/tutortok',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Tutortok. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;