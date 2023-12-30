import { vertex, wgslVertex } from '@tools/fragments';
import fragment from './adjustment.frag';
import source from './adjustment.wgsl';
import { Filter, GlProgram, GpuProgram, UniformGroup } from 'pixi.js';

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
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/adjustment.png)
 *
 * @class
 * @extends Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-adjustment|@pixi/filter-adjustment}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
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

    /**
     * @param {object|number} [options] - The optional parameters of the filter.
     * @param {number} [options.gamma=1] - The amount of luminance
     * @param {number} [options.saturation=1] - The amount of color saturation
     * @param {number} [options.contrast=1] - The amount of contrast
     * @param {number} [options.brightness=1] - The overall brightness
     * @param {number} [options.red=1] - The multipled red channel
     * @param {number} [options.green=1] - The multipled green channel
     * @param {number} [options.blue=1] - The multipled blue channel
     * @param {number} [options.alpha=1] - The overall alpha amount
     */
    constructor(options?: AdjustmentFilterOptions)
    {
        options = { ...AdjustmentFilter.DEFAULT_OPTIONS, ...options };

        const adjustmentUniforms = new UniformGroup({
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
        });

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
            name: 'adjustment-filter'
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                adjustmentUniforms
            },
        });
    }

    /**
     * Amount of luminance
     * @default 1
     */
    get gamma(): number { return this.resources.adjustmentUniforms.uniforms.uGamma; }
    set gamma(value: number) { this.resources.adjustmentUniforms.uniforms.uGamma = value; }

    /**
     * Amount of contrast
     * @default 1
     */
    get contrast(): number { return this.resources.adjustmentUniforms.uniforms.uContrast; }
    set contrast(value: number) { this.resources.adjustmentUniforms.uniforms.uContrast = value; }

    /**
     * Amount of color saturation
     * @default 1
     */
    get saturation(): number { return this.resources.adjustmentUniforms.uniforms.uSaturation; }
    set saturation(value: number) { this.resources.adjustmentUniforms.uniforms.uSaturation = value; }

    /**
     * The overall brightness
     * @default 1
     */
    get brightness(): number { return this.resources.adjustmentUniforms.uniforms.uBrightness; }
    set brightness(value: number) { this.resources.adjustmentUniforms.uniforms.uBrightness = value; }

    /**
     * The multiplied red channel
     * @default 1
     */
    get red(): number { return this.resources.adjustmentUniforms.uniforms.uColor[0]; }
    set red(value: number) { this.resources.adjustmentUniforms.uniforms.uColor[0] = value; }

    /**
     * The multiplied blue channel
     * @default 1
     */
    get green(): number { return this.resources.adjustmentUniforms.uniforms.uColor[1]; }
    set green(value: number) { this.resources.adjustmentUniforms.uniforms.uColor[1] = value; }

    /**
     * The multiplied green channel
     * @default 1
     */
    get blue(): number { return this.resources.adjustmentUniforms.uniforms.uColor[2]; }
    set blue(value: number) { this.resources.adjustmentUniforms.uniforms.uColor[2] = value; }

    /**
     * The overall alpha channel
     * @default 1
     */
    get alpha(): number { return this.resources.adjustmentUniforms.uniforms.uColor[3]; }
    set alpha(value: number) { this.resources.adjustmentUniforms.uniforms.uColor[3] = value; }
}
