import rollupTypescript from '@rollup/plugin-typescript';
import rollupResolve from '@rollup/plugin-node-resolve';
import rollupCommonjs from '@rollup/plugin-commonjs';
import { fromRollup } from '@web/dev-server-rollup';

const typescript = fromRollup(rollupTypescript);
const resolve = fromRollup(rollupResolve);
const commonjs = fromRollup(rollupCommonjs);

export default [
  typescript(),
  resolve({
    preferBuiltins: false,
    browser: true,
    mainFields: ['browser', 'module', 'main'],
  }),
  commonjs({
    include: [
      'node_modules/cytoscape/**/*',
      'node_modules/cytoscape-dagre/**/*',
      'node_modules/cytoscape-cola/**/*',
    ],
  }),
];
