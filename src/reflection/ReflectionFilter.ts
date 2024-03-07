import { Filter, GlProgram, GpuProgram } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './reflection.frag';
import source from './reflection.wgsl';

import type { FilterSystem, RenderSurface, Texture } from 'pixi.js';

/** [MIN, MAX] */
type Range = [number, number] | Float32Array;

/** Options for the ReflectionFilter constructor. */
export interface ReflectionFilterOptions
{
    /**
     * `true` to reflect the image, `false` for waves-only
     * @default true
     */
    mirror?: boolean;
    /**
     * Vertical position of the reflection point, `0.5` equates to the middle
     * smaller numbers produce a larger reflection, larger numbers produce a smaller reflection
     * @default 0.5
     */
    boundary?: number;
    /**
     * Starting and ending amplitude of waves
     * @default [0,20]
     */
    amplitude?: Range;
    /**
     * Starting and ending length of waves
     * @default [30,100]
     */
    waveLength?: Range;
    /**
     * Starting and ending alpha values
     * @default [1,1]
     */
    alpha?: Range;
    /**
     * Time for animating position of waves
     * @default 0
     */
    time?: number;
}

/**
 * Applies a reflection effect to simulate the reflection on water with waves.<br>
 * ![original](../screenshots/original.png)![filter](../screenshots/reflection.png)
 *
 * @class
 * @extends Filter
 */
export class ReflectionFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: ReflectionFilterOptions = {
        mirror: true,
        boundary: 0.5,
        amplitude: [0, 20],
        waveLength: [30, 100],
        alpha: [1, 1],
        time: 0,
    };

    public uniforms: {
        uMirror: number;
        uBoundary: number;
        uAmplitude: Float32Array;
        uWavelength: Float32Array;
        uAlpha: Float32Array;
        uTime: number;
        uDimensions: Float32Array;
    };

    /**
     * Time for animating position of waves
     * @default 0
     */
    public time = 0;

    /**
     * @param options - Options for the ReflectionFilter constructor.
     */
    constructor(options?: ReflectionFilterOptions)
    {
        options = { ...ReflectionFilter.DEFAULT_OPTIONS, ...options };

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
            name: 'reflection-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                reflectionUniforms: {
                    uMirror: { value: options.mirror ? 1 : 0, type: 'f32' },
                    uBoundary: { value: options.boundary, type: 'f32' },
                    uAmplitude: { value: options.amplitude, type: 'vec2<f32>' },
                    uWavelength: { value: options.waveLength, type: 'vec2<f32>' },
                    uAlpha: { value: options.alpha, type: 'vec2<f32>' },
                    uTime: { value: options.time, type: 'f32' },
                    uDimensions: { value: new Float32Array(2), type: 'vec2<f32>' },
                }
            },
        });

        this.uniforms = this.resources.reflectionUniforms.uniforms;

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

        this.uniforms.uTime = this.time;

        filterManager.applyFilter(this, input, output, clearMode);
    }

    /**
     * `true` to reflect the image, `false` for waves-only
     * @default true
     */
    get mirror(): boolean { return this.uniforms.uMirror > 0.5; }
    set mirror(value: boolean) { this.uniforms.uMirror = value ? 1 : 0; }

    /**
     * Vertical position of the reflection point, default is 50% (middle)
     * smaller numbers produce a larger reflection, larger numbers produce a smaller reflection.
     * @default 0.5
     */
    get boundary(): number { return this.uniforms.uBoundary; }
    set boundary(value: number) { this.uniforms.uBoundary = value; }

    /**
     * Starting and ending amplitude of waves
     * @default [0,20]
     */
    get amplitude(): Range { return Array.from(this.uniforms.uAmplitude) as Range; }
    set amplitude(value: Range)
    {
        this.uniforms.uAmplitude[0] = value[0];
        this.uniforms.uAmplitude[1] = value[1];
    }

    /**
     * Starting amplitude of waves
     * @default 0
     */
    get amplitudeStart(): number { return this.uniforms.uAmplitude[0]; }
    set amplitudeStart(value: number) { this.uniforms.uAmplitude[0] = value; }

    /**
     * Starting amplitude of waves
     * @default 20
     */
    get amplitudeEnd(): number { return this.uniforms.uAmplitude[1]; }
    set amplitudeEnd(value: number) { this.uniforms.uAmplitude[1] = value; }

    /**
     * Starting and ending length of waves
     * @default [30,100]
     */
    get waveLength(): Range { return Array.from(this.uniforms.uWavelength) as Range; }
    set waveLength(value: Range)
    {
        this.uniforms.uWavelength[0] = value[0];
        this.uniforms.uWavelength[1] = value[1];
    }

    /**
     * Starting wavelength of waves
     * @default 30
     */
    get wavelengthStart(): number { return this.uniforms.uWavelength[0]; }
    set wavelengthStart(value: number) { this.uniforms.uWavelength[0] = value; }

    /**
     * Starting wavelength of waves
     * @default 100
     */
    get wavelengthEnd(): number { return this.uniforms.uWavelength[1]; }
    set wavelengthEnd(value: number) { this.uniforms.uWavelength[1] = value; }

    /**
     * Starting and ending alpha values
     * @default [1,1]
     */
    get alpha(): Range { return Array.from(this.uniforms.uAlpha) as Range; }
    set alpha(value: Range)
    {
        this.uniforms.uAlpha[0] = value[0];
        this.uniforms.uAlpha[1] = value[1];
    }

    /**
     * Starting wavelength of waves
     * @default 1
     */
    get alphaStart(): number { return this.uniforms.uAlpha[0]; }
    set alphaStart(value: number) { this.uniforms.uAlpha[0] = value; }

    /**
     * Starting wavelength of waves
     * @default 1
     */
    get alphaEnd(): number { return this.uniforms.uAlpha[1]; }
    set alphaEnd(value: number) { this.uniforms.uAlpha[1] = value; }
}
