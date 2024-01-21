import { Filter, GlProgram, GpuProgram } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './crosshatch.frag';
import source from './crosshatch.wgsl';

/**
 * A Cross Hatch effect filter.<br>
 * ![original](../screenshots/original.png)![filter](../screenshots/cross-hatch.png)
 *
 * @class
 * @extends Filter
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
