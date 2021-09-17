import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import postcssLit from 'rollup-plugin-postcss-lit';
import url from 'postcss-url';

const pkg = require('./package.json');

export default {
  input: `src/index.ts`,
  output: { dir: 'dist', format: 'es', sourcemap: true },
  external: [
    ...Object.keys(pkg.dependencies).filter(
      key => !key.includes('golden-layout')
    ),
    /lit\//,
  ],
  plugins: [
    postcss({
      inject: false,
      plugins: [
        url({
          url: 'inline',
        }),
      ],
    }),
    postcssLit({
      importPackage: 'lit',
    }),
    typescript(),
    resolve({
      preferBuiltins: false,
      browser: true,
      mainFields: ['module', 'browser', 'main'],
    }),
  ],
};
