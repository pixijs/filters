import { vertex } from '@tools/fragments';
import fragment from './colorOverlay.frag';
import { Filter } from '@pixi/core';
import { hex2rgb, rgb2hex } from '@pixi/utils';

type Color = number | number[] | Float32Array;

/**
 * Replace all colors within a source graphic with a single color.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/color-overlay.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-color-replace|@pixi/filter-color-replace}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 *
 * @example
 *  // replaces red with blue
 *  someSprite.filters = [new ColorOverlayFilter(
 *   [1, 0, 0],
 *   [0, 0, 1],
 *   0.001
 *   )];
 *
 */
class ColorOverlayFilter extends Filter
{
    private _color = 0x0;
    private _alpha = 1;

    /**
     * @param {number|Array<number>} [color=0x000000] - The resulting color, as a 3 component RGB e.g. [1.0, 0.5, 1.0]
     * @param {number} [alpha=1] - The alpha value of the color
     */
    constructor(color: Color = 0x000000, alpha = 1)
    {
        super(vertex, fragment);
        this.uniforms.color = new Float32Array(3);
        this.color = color;
        this.alpha = alpha;
    }

    /**
     * The resulting color, as a 3 component RGB e.g. [1.0, 0.5, 1.0]
     * @member {number|Array<number>|Float32Array}
     * @default 0x000000
     */
    set color(value: Color)
    {
        const arr = this.uniforms.color;

        if (typeof value === 'number')
        {
            hex2rgb(value, arr);
            this._color = value;
        }
        else
        {
            arr[0] = value[0];
            arr[1] = value[1];
            arr[2] = value[2];
            this._color = rgb2hex(arr);
        }
    }
    get color(): Color
    {
        return this._color;
    }

    /**
     * The alpha value of the color
     * @member {number}
     * @default 0
     */
    set alpha(value: number)
    {
        this.uniforms.alpha = value;
        this._alpha = value;
    }
    get alpha(): number
    {
        return this._alpha;
    }
}

export { ColorOverlayFilter };
