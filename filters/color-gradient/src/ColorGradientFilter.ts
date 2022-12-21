import fragment from './colorGradient.frag';
import vertex from './colorGradient.vert';
import { Filter, utils } from '@pixi/core';

export interface ColorStop
{
    offset: number;
    color: number;
    alpha: number;
}

function sortColorStops(stops: ColorStop[]) : ColorStop[]
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
    private _stops: ColorStop[] = [];

    /**
   * @param {ColorStop[]} [stops] - Color stops of the gradient
   * @param {number} [alpha=1.0] - The alpha value of the gradient
   */
    constructor(stops: ColorStop[], alpha = 1.0)
    {
        super(vertex, fragment.replace(/%numStops%/g, stops.length.toString()));

        this.uniforms.alpha = alpha;
        this.stops = stops;
    }

    get stops() : ColorStop[]
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
            const color = utils.hex2rgb(sortedStops[i].color);
            const indexStart = i * 3;

            colors[indexStart + R] = color[R];
            colors[indexStart + G] = color[G];
            colors[indexStart + B] = color[B];
        }

        this.uniforms.colors = colors;
        this.uniforms.offsets = sortedStops.map((s) => s.offset);
        this.uniforms.alphas = sortedStops.map((s) => s.alpha);
        this._stops = sortedStops;
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
