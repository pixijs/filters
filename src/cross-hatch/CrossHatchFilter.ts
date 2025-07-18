import { Filter, GlProgram, GpuProgram } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './crosshatch.frag';
import source from './crosshatch.wgsl';

import type { FilterOptions } from 'pixi.js';

/**
 * A Cross Hatch effect filter.<br>
 * ![original](../screenshots/original.png)![filter](../screenshots/cross-hatch.png)
 *
 * @class
 * @extends Filter
 */
export class CrossHatchFilter extends Filter
{
    constructor(options: FilterOptions)
    {
        const gpuProgram = GpuProgram.from({
            vertex: {
                source: wgslVertex,
                entryPoint: 'mainVertex',
            },
            fragment: {
                source,
                entryPoint: 'mainFragment',
            },
        });

        const glProgram = GlProgram.from({
            vertex,
            fragment,
            name: 'cross-hatch-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {},
            ...options
        });
    }
}
