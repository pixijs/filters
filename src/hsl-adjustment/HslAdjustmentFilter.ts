import { Filter, GlProgram, GpuProgram } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './hsladjustment.frag';
import source from './hsladjustment.wgsl';

/**
 * Options for the HslAdjustmentFilter constructor.
 */
export interface HslAdjustmentFilterOptions
{
    /**
     * The amount of hue in degrees (-180 to 180)
     * @default 0
     */
    hue: number;
    /**
     * The amount of color saturation (-1 to 1)
     * @default 0
     */
    saturation: number;
    /**
     * The amount of lightness (-1 to 1)
     * @default 0
     */
    lightness: number;
    /**
     * Whether to colorize the image
     * @default false
     */
    colorize: boolean;
    /**
     * The amount of alpha (0 to 1)
     * @default 1
     */
    alpha: number;
}

/**
 * ![original](../screenshots/original.png)![filter](../screenshots/hsl-adjustment.png)
 *
 * This WebGPU filter has been ported from the WebGL renderer that was originally created by Viktor Persson (@vikpe)
 *
 * @class
 * @extends Filter
 */
export class HslAdjustmentFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: HslAdjustmentFilterOptions = {
        hue: 0,
        saturation: 0,
        lightness: 0,
        colorize: false,
        alpha: 1,
    };

    public uniforms: {
        uHsl: Float32Array;
        uColorize: number;
        uAlpha: number;
    };

    private _hue!: number;

    /**
     * @param options - Options for the HslAdjustmentFilter constructor.
     */
    constructor(options?: HslAdjustmentFilterOptions)
    {
        options = { ...HslAdjustmentFilter.DEFAULT_OPTIONS, ...options };

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
            name: 'hsl-adjustment-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                hslUniforms: {
                    uHsl: { value: new Float32Array(3), type: 'vec3<f32>' },
                    uColorize: { value: options.colorize ? 1 : 0, type: 'f32' },
                    uAlpha: { value: options.alpha, type: 'f32' },
                },
            },
        });

        this.uniforms = this.resources.hslUniforms.uniforms;
        Object.assign(this, options);
    }

    /**
     * The amount of hue in degrees (-180 to 180)
     * @default 0
     */
    get hue(): number { return this._hue; }
    set hue(value: number)
    {
        this._hue = value;
        this.uniforms.uHsl[0] = value * (Math.PI / 180);
    }

    /**
     * The amount of lightness (-1 to 1)
     * @default 0
     */
    get saturation(): number { return this.uniforms.uHsl[1]; }
    set saturation(value: number) { this.uniforms.uHsl[1] = value; }

    /**
     * The amount of lightness (-1 to 1)
     * @default 0
     */
    get lightness(): number { return this.uniforms.uHsl[2]; }
    set lightness(value: number) { this.uniforms.uHsl[2] = value; }

    /**
     * Whether to colorize the image
     * @default false
     */
    get colorize(): boolean { return this.uniforms.uColorize === 1; }
    set colorize(value: boolean) { this.uniforms.uColorize = value ? 1 : 0; }

    /**
     * The amount of alpha (0 to 1)
     * @default 1
     */
    get alpha(): number { return this.uniforms.uAlpha; }
    set alpha(value: number) { this.uniforms.uAlpha = value; }
}
