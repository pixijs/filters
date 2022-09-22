import { vertex } from '@tools/fragments';
import fragment from './rgb-split.frag';
import { Filter } from '@pixi/core';
import type { Point } from '@pixi/core';

type Offset = [number, number] | Point;

/**
 * An RGB Split Filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/rgb.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-rgb-split|@pixi/filter-rgb-split}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
class RGBSplitFilter extends Filter
{
    /**
     * @param {PIXI.Point | number[]} [red=[-10,0]] - Red channel offset
     * @param {PIXI.Point | number[]} [green=[0, 10]] - Green channel offset
     * @param {PIXI.Point | number[]} [blue=[0, 0]] - Blue channel offset
     */
    constructor(red: Offset = [-10, 0], green: Offset = [0, 10], blue: Offset = [0, 0])
    {
        super(vertex, fragment);
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    /**
     * Red channel offset.
     *
     * @member {PIXI.Point | number[]}
     */
    get red(): Offset
    {
        return this.uniforms.red;
    }
    set red(value: Offset)
    {
        this.uniforms.red = value;
    }

    /**
     * Green channel offset.
     *
     * @member {PIXI.Point | number[]}
     */
    get green(): Offset
    {
        return this.uniforms.green;
    }
    set green(value: Offset)
    {
        this.uniforms.green = value;
    }

    /**
     * Blue offset.
     *
     * @member {PIXI.Point | number[]}
     */
    get blue(): Offset
    {
        return this.uniforms.blue;
    }
    set blue(value: Offset)
    {
        this.uniforms.blue = value;
    }
}

export { RGBSplitFilter };

