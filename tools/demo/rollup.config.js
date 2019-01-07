const buble = require('rollup-plugin-buble');
const resolve = require('rollup-plugin-node-resolve');
const {terser} = require('rollup-plugin-terser');

const plugins = [
    resolve(),
    buble()
];

if (process.env.NODE_ENV === 'production') {
    plugins.push(terser());
}

export default {
    input: 'src/index.js',
    external: ['pixi.js'],
    output: {
        globals: {
            'pixi.js': 'PIXI',
            'pixi-filters': 'PIXI.filters'
        },
        format: 'iife',
        file: 'index.js'
    },
    plugins
};
