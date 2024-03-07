import { Filter, GlProgram, GpuProgram } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './emboss.frag';
import source from './emboss.wgsl';

/**
 * An RGB Split Filter.<br>
 * ![original](../screenshots/original.png)![filter](../screenshots/emboss.png)
 *
 * @class
 * @extends Filter
 */
export class EmbossFilter extends Filter
{
    public uniforms: {
        uStrength: number;
    };

    /**
     * @param {number} [strength=5] - Strength of the emboss.
     */
    constructor(strength = 5)
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
            name: 'emboss-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                embossUniforms: {
                    uStrength: { value: strength, type: 'f32' },
                }
            },
        });

        this.uniforms = this.resources.embossUniforms.uniforms;
    }

    /**
     * Strength of the emboss
     * @default 5
     */
    get strength(): number { return this.uniforms.uStrength; }
    set strength(value: number) { this.uniforms.uStrength = value; }
}
