import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';

const plugins = [
    globals(),
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

export default {
    input: 'src/index.js',
    output: {
        format: 'iife',
        file: 'index.js'
    },
    plugins
};
