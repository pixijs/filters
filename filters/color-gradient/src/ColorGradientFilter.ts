import fragment from './colorGradient.frag';
import vertex from './colorGradient.vert';
import { Filter, utils } from '@pixi/core';

export interface GradientStop
{
    offset: number;
    color: number;
    alpha: number;
}

// const testStops: GradientStop[] = [
//     { offset: 0.0, color: 0xff0000, alpha: 1.0, },
//     { offset: 0.5, color: 0x000000, alpha: 0.0, },
//     { offset: 1.0, color: 0xff0000, alpha: 1.0, },
// ];

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
    private _stops: GradientStop[] = [];

    /**
   * @param {GradientStop[]} [stops] - Color stops of the gradient
   * @param {number} [alpha=1.0] - The alpha value of the gradient
   */
    constructor(stops: GradientStop[], alpha = 1.0)
    {
        super(vertex, fragment.replace(/%numStops%/g, stops.length.toString()));

        this.uniforms.alpha = alpha;
        this.stops = stops;
    }

    get stops() : GradientStop[]
    {
        return this._stops;
    }

    set stops(stops: GradientStop[])
    {
        const colors = new Float32Array(stops.length * 3);
        const R = 0;
        const G = 1;
        const B = 2;

        for (let i = 0; i < stops.length; i++)
        {
            const color = utils.hex2rgb(stops[i].color);
            const indexStart = i * 3;

            colors[indexStart + R] = color[R];
            colors[indexStart + G] = color[G];
            colors[indexStart + B] = color[B];
        }

        this.uniforms.colors = colors;
        this.uniforms.offsets = stops.map((s) => s.offset);
        this.uniforms.alphas = stops.map((s) => s.alpha);
        this._stops = stops;
    }

    /**
   * The alpha value of the gradient
   * @default 0
   */
    set alpha(value: number)
    {
        this.uniforms.alpha = value;
    }

    get alpha(): number
    {
        return this.uniforms.alpha;
    }
}

export { ColorGradientFilter };
