import { Filter, GlProgram, GpuProgram } from 'pixi.js';
import fragment from './crosshatch.frag';
import source from './crosshatch.wgsl';
import { vertex, wgslVertex } from '@tools/fragments';

/**
 * A Cross Hatch effect filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/cross-hatch.png)
 *
 * @class
 * @extends Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-cross-hatch|@pixi/filter-cross-hatch}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export class CrossHatchFilter extends Filter
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
            name: 'cross-hatch-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {},
        });
    }
}
