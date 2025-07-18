import { Filter, GlProgram, GpuProgram } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './emboss.frag';
import source from './emboss.wgsl';

import type { FilterOptions } from 'pixi.js';

/** Options for the EmbossFilter constructor. */
interface EmbossFilterOptions extends FilterOptions
{
    strength?: number;
}

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
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS = {
        strength: 5,
    };

    /**
     * @param strengthOrOptions - The strength of the emboss effect or options.
     */
    constructor(strengthOrOptions?: number | EmbossFilterOptions)
    {
        let options: EmbossFilterOptions;

        if (typeof strengthOrOptions === 'number' || strengthOrOptions === undefined)
        {
            options = { strength: strengthOrOptions ?? EmbossFilter.DEFAULT_OPTIONS.strength };
        }
        else
        {
            options = strengthOrOptions;
        }

        const {
            strength,
            ...rest
        } = { ...EmbossFilter.DEFAULT_OPTIONS, ...options };

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
            ...rest
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
