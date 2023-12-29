import { Filter, GlProgram } from 'pixi.js';
import { vertex } from '@tools/fragments';
import fragment from './hsladjustment.frag';

export interface HslAdjustmentFilterOptions
{
    hue: number;
    saturation: number;
    lightness: number;
    colorize: boolean;
    alpha: number;
}

/**
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/hsl-adjustment.png)
 *
 * @class
 * @extends Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-hsl-adjustment|@pixi/filter-hsl-adjustment}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export class HslAdjustmentFilter extends Filter
{
    private _hue = 0;

    /** Default values for options. */
    static readonly defaults: HslAdjustmentFilterOptions = {
        /** Hue */
        hue: 0,
        /** Saturation */
        saturation: 0,
        /** Lightness */
        lightness: 0,
        /** Colorize */
        colorize: false,
        /** Alpha */
        alpha: 1,
    };

    /**
     * @param options - The optional parameters of the filter.
     * @param {number} [options.hue=0] - The amount of hue in degrees (-180 to 180)
     * @param {number} [options.saturation=0] - The amount of color saturation (-1 to 1)
     * @param {number} [options.lightness=0] - The amount of lightness (-1 to 1)
     * @param {boolean} [options.colorize=false] - Whether to colorize the image
     * @param {number} [options.alpha=1] - The amount of alpha (0 to 1)
     */
    constructor(options?: Partial<HslAdjustmentFilterOptions>)
    {
        const glProgram = new GlProgram({
            vertex,
            fragment,
            name: 'hsl-adjustment-filter',
        });

        super({
            glProgram,
            resources: {},
        });
        const options_: HslAdjustmentFilterOptions = Object.assign({}, HslAdjustmentFilter.defaults, options);

        Object.assign(this, options_);
    }

    /**
     * Hue (-180 to 180)
     * @default 0
     */
    get hue(): number
    {
        return this._hue;
    }

    set hue(value: number)
    {
        this._hue = value;
        // this.uniforms.uHue = this._hue * (Math.PI / 180); // convert degrees to radians
    }

    /**
     * Alpha (0-1)
     * @default 1
     */
    // get alpha(): number
    // {
    //     return this.uniforms.uAlpha;
    // }

    // set alpha(value: number)
    // {
    //     this.uniforms.uAlpha = value;
    // }

    /**
     * Colorize (render as a single color)
     * @default false
     */
    // get colorize(): boolean
    // {
    //     return this.uniforms.uColorize;
    // }

    // set colorize(value: boolean)
    // {
    //     this.uniforms.uColorize = value;
    // }

    /**
     * Lightness (-1 to 1)
     * @default 0
     */
    // get lightness(): number
    // {
    //     return this.uniforms.uLightness;
    // }

    // set lightness(value: number)
    // {
    //     this.uniforms.uLightness = value;
    // }

    /**
     * Saturation (-1 to 1)
     * @default 0
     */
    // get saturation(): number
    // {
    //     return this.uniforms.uSaturation;
    // }

    // set saturation(value: number)
    // {
    //     this.uniforms.uSaturation = value;
    // }
}
