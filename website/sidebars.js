// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  wiki: [
    'intro',
    'quick-start',
    {
      type: 'category',
      label: 'Design System',
      collapsed: false,
      items: [
        'design-system/tokens',
        'design-system/components',
        'design-system/css-reference',
        'design-system/context-profiles',
      ],
    },
    {
      type: 'category',
      label: 'The Reproduction Method',
      items: [
        'reproduction/methodology',
        'reproduction/coe-case-study',
      ],
    },
    {
      type: 'category',
      label: 'Deck Generator',
      items: [
        'generator/overview',
        'generator/archetypes',
        'generator/content-model',
      ],
    },
    {
      type: 'category',
      label: 'Presenter',
      items: [
        'presenter/overview',
        'presenter/controls',
        'presenter/measurement-grid',
      ],
    },
    {
      type: 'category',
      label: 'Clawpilot Skill',
      items: [
        'skill/overview',
        'skill/commands',
      ],
    },
    {
      type: 'category',
      label: 'TileSlide Extension',
      items: [
        'extension/coe-theme',
        'extension/integration',
      ],
    },
    {
      type: 'category',
      label: 'Automation',
      items: [
        'automation/design-guardian',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'reference/file-map',
        'reference/environment-notes',
      ],
    },
  ],
};

export default sidebars;
