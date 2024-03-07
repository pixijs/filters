import { Filter, GlProgram, GpuProgram } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './grayscale.frag';
import source from './grayscale.wgsl';

/**
 * This filter applies a grayscale effect.<br>
 * ![original](../screenshots/original.png)![filter](../screenshots/grayscale.png)
 *
 * @class
 * @extends Filter
 */
export class GrayscaleFilter extends Filter
{
    constructor()
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
            name: 'grayscale-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {},
        });
    }
}
