import { Filter, GlProgram, GpuProgram } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './crt.frag';
import source from './crt.wgsl';

import type { FilterSystem, RenderSurface, Texture } from 'pixi.js';

/** Options for the CRTFilter constructor. */
export interface CRTFilterOptions
{
    /**
     * Bend of interlaced lines, higher value means more bend
     * @default 1
     */
    curvature?: number,
    /**
     * Width of the interlaced lines
     * @default 1
     */
    lineWidth?: number,
    /**
     * Contrast of interlaced lines
     * @default 0.25
     */
    lineContrast?: number,
    /**
     * The orientation of the line:
     *
     * `true` create vertical lines, `false` creates horizontal lines
     * @default false
     */
    verticalLine?: boolean,
    /**
     * For animating interlaced lines
     * @default 0
     */
    time?: number,
    /**
     * Opacity/intensity of the noise effect between `0` and `1`
     * @default 0.3
     */
    noise?: number,
    /**
     * The size of the noise particles
     * @default 1
     */
    noiseSize?: number,
    /**
     * A seed value to apply to the random noise generation
     * @default 0
     */
    seed?: number,
    /**
     * The radius of the vignette effect, smaller values produces a smaller vignette
     * @default 0.3
     */
    vignetting?: number,
    /**
     * Amount of opacity on the vignette
     * @default 1
     */
    vignettingAlpha?: number,
    /**
     * Blur intensity of the vignette
     * @default 0.3
     */
    vignettingBlur?: number,
}

/**
 * The CRTFilter applies a CRT effect to an object.<br>
 * ![original](../screenshots/original.png)![filter](../screenshots/crt.png)
 *
 * @class
 * @extends Filter
 */
export class CRTFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: CRTFilterOptions = {
        curvature: 1.0,
        lineWidth: 1.0,
        lineContrast: 0.25,
        verticalLine: false,
        noise: 0.0,
        noiseSize: 1.0,
        vignetting: 0.3,
        vignettingAlpha: 1.0,
        vignettingBlur: 0.3,
        time: 0.0,
        seed: 0.0,
    };

    public uniforms: {
        uLine: Float32Array;
        uNoise: Float32Array;
        uVignette: Float32Array;
        uSeed: number;
        uTime: number;
        uDimensions: Float32Array;
    };

    /**
     * A seed value to apply to the random noise generation
     * @default 0
     */
    public seed!: number;

    /**
     * Opacity/intensity of the noise effect between `0` and `1`
     * @default 0.3
     */
    public time!: number;

    /**
     * @param options - Options for the CRTFilter constructor.
     */
    constructor(options?: CRTFilterOptions)
    {
        options = { ...CRTFilter.DEFAULT_OPTIONS, ...options };

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
            name: 'crt-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                crtUniforms: {
                    uLine: { value: new Float32Array(4), type: 'vec4<f32>' },
                    uNoise: { value: new Float32Array(2), type: 'vec2<f32>' },
                    uVignette: { value: new Float32Array(3), type: 'vec3<f32>' },
                    uSeed: { value: options.seed, type: 'f32' },
                    uTime: { value: options.time, type: 'f32' },
                    uDimensions: { value: new Float32Array(2), type: 'vec2<f32>' },
                }
            },
        });

        this.uniforms = this.resources.crtUniforms.uniforms;

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
        this.uniforms.uTime = this.time;

        filterManager.applyFilter(this, input, output, clearMode);
    }

    /**
     * Bend of interlaced lines, higher value means more bend
     * @default 1
     */
    get curvature(): number { return this.uniforms.uLine[0]; }
    set curvature(value: number) { this.uniforms.uLine[0] = value; }

    /**
     * Width of interlaced lines
     * @default 1
     */
    get lineWidth(): number { return this.uniforms.uLine[1]; }
    set lineWidth(value: number) { this.uniforms.uLine[1] = value; }

    /**
     * Contrast of interlaced lines
     * @default 0.25
     */
    get lineContrast(): number { return this.uniforms.uLine[2]; }
    set lineContrast(value: number) { this.uniforms.uLine[2] = value; }

    /**
     * The orientation of the line:
     *
     * `true` create vertical lines, `false` creates horizontal lines
     * @default false
     */
    get verticalLine(): boolean { return this.uniforms.uLine[3] > 0.5; }
    set verticalLine(value: boolean) { this.uniforms.uLine[3] = value ? 1 : 0; }

    /**
     * Opacity/intensity of the noise effect between `0` and `1`
     * @default 0.3
     */
    get noise(): number { return this.uniforms.uNoise[0]; }
    set noise(value: number) { this.uniforms.uNoise[0] = value; }

    /**
     * The size of the noise particles
     * @default 0
     */
    get noiseSize(): number { return this.uniforms.uNoise[1]; }
    set noiseSize(value: number) { this.uniforms.uNoise[1] = value; }

    /**
     * The radius of the vignette effect, smaller values produces a smaller vignette
     * @default 0.3
     */
    get vignetting(): number { return this.uniforms.uVignette[0]; }
    set vignetting(value: number) { this.uniforms.uVignette[0] = value; }

    /**
     * Amount of opacity of vignette
     * @default 1
     */
    get vignettingAlpha(): number { return this.uniforms.uVignette[1]; }
    set vignettingAlpha(value: number) { this.uniforms.uVignette[1] = value; }

    /**
     * Blur intensity of the vignette
     * @default 0.3
     */
    get vignettingBlur(): number { return this.uniforms.uVignette[2]; }
    set vignettingBlur(value: number) { this.uniforms.uVignette[2] = value; }
}
