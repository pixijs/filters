import path from 'path';
import esbuild from 'rollup-plugin-esbuild';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { string } from 'rollup-plugin-string';
import dedupeDefaultVert from './scripts/rollup-dedupe-vert'
import workspacesRun from 'workspaces-run';

async function main() {
    const plugins = [
        esbuild({
            target: 'ES2017',
            minify: process.env.NODE_ENV === 'production',
        }),
        resolve(),
        commonjs(),
        string({
            include: [
                '**/*.frag',
                '**/*.vert'
            ]
        }),
        dedupeDefaultVert()
    ];

    const compiled = (new Date()).toUTCString().replace(/GMT/g, 'UTC');
    const sourcemap = true;

    const appendPackage = (pkg) => {
        const banner = [
            '/*!',
            ` * ${pkg.name} - v${pkg.config.version}`,
            ` * Compiled ${compiled}`,
            ' *',
            ` * ${pkg.name} is licensed under the MIT License.`,
            ' * http://www.opensource.org/licenses/mit-license',
            ' */',
        ].join('\n');

        // Get settings from package JSON
        let { main, module, bundle, bundleModule, globals } = pkg.config;
        const basePath = path.relative(__dirname, pkg.dir);
        const input = path.join(basePath, 'src/index.ts');
        const freeze = false;
        const builds = [];

        builds.push({
            input,
            output: [
                {
                    file: path.join(basePath, main),
                    format: 'cjs',
                    freeze,
                    sourcemap,
                    banner,
                },
                {
                    file: path.join(basePath, module),
                    format: 'esm',
                    freeze,
                    sourcemap,
                    banner,
                },
            ],
            // Generate the externals to use, by default don't include dependencies
            external: [
                ...Object.keys(pkg.config.dependencies || {}),
                ...Object.keys(pkg.config.peerDependencies || {})
            ],
            plugins,
        });

        // The package.json file has a bundle field
        // we'll use this to generate the bundle file
        // this will package all dependencies
        if (bundle) {
            const name = '__filters';
            const footer = `Object.assign(PIXI.filters, ${name});`;
            globals = Object.assign({
                '@pixi/core': 'PIXI',
                '@pixi/filter-alpha': 'PIXI.filters',
                '@pixi/filter-blur': 'PIXI.filters'
            }, globals);
            builds.push({
                input,
                external: Object.keys(globals),
                output: [
                    {
                        name,
                        banner,
                        globals,
                        file: path.join(basePath, bundle),
                        format: 'iife',
                        footer,
                        freeze,
                        sourcemap,
                    },
                    {
                        banner,
                        globals,
                        file: path.join(basePath, bundleModule),
                        format: 'esm',
                        freeze,
                        sourcemap,
                    },
                ],
                treeshake: false,
                plugins,
            });
        }
        return builds;
    };

    const results = [];

    await workspacesRun({ cwd: __dirname, orderByDeps: true }, (pkg) =>
    {
        if (!pkg.config.private)
        {
            results.push(...appendPackage(pkg));
        }
    });

    return results;
}

export default main();

