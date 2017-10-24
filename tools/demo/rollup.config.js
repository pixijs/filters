const buble = require('rollup-plugin-buble');
const resolve = require('rollup-plugin-node-resolve');
const uglify = require('rollup-plugin-uglify');

const plugins = [
    resolve(),
    buble()
];

if (process.argv.indexOf('--prod') > -1) {
    plugins.push(uglify({
        mangle: true,
        compress: true
    }));
}

export default {
    format: 'umd',
    entry: 'src/index.js',
    dest: 'index.js',
    plugins
};
