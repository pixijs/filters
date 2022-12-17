import { Filter } from '@pixi/core';
import { vertex } from '@tools/fragments';
import fragment from './grayscale.frag';

/**
 * This filter applies a grayscale effect.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/grayscale.png)
 *
 * @class
 * @extends PIXI.Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-grayscale|@pixi/filter-grayscale}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
class GrayscaleFilter extends Filter
{
    constructor()
    {
        super(vertex, fragment);
    }
}

export { GrayscaleFilter };
