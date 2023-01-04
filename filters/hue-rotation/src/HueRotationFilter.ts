import { Filter } from '@pixi/core';
import { vertex } from '@tools/fragments';
import fragment from './huerotation.frag';

interface HueRotationFilterOptions
{
    hue: number;
    saturation: number;
    lightness: number;
    colorize: boolean;
    alpha: number;
}

/**
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/hue-rotation.png)
 *
 * @class
 * @extends PIXI.Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-hue-rotation|@pixi/filter-hue-rotation}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
class HueRotationFilter extends Filter
{
    private _hue = 0;

    /** Default values for options. */
    static readonly defaults: HueRotationFilterOptions = {
        hue: 0,
        saturation: 0,
        lightness: 0,
        colorize: false,
        alpha: 1,
    };

    constructor(options?: Partial<HueRotationFilterOptions>)
    {
        super(vertex, fragment);
        const options_: HueRotationFilterOptions = Object.assign({}, HueRotationFilter.defaults, options);

        Object.assign(this, options_);
    }

    /**
   * The hue of rotation
   * @default 0
   */
    get hue(): number
    {
        return this._hue;
    }

    set hue(value: number)
    {
        this._hue = value;
        this.uniforms.uHue = this._hue * (Math.PI / 180); // convert degrees to radians
    }

    /**
   * The alpha value of the hue rotation
   * @default 1
   */
    get alpha(): boolean
    {
        return this.uniforms.uAlpha;
    }

    set alpha(value: boolean)
    {
        this.uniforms.uAlpha = value;
    }

    /**
   * Colorize the texture (use single color)
   * @default false
   */
    get colorize(): boolean
    {
        return this.uniforms.uColorize;
    }

    set colorize(value: boolean)
    {
        this.uniforms.uColorize = value;
    }

    /**
   * The lightness value of the hue rotation
   * @default 1
   */
    get lightness(): boolean
    {
        return this.uniforms.uLightness;
    }

    set lightness(value: boolean)
    {
        this.uniforms.uLightness = value;
    }

    /**
   * The saturation value of the hue rotation
   * @default 1
   */
    get saturation(): boolean
    {
        return this.uniforms.uSaturation;
    }

    set saturation(value: boolean)
    {
        this.uniforms.uSaturation = value;
    }
}

export { HueRotationFilter };
export type { HueRotationFilterOptions };
