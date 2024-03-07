import { Filter, GlProgram, GpuProgram } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './adjustment.frag';
import source from './adjustment.wgsl';

/** Options for the AdjustmentFilter constructor */
export interface AdjustmentFilterOptions
{
    /**
     * The amount of luminance
     * @default 1
     */
    gamma?: number;
    /**
     * The amount of contrast
     * @default 1
     */
    contrast?: number;
    /**
     * The amount of color saturation
     * @default 1
     */
    saturation?: number;
    /**
     * The overall brightness
     * @default 1
     */
    brightness?: number;
    /**
     * The multiplied red channel
     * @default 1
     */
    red?: number;
    /**
     * The multiplied green channel
     * @default 1
     */
    green?: number;
    /**
     * The multiplied blue channel
     * @default 1
     */
    blue?: number;
    /**
     * The overall alpha channel
     * @default 1
     */
    alpha?: number;
}

/**
 * The ability to adjust gamma, contrast, saturation, brightness, alpha or color-channel shift.
 * This is a faster and much simpler to use than
 * {@link http://pixijs.download/release/docs/ColorMatrixFilter.html ColorMatrixFilter}
 * because it does not use a matrix.<br>
 * ![original](../screenshots/original.png)![filter](../screenshots/adjustment.png)
 *
 * @class
 * @extends Filter
 */
export class AdjustmentFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: AdjustmentFilterOptions = {
        gamma: 1,
        contrast: 1,
        saturation: 1,
        brightness: 1,
        red: 1,
        green: 1,
        blue: 1,
        alpha: 1,
    };

    public uniforms: {
        uGamma: number;
        uContrast: number;
        uSaturation: number;
        uBrightness: number;
        uColor: Float32Array;
    };

    /**
     * @param options - The options of the adjustment filter.
     */
    constructor(options?: AdjustmentFilterOptions)
    {
        options = { ...AdjustmentFilter.DEFAULT_OPTIONS, ...options };

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
            name: 'adjustment-filter'
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                adjustmentUniforms: {
                    uGamma: { value: options.gamma, type: 'f32' },
                    uContrast: { value: options.contrast, type: 'f32' },
                    uSaturation: { value: options.saturation, type: 'f32' },
                    uBrightness: { value: options.brightness, type: 'f32' },
                    uColor: {
                        value: [
                            options.red,
                            options.green,
                            options.blue,
                            options.alpha,
                        ],
                        type: 'vec4<f32>',
                    },
                }
            },
        });

        this.uniforms = this.resources.adjustmentUniforms.uniforms;
    }

    /**
     * Amount of luminance
     * @default 1
     */
    get gamma(): number { return this.uniforms.uGamma; }
    set gamma(value: number) { this.uniforms.uGamma = value; }

    /**
     * Amount of contrast
     * @default 1
     */
    get contrast(): number { return this.uniforms.uContrast; }
    set contrast(value: number) { this.uniforms.uContrast = value; }

    /**
     * Amount of color saturation
     * @default 1
     */
    get saturation(): number { return this.uniforms.uSaturation; }
    set saturation(value: number) { this.uniforms.uSaturation = value; }

    /**
     * The overall brightness
     * @default 1
     */
    get brightness(): number { return this.uniforms.uBrightness; }
    set brightness(value: number) { this.uniforms.uBrightness = value; }

    /**
     * The multiplied red channel
     * @default 1
     */
    get red(): number { return this.uniforms.uColor[0]; }
    set red(value: number) { this.uniforms.uColor[0] = value; }

    /**
     * The multiplied blue channel
     * @default 1
     */
    get green(): number { return this.uniforms.uColor[1]; }
    set green(value: number) { this.uniforms.uColor[1] = value; }

    /**
     * The multiplied green channel
     * @default 1
     */
    get blue(): number { return this.uniforms.uColor[2]; }
    set blue(value: number) { this.uniforms.uColor[2] = value; }

    /**
     * The overall alpha channel
     * @default 1
     */
    get alpha(): number { return this.uniforms.uColor[3]; }
    set alpha(value: number) { this.uniforms.uColor[3] = value; }
}
