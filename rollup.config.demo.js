import esbuild from 'rollup-plugin-esbuild';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

const globals = {
    'pixi.js': 'PIXI',
};

export default {
    external: Object.keys(globals),
    input: 'tools/demo/src/index.js',
    output: {
        globals,
        format: 'iife',
        file: 'tools/demo/index.js'
    },
    plugins: [
        commonjs(),
        resolve(),
        esbuild({
            target: 'ES2017',
            minify: process.env.NODE_ENV === 'production',
        })
    ],
};
