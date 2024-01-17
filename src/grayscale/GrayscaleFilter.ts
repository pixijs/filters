import { Filter, GlProgram, GpuProgram } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './grayscale.frag';
import source from './grayscale.wgsl';

/**
 * This filter applies a grayscale effect.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/grayscale.png)
 *
 * @class
 * @extends Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-grayscale|@pixi/filter-grayscale}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export class GrayscaleFilter extends Filter
{
    constructor()
    {
        const gpuProgram = new GpuProgram({
            vertex: {
                source: wgslVertex,
                entryPoint: 'mainVertex',
            },
            fragment: {
                source,
                entryPoint: 'mainFragment',
            },
        });

        const glProgram = new GlProgram({
            vertex,
            fragment,
            name: 'grayscale-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {},
        });
    }
}
