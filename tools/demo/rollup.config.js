import buble from '@rollup/plugin-buble';
import resolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';

const globals = {
    'pixi.js': 'PIXI',
    '@pixi/core': 'PIXI',
    '@pixi/settings': 'PIXI',
    '@pixi/math': 'PIXI',
    '@pixi/utils': 'PIXI.utils',
    '@pixi/filter-alpha': 'PIXI.filters',
    '@pixi/filter-blur': 'PIXI.filters',
    '@pixi/constants': 'PIXI',
    '@pixi/display': 'PIXI',
    '@pixi/runner': 'PIXI',
};

export default {
    external: Object.keys(globals),
    input: 'src/index.js',
    output: {
        globals,
        format: 'iife',
        file: 'index.js'
    },
    plugins: [
        builtins(),
        resolve(),
        commonjs(),
        buble(),
        ...process.env.NODE_ENV === 'production' ? [terser()] : []
    ]
};
