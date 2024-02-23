import pkg from './package.json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import visualizer from 'rollup-plugin-visualizer';
import copy from 'rollup-plugin-copy';

function bundle(filename, options = {}) {
  return {
    input: 'src/index.js',
    output: {
      file: filename,
      format: 'umd',
      name: 'DeckGlLeaflet',
      sourcemap: true,
      globals: {
        leaflet: 'L',
        '@deck.gl/core': 'deck',
      },
    },
    external: [
      ...Object.keys(pkg.peerDependencies),
    ],
    plugins: [
      resolve(),
      commonjs(),
      babel({ babelHelpers: 'runtime' }),
      options.minimize ? terser() : false,
      options.stats ? visualizer({
        filename: filename + '.stats.html',
      }) : false,
      copy({
        targets: [{
          src: 'src/index.d.ts',
          dest: 'dist',
          rename: 'deck.gl-leaflet.d.ts',
        }]
      }),
    ],
  };
}

export default [
  bundle(pkg.browser.replace('.min', ''), { stats: true }),
  bundle(pkg.browser, { minimize: true }),
];
