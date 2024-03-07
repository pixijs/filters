import { Filter, GlProgram, GpuProgram } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './old-film.frag';
import source from './old-film.wgsl';

import type { FilterSystem, RenderSurface, Texture } from 'pixi.js';

/** Options for the OldFilmFilter constructor. */
export interface OldFilmFilterOptions
{
    /**
     * The amount of saturation of sepia effect,
     * a value of `1` is more saturation and closer to `0` is less, and a value of `0` produces no sepia effect
     * @default 0.3
     */
    sepia?: number;
    /**
     * Opacity/intensity of the noise effect between `0` and `1`
     * @default 0.3
     */
    noise?: number;
    /**
     * The size of the noise particles
     * @default 1
     */
    noiseSize?: number;
    /**
     * How often scratches appear
     * @default 0.5
     */
    scratch?: number;
    /**
     * The density of the number of scratches
     * @default 0.3
     */
    scratchDensity?: number;
    /**
     * The width of the scratches
     * @default 1
     */
    scratchWidth?: number;
    /**
     * The radius of the vignette effect, smaller values produces a smaller vignette
     * @default 0.3
     */
    vignetting?: number;
    /**
     * Amount of opacity on the vignette
     * @default 1
     */
    vignettingAlpha?: number;
    /**
     * Blur intensity of the vignette
     * @default 1
     */
    vignettingBlur?: number;
    /**
     * A seed value to apply to the random noise generation
     * @default 0
     */
    seed?: number;
}

/**
 * The OldFilmFilter applies a Old film effect to an object.<br>
 * ![original](../screenshots/original.png)![filter](../screenshots/old-film.gif)
 *
 * @class
 * @extends Filter
 */
export class OldFilmFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: OldFilmFilterOptions = {
        sepia: 0.3,
        noise: 0.3,
        noiseSize: 1,
        scratch: 0.5,
        scratchDensity: 0.3,
        scratchWidth: 1,
        vignetting: 0.3,
        vignettingAlpha: 1,
        vignettingBlur: 0.3,
        seed: 0
    };

    public uniforms: {
        uSepia: number;
        uNoise: Float32Array;
        uScratch: Float32Array;
        uVignetting: Float32Array;
        uSeed: number;
        uDimensions: Float32Array;
    };

    /**
     * A seed value to apply to the random noise generation
     * @default 0
     */
    public seed!: number;

    /**
     * @param options - Options for the OldFilmFilter constructor.
     */
    constructor(options?: OldFilmFilterOptions)
    {
        options = { ...OldFilmFilter.DEFAULT_OPTIONS, ...options };

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
            name: 'old-film-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                oldFilmUniforms: {
                    uSepia: { value: options.sepia, type: 'f32' },
                    uNoise: { value: new Float32Array(2), type: 'vec2<f32>' },
                    uScratch: { value: new Float32Array(3), type: 'vec3<f32>' },
                    uVignetting: { value: new Float32Array(3), type: 'vec3<f32>' },
                    uSeed: { value: options.seed, type: 'f32' },
                    uDimensions: { value: new Float32Array(2), type: 'vec2<f32>' },
                }
            },
        });

        this.uniforms = this.resources.oldFilmUniforms.uniforms;

        Object.assign(this, options);
    }

    /**
     * Override existing apply method in `Filter`
     * @override
     * @ignore
     */
    public override apply(
        filterManager: FilterSystem,
        input: Texture,
        output: RenderSurface,
        clearMode: boolean
    ): void
    {
        this.uniforms.uDimensions[0] = input.frame.width;
        this.uniforms.uDimensions[1] = input.frame.height;
        this.uniforms.uSeed = this.seed;

        filterManager.applyFilter(this, input, output, clearMode);
    }

    /**
     * The amount of saturation of sepia effect,
     * a value of `1` is more saturation and closer to `0` is less, and a value of `0` produces no sepia effect
     * @default 0.3
     */
    get sepia(): number { return this.uniforms.uSepia; }
    set sepia(value: number) { this.uniforms.uSepia = value; }

    /**
     * Opacity/intensity of the noise effect between `0` and `1`
     * @default 0.3
     */
    get noise(): number { return this.uniforms.uNoise[0]; }
    set noise(value: number) { this.uniforms.uNoise[0] = value; }

    /**
     * The size of the noise particles
     * @default 1
     */
    get noiseSize(): number { return this.uniforms.uNoise[1]; }
    set noiseSize(value: number) { this.uniforms.uNoise[1] = value; }

    /**
     * How often scratches appear
     * @default 0.5
     */
    get scratch(): number { return this.uniforms.uScratch[0]; }
    set scratch(value: number) { this.uniforms.uScratch[0] = value; }

    /**
     * The density of the number of scratches
     * @default 0.3
     */
    get scratchDensity(): number { return this.uniforms.uScratch[1]; }
    set scratchDensity(value: number) { this.uniforms.uScratch[1] = value; }

    /**
     * The width of the scratches
     * @default 1
     */
    get scratchWidth(): number { return this.uniforms.uScratch[2]; }
    set scratchWidth(value: number) { this.uniforms.uScratch[2] = value; }

    /**
     * The radius of the vignette effect, smaller values produces a smaller vignette
     * @default 0.3
     */
    get vignetting(): number { return this.uniforms.uVignetting[0]; }
    set vignetting(value: number) { this.uniforms.uVignetting[0] = value; }

    /**
     * Amount of opacity on the vignette
     * @default 1
     */
    get vignettingAlpha(): number { return this.uniforms.uVignetting[1]; }
    set vignettingAlpha(value: number) { this.uniforms.uVignetting[1] = value; }

    /**
     * Blur intensity of the vignette
     * @default 1
     */
    get vignettingBlur(): number { return this.uniforms.uVignetting[2]; }
    set vignettingBlur(value: number) { this.uniforms.uVignetting[2] = value; }
}
