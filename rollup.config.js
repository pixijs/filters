import pkg from './package.json';
import preprocess from 'rollup-plugin-preprocess';
import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';
import string from 'rollup-plugin-string';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';

const prod = process.env.BUILD === 'prod';
const filter = process.env.FILTER;
const format = process.env.FORMAT || 'umd';

const entry = filter ? `src/${filter}/index.js` : `src/index.js`;
const suffix = prod ? `.min` : '';
const suffixFormat = format !== 'umd' ? `.${format}` : '';
const dest = filter ? 
    `bin/${filter}${suffixFormat}${suffix}.js`:
    `bin/filters${suffixFormat}${suffix}.js`;

const plugins = [
    resolve(),
    string({
        include: [
            'src/**/*.frag',
            'src/**/*.vert'
        ]
    }),
    preprocess({
        context: {
            DEBUG: !prod,
            RELEASE: prod,
            VERSION: pkg.version
        }
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

export default {
    banner,
    format,
    moduleName: '__pixiFilters',
    intro: `if (typeof PIXI.Filter === 'undefined') { throw 'PixiJS is required'; }`,
    outro: `Object.assign(PIXI.filters, __pixiFilters);`,
    entry,
    dest,
    sourceMap: true,
    plugins
};