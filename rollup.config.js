import batchPackages from '@lerna/batch-packages';
import filterPackages from '@lerna/filter-packages';
import { getPackages } from '@lerna/project';
import path from 'path';
import fs from 'fs';
import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import string from 'rollup-plugin-string';
import { terser } from 'rollup-plugin-terser';
import minimist from 'minimist';
import MagicString from 'magic-string';

/**
 * This plugin is a filesize optimization for the pixi-filters bundle
 * it removes all the successive occurances of the default vertex fragment
 * and reassigns the name of the vertex variable
 * @function dedupeDefaultVert
 * @private
 */
function dedupeDefaultVert() {
    const defaultVert = path.join(__dirname, 'tools/fragments/default.vert');
    const fragment = fs.readFileSync(defaultVert, 'utf8')
        .replace(/\n/g, '\\\\n')
        .replace(/([()*=.])/g, '\\$1');

    const pattern = new RegExp(`(var ([^=\\s]+)\\s?=\\s?)"${fragment}"`, 'g');

    return {
        name: 'dedupeDefaultVert',
        renderChunk(code) {
            const matches = [];
            let match;

            while ((match = pattern.exec(code)) !== null) {
                matches.push(match);
            }

            if (matches.length <= 1) {
                return null;
            }

            const str = new MagicString(code);
            const key = matches[0][2];

            for (let i = 1; i < matches.length; i++) {
                const match = matches[i];
                const start = code.indexOf(match[0]);

                str.overwrite(
                    start,
                    start + match[0].length,
                    match[1] + key
                );
            }

            return {
                code: str.toString(),
                map: str.generateMap({ hires: true }),
            };
        },
    };
}

/**
 * Get a list of the non-private sorted packages with Lerna v3
 * @see https://github.com/lerna/lerna/issues/1848
 * @return {Promise<Package[]>} List of packages
 */
async function getSortedPackages() {
    // Support --scope and --ignore globs
    const {scope, ignore} = minimist(process.argv.slice(2));

    // Standard Lerna plumbing getting packages
    const packages = await getPackages(__dirname);
    const filtered = filterPackages(
        packages,
        scope,
        ignore,
        false
    );

    return batchPackages(filtered)
        .reduce((arr, batch) => arr.concat(batch), []);
}

async function main() {
    const plugins = [
        commonjs({
            namedExports: {
                'pixi.js': ['settings', 'Filter']
            }
        }),
        resolve(),
        string({
            include: [
                '**/*.frag',
                '**/*.vert'
            ]
        }),
        dedupeDefaultVert(),
        buble()
    ];

    if (process.env.NODE_ENV === 'production') {
        plugins.push(terser({
            output: {
                comments: function(node, comment) {
                    return comment.line === 1;
                }
            }
        }));
    }

    const compiled = (new Date()).toUTCString().replace(/GMT/g, 'UTC');
    const sourcemap = true;
    const packages = await getSortedPackages();
    const results = [];

    packages.forEach((pkg) => {
        const banner = [
            '/*!',
            ` * ${pkg.name} - v${pkg.version}`,
            ` * Compiled ${compiled}`,
            ' *',
            ` * ${pkg.name} is licensed under the MIT License.`,
            ' * http://www.opensource.org/licenses/mit-license',
            ' */',
        ].join('\n');

        // Get settings from package JSON
        let { main, module, bundle, globals } = pkg.toJSON();
        const basePath = path.relative(__dirname, pkg.location);
        const input = path.join(basePath, 'src/index.js');
        const freeze = false;
        const name = '__filters';

        // Generate the externals to use, by default don't include dependencies
        const baseExternal = ['pixi.js'];
        const external = [].concat(baseExternal, Object.keys(pkg.dependencies || []));

        // pixi.js is a global, peer dependency included by user, add that
        // to the list of user-defined globals
        globals = Object.assign({ 'pixi.js': 'PIXI' }, globals);

        // For UMD formatted, this adds class exports to PIXI.filters
        const footer = `Object.assign(PIXI.filters, this ? this.${name} : ${name});`;

        // UMD format output
        const mainOutput = {
            name,
            file: path.join(basePath, main),
            format: 'umd',
            footer,
            freeze,
            sourcemap,
            banner,
            globals,
        };

        // ES format output
        const moduleOutput = {
            name,
            file: path.join(basePath, module),
            format: 'esm',
            freeze,
            sourcemap,
            banner,
            globals,
        };

        // For bundle, override and keep as vanilla-CommonJS
        // basically just a list of require statements
        if (bundle) {
            mainOutput.footer = '';
            mainOutput.format = 'cjs';
        }

        results.push({
            input,
            output: [
                mainOutput,
                moduleOutput,
            ],
            external,
            plugins,
        });

        // The package.json file has a bundle field
        // we'll use this to generate the bundle file
        // this will package all dependencies
        if (bundle) {
            results.push({
                input,
                external: baseExternal,
                output: {
                    name,
                    banner,
                    globals,
                    file: path.join(basePath, bundle),
                    format: 'iife',
                    footer,
                    freeze,
                    sourcemap,
                },
                treeshake: false,
                plugins,
            });
        }
    });

    return results;
}

export default main();

