import PackageUtilities from 'lerna/lib/PackageUtilities';
import Repository from 'lerna/lib/Repository';
import path from 'path';
import fs from 'fs';
import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';
import string from 'rollup-plugin-string';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';
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
        transformBundle(code) {
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


// Support --scope and --ignore globs
const args = minimist(process.argv.slice(2), {
    boolean: ['prod', 'bundles'],
    default: {
        prod: false,
        bundles: true,
    },
    alias: {
        p: 'prod',
        b: 'bundles',
    },
});

// Standard Lerna plumbing getting packages
const repo = new Repository(__dirname);
const packages = PackageUtilities.getPackages(repo);
const filtered = PackageUtilities.filterPackages(packages, args);
const sorted = PackageUtilities.topologicallyBatchPackages(filtered);

const plugins = [
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

if (args.prod) {
    plugins.push(uglify({
        mangle: true,
        compress: true,
        output: {
            comments: function(node, comment) {
                return comment.line === 1;
            }
        }
    }, minify));
}

const compiled = (new Date()).toUTCString().replace(/GMT/g, 'UTC');
const sourcemap = true;
const results = [];

sorted.forEach((group) => {
    group.forEach((pkg) => {
        if (pkg.isPrivate()) {
            return;
        }
        const banner = [
            '/*!',
            ` * ${pkg.name} - v${pkg.version}`,
            ` * Compiled ${compiled}`,
            ' *',
            ` * ${pkg.name} is licensed under the MIT License.`,
            ' * http://www.opensource.org/licenses/mit-license',
            ' */',
        ].join('\n');

        // Check for bundle folder
        const external = Object.keys(pkg.dependencies || []);
        const basePath = path.relative(__dirname, pkg.location);
        const input = path.join(basePath, 'src/index.js');
        const { main, module, bundle } = pkg._package;
        const freeze = false;
        const name = '__pixiFilters';
        let intro = '';

        if (!args.prod && bundle) {
            intro = 'if (typeof PIXI === \'undefined\' || typeof PIXI.filters === \'undefined\') { throw \'PixiJS is required\'; }';
        }

        results.push({
            intro,
            banner,
            input,
            freeze,
            output: [
                {
                    file: path.join(basePath, main),
                    format: bundle ? 'cjs' : 'umd',
                },
                {
                    file: path.join(basePath, module),
                    format: 'es',
                },
            ],
            name,
            external,
            sourcemap,
            plugins,
        });

        // The package.json file has a bundle field
        // we'll use this to generate the bundle file
        // this will package all dependencies
        if (args.bundles && bundle) {
            results.push({
                intro,
                banner,
                input,
                freeze,
                output: {
                    file: path.join(basePath, bundle),
                    format: 'umd',
                },
                name,
                treeshake: false,
                sourcemap,
                plugins,
            });
        }
    });
});

export default results;
