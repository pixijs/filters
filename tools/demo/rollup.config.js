import esbuild from 'rollup-plugin-esbuild';
import resolve from '@rollup/plugin-node-resolve';
const globals = {
    'pixi.js': 'PIXI',
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
        resolve(),
        esbuild({
            target: 'ES2017',
            minify: process.env.NODE_ENV === 'production',
        })
    ],
};
