import pkg from './package.json' assert { type: 'json' };
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';
import { visualizer } from 'rollup-plugin-visualizer';
import dts from 'rollup-plugin-dts';
import tsc from 'typescript';

function bundle(format, filename, options = {}) {
  return {
    input: 'src/index.ts',
    output: {
      file: filename,
      format: format,
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
      ...(options.resolve ? [resolve()] : []),
      commonjs(),
      typescript({
        typescript: tsc,
        clean: options.stats,
      }),
      ...(options.minimize ? [terser()] : []),
      ...(options.stats ? [visualizer({
        filename: filename + '.stats.html',
      })] : []),
    ],
  };
}

export default [
  bundle('cjs', pkg.main),
  bundle('es', pkg.module),
  bundle('umd', pkg.browser.replace('.min', ''), { resolve: true, stats: true }),
  bundle('umd', pkg.browser, { resolve: true, minimize: true }),
  {
    input: 'src/index.ts',
    output: {
      file: pkg.types,
      format: 'es',
    },
    plugins: [
      dts({ noEmit: true }),
    ],
  },
];
