const path = require('path');
const buble = require('rollup-plugin-buble');
const resolve = require('rollup-plugin-node-resolve');
const string = require('rollup-plugin-string');
const uglify = require('rollup-plugin-uglify');
const { minify } = require('uglify-es');
const minimist = require('minimist');

const pkg = require(path.resolve('./package'));
const name = path.basename(pkg.name);
const entry = 'src/index.js';

const {prod, format} = minimist(process.argv.slice(2), {
    string: ['format'],
    boolean: ['prod'],
    default: {
        format: 'es',
        prod: false
    },
    alias: {
        f: 'format',
        p: 'prod'
    }
});

const formatSuffix = format === 'es' ? `.${format}` : '';
const dest = `lib/${name}${formatSuffix}.js`;

const plugins = [
    resolve(),
    string({
        include: [
            'src/**/*.frag',
            'src/**/*.vert',
            '../../tools/**/*.vert'
        ]
    }),
    buble()
];

if (prod) {
    plugins.push(uglify({
        mangle: true,
        compress: true,
        output: {
            comments: function(node, comment) {
                const {value, type} = comment;
                if (type === 'comment2') {
                    return value[0] === '!';
                }
            }
        }
    }, minify));
}

const compiled = (new Date()).toUTCString().replace(/GMT/g, 'UTC');

const banner = `/*!
 * ${pkg.name} - v${pkg.version}
 * Compiled ${compiled}
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */\n`;

const moduleName = `__${name.replace(/-/g, '_')}`;

let intro = '';

if (!prod) {
    intro = 'if (typeof PIXI === \'undefined\' || typeof PIXI.filters === \'undefined\') { throw \'PixiJS is required\'; }';
}

module.exports = {
    banner,
    format,
    moduleName,
    intro,
    entry,
    dest,
    sourceMap: true,
    plugins
};