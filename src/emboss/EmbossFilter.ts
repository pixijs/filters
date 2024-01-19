import { Filter, GlProgram, GpuProgram } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './emboss.frag';
import source from './emboss.wgsl';

export interface EmbossFilterOptions
{
    /**
     * Strength of the emboss
     * @default 5
     */
    strength?: number;
}

/**
 * An RGB Split Filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/emboss.png)
 *
 * @class
 * @extends Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-emboss|@pixi/filter-emboss}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export class EmbossFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: EmbossFilterOptions = {
        strength: 5,
    };

    public uniforms: {
        uStrength: number;
    };

    constructor(options?: EmbossFilterOptions)
    {
        options = { ...EmbossFilter.DEFAULT_OPTIONS, ...options };

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
            name: 'emboss-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                embossUniforms: {
                    uStrength: { value: options.strength, type: 'f32' },
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
