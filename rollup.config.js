import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import multiInput from 'rollup-plugin-multi-input';

const pkg = require('./package.json');

export default {
  input: `src/**/*.ts`,
  output: { dir: 'dist', format: 'es', sourcemap: true },
  external: [
    ...Object.keys(pkg.dependencies).filter(
      (key) => !key.includes('cytoscape')
    ),
    /scoped-material-components/,
    /lit-html/
  ],
  plugins: [
    multiInput(),
    json(),
    typescript(),
    resolve({
      preferBuiltins: false,
      browser: true,
      mainFields: ['browser', 'module', 'main'],
    }),
    commonjs({
      include: /node_modules/,
    }),
  ],
};
