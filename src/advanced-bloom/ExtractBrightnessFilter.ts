import { Filter, GlProgram, GpuProgram } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './extract-brightness.frag';
import source from './extract-brightness.wgsl';

import type { FilterOptions } from 'pixi.js';

export interface ExtractBrightnessFilterOptions extends FilterOptions
{
    /**
     * Defines how bright a color needs to be extracted.
     */
    threshold?: number;
}

/**
 * Internal filter for retrieving the brightness of the source image.
 * @class
 * @private
 */
export class ExtractBrightnessFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS = {
        threshold: 0.5
    };

    public uniforms: {
        uThreshold: number;
    };

    constructor(options?: ExtractBrightnessFilterOptions)
    {
        const {
            threshold,
            ...rest
        } = { ...ExtractBrightnessFilter.DEFAULT_OPTIONS, ...options };

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
            name: 'extract-brightness-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                extractBrightnessUniforms: {
                    uThreshold: { value: threshold, type: 'f32' },
                }
            },
            ...rest
        });

        this.uniforms = this.resources.extractBrightnessUniforms.uniforms;
    }

    /**
     * Defines how bright a color needs to be extracted.
     * @default 0.5
     */
    get threshold(): number { return this.uniforms.uThreshold; }
    set threshold(value: number) { this.uniforms.uThreshold = value; }
}
