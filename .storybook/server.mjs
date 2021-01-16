import { storybookPlugin } from '@web/dev-server-storybook';
import rollupTypescript from '@rollup/plugin-typescript';
import rollupCommonjs from '@rollup/plugin-commonjs';
import { fromRollup } from '@web/dev-server-rollup';

const typescript = fromRollup(rollupTypescript);
const commonjs = fromRollup(rollupCommonjs);

const plugins = [
  typescript(),
  commonjs({
    include: [
      'node_modules/lodash/**/*',
      'node_modules/cytoscape/**/*',
      'node_modules/cytoscape-dagre/**/*',
      'node_modules/cytoscape-cola/**/*',
    ],
  }),
];

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  port: 8080,
  watch: true,
  open: '/',
  nodeResolve: {
    preferBuiltins: false,
    browser: true,
    mainFields: ['browser', 'module', 'main'],
  },
  plugins: [...plugins, storybookPlugin({ type: 'web-components' })],
});
