import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';

const plugins = [
    builtins(),
    resolve(),
    commonjs({
        namedExports: {
            'resource-loader': ['Resource']
        }
    }),
    buble()
];

if (process.env.NODE_ENV === 'production') {
    plugins.push(terser());
}

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

const external = Object.keys(globals);

export default {
    external,
    input: 'src/index.js',
    output: {
        globals,
        format: 'iife',
        file: 'index.js'
    },
    plugins
};
