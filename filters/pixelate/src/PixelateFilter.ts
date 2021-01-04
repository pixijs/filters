import { vertex } from '@tools/fragments';
import fragment from './pixelate.frag';
import { Filter } from '@pixi/core';
import type { Point } from '@pixi/math';

type Size = number | number[] | Point;

/**
 * This filter applies a pixelate effect making display objects appear 'blocky'.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/pixelate.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-pixelate|@pixi/filter-pixelate}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
class PixelateFilter extends Filter
{
    /**
     * @param {PIXI.Point|Array<number>|number} [size=10] - Either the width/height of the size of the pixels, or square size
     */
    constructor(size: Size = 10)
    {
        super(vertex, fragment);
        this.size = size;
    }

    /**
     * This a point that describes the size of the blocks.
     * x is the width of the block and y is the height.
     *
     * @member {PIXI.Point|Array<number>|number}
     * @default 10
     */
    get size(): Size
    {
        return this.uniforms.size;
    }
    set size(value: Size)
    {
        if (typeof value === 'number')
        {
            value = [value, value];
        }
        this.uniforms.size = value;
    }
}

export { PixelateFilter };
