import fragment from './colorGradient.frag';
import vertex from './colorGradient.vert';
import { Filter, utils } from '@pixi/core';
import { parseCssGradient } from './CssGradientParser';

export type Color = number | string | Float32Array | number[];

export interface ColorStop
{
    offset: number;
    color: Color;
    alpha: number;
}

export interface ColorGradientFilterOptions
{
    type: number;
    stops: ColorStop[];
    angle: number;
    alpha: number;
    maxColors: number;
}

function sortColorStops(stops: ColorStop[]): ColorStop[]
{
    return [...stops].sort((a, b) => a.offset - b.offset);
}

/**
 * Render a colored gradient.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/color-gradient.png)
 *
 * @class
 * @extends PIXI.Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-color-gradient|@pixi/filter-color-gradient}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
class ColorGradientFilter extends Filter
{
    /** Gradient types */
    static readonly LINEAR = 0;
    static readonly RADIAL = 1;
    static readonly CONIC = 2;

    /** Default constructor options */
    public static readonly defaults: ColorGradientFilterOptions = {
        type: ColorGradientFilter.LINEAR,
        stops: [
            { offset: 0.0, color: 0xff0000, alpha: 1.0 },
            { offset: 1.0, color: 0x0000ff, alpha: 1.0 },
        ],
        alpha: 1.0,
        angle: 0.0,
        maxColors: 0,
    };

    public static fromCssGradient(cssGradient: string, options?: Partial<ColorGradientFilterOptions>) : ColorGradientFilter
    {
        const optionsFromCssGradient = parseCssGradient(cssGradient);
        const options_ = { ...optionsFromCssGradient, options };

        return new ColorGradientFilter(options_);
    }

    private _stops: ColorStop[] = [];

    /**
   * @param {object} [options]
   * @param {number} [options.type] - Acceptable values:
   *  - `0` {@link ColorGradientFilter.LINEAR LINEAR}
   *  - `1` {@link ColorGradientFilter.RADIAL RADIAL}
   *  - `2` {@link ColorGradientFilter.CONIC CONIC}
   * @param {ColorStop[]} [options.stops] - Color stops
   * @param {number} [options.angle=90] - Angle in degrees
   * @param {number} [options.alpha=1.0] - Alpha value
   * @param {number} [options.maxColors=0] - Maximum number of colors to render (0 = disabled)
   */
    constructor(options?: Partial<ColorGradientFilterOptions>)
    {
        const options_ = { ...ColorGradientFilter.defaults, ...options };

        super(vertex, fragment.replace(/%numStops%/g, options_.stops.length.toString()));
        this.autoFit = false;

        Object.assign(this, options_);
    }

    get stops(): ColorStop[]
    {
        return this._stops;
    }

    set stops(stops: ColorStop[])
    {
        const sortedStops = sortColorStops(stops);

        const colors = new Float32Array(sortedStops.length * 3);
        const R = 0;
        const G = 1;
        const B = 2;

        for (let i = 0; i < sortedStops.length; i++)
        {
            const color = colorToRgb(sortedStops[i].color);
            const indexStart = i * 3;

            colors[indexStart + R] = color[R];
            colors[indexStart + G] = color[G];
            colors[indexStart + B] = color[B];
        }

        this.uniforms.uColors = colors;
        this.uniforms.uOffsets = sortedStops.map((s) => s.offset);
        this.uniforms.uAlphas = sortedStops.map((s) => s.alpha);
        this._stops = sortedStops;
    }

    /**
   * The type of gradient
   * @default ColorGradientFilter.LINEAR
   */
    set type(value: number)
    {
        this.uniforms.uType = value;
    }

    get type(): number
    {
        return this.uniforms.uType;
    }

    /**
   * The angle of the gradient
   * @default 0
   */
    set angle(value: number)
    {
        this.uniforms.uAngle = value;
    }

    get angle(): number
    {
        return this.uniforms.uAngle;
    }

    /**
   * The alpha value of the gradient
   * @default 0
   */
    set alpha(value: number)
    {
        this.uniforms.uAlpha = value;
    }

    get alpha(): number
    {
        return this.uniforms.uAlpha;
    }

    /**
   * The maximum number of colors to render
   * @default 0
   */
    set maxColors(value: number)
    {
        this.uniforms.uMaxColors = value;
    }

    get maxColors(): number
    {
        return this.uniforms.uMaxColors;
    }
}

export { ColorGradientFilter };

// utils
function colorToRgb(value: Color): number[] | Float32Array
{
    switch (typeof value)
    {
        case 'string':
            return utils.hex2rgb(utils.string2hex(value));
        case 'number':
            return utils.hex2rgb(value);
        default:
            return value;
    }
}
