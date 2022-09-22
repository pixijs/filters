import esbuild from 'rollup-plugin-esbuild';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';

const globals = {
    'pixi.js': 'PIXI',
    '@pixi/core': 'PIXI',
    '@pixi/filter-alpha': 'PIXI.filters',
    '@pixi/filter-blur': 'PIXI.filters',
};

export default {
    external: Object.keys(globals),
    input: 'src/index.js',
    output: {
        globals,
        format: 'iife',
        file: 'index.js',
    },
    plugins: [
        builtins(),
        resolve(),
        commonjs(),
        esbuild({
            target: 'ES2017',
            minify: process.env.NODE_ENV === 'production',
        })
    ],
};
