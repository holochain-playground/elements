const typescript = require('@rollup/plugin-typescript');
const commonjs = require('@rollup/plugin-commonjs');

const plugins = [
  typescript(),
  commonjs({
    include: [
      'node_modules/cytoscape/**/*',
      'node_modules/cytoscape-dagre/**/*',
      'node_modules/cytoscape-cola/**/*',
    ],
  }),
];

module.exports = {
  stories: ['../stories/**/*.stories.{js,md,mdx}'],
  rollupConfig(config) {
    return {
      ...config,
      plugins: [...config.plugins, ...plugins],
    };
  },
};
