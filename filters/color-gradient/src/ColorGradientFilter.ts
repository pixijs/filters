import fragment from './colorGradient.frag';
import vertex from './colorGradient.vert';
import { Filter } from '@pixi/core';
import { parseCssGradient } from './CssGradientParser';
import { colorToNormalizedRgba } from './utils';

export type Color = number | string | Float32Array | number[];

export type ColorStop = {
    offset: number;
    color: Color;
    alpha: number;
};

export type DefaultOptions = {
    type: number;
    stops: ColorStop[];
    angle?: number;
    alpha?: number;
    maxColors?: number;
    replaceColors?: boolean;
};

export type CssOptions = {
    css: string;
    alpha?: number;
    maxColors?: number;
};

const ANGLE_OFFSET = 90; // align degrees with CSS

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
    public static readonly defaults: DefaultOptions = {
        type: ColorGradientFilter.LINEAR,
        stops: [
            { offset: 0.0, color: 0xff0000, alpha: 1.0 },
            { offset: 1.0, color: 0x0000ff, alpha: 1.0 },
        ],
        alpha: 1.0,
        angle: 90.0,
        maxColors: 0,
        replaceColors: false,
    };

    private _stops: ColorStop[] = [];

    /**
   * @param {DefaultOptions | CssOptions} [options]
   * @param {number} [options.alpha=1.0] - Alpha value
   * @param {number} [options.maxColors=0] - Maximum number of colors to render (0 = disabled)
   */
    constructor(options?: DefaultOptions | CssOptions)
    {
        let options_;

        if (options && 'css' in options)
        {
            options_ = {
                ...parseCssGradient(options.css || ''),
                alpha: options.alpha ?? ColorGradientFilter.defaults.alpha,
                maxColors: options.maxColors ?? ColorGradientFilter.defaults.maxColors,
            };
        }
        else
        {
            options_ = { ...ColorGradientFilter.defaults, ...options };
        }

        if (!options_.stops || options_.stops.length < 2)
        {
            throw new Error('ColorGradientFilter requires at least 2 color stops.');
        }

        super(vertex, fragment);
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
            const color = colorToNormalizedRgba(sortedStops[i].color);
            const indexStart = i * 3;

            colors[indexStart + R] = color[R];
            colors[indexStart + G] = color[G];
            colors[indexStart + B] = color[B];
        }

        this.uniforms.uColors = colors;
        this.uniforms.uOffsets = sortedStops.map((s) => s.offset);
        this.uniforms.uAlphas = sortedStops.map((s) => s.alpha);
        this.uniforms.uNumStops = sortedStops.length;
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
   * The angle of the gradient in degrees
   * @default 90
   */
    set angle(value: number)
    {
        this.uniforms.uAngle = value - ANGLE_OFFSET;
    }

    get angle(): number
    {
        return this.uniforms.uAngle + ANGLE_OFFSET;
    }

    /**
   * The alpha value of the gradient (0-1)
   * @default 1
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
   * The maximum number of colors to render (0 = no limit)
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

    /**
     * If true, the gradient will replace the existing color, otherwise it
     * will be multiplied with it
     * @default false
     */
    set replaceColors(value: boolean)
    {
        this.uniforms.uReplaceColors = value;
    }

    get replaceColors(): boolean
    {
        return this.uniforms.uReplaceColors;
    }
}

export { ColorGradientFilter };

