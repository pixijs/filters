import { vertex } from '@tools/fragments';
import fragment from './ascii.frag';
import { Filter } from '@pixi/core';

// TODO (cengler) - The Y is flipped in this shader for some reason.

// @author Vico @vicocotea
// original shader : https://www.shadertoy.com/view/lssGDj by @movAX13h

/**
 * An ASCII filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/ascii.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-ascii|@pixi/filter-ascii}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
class AsciiFilter extends Filter
{
    /**
     * @param {number} [size=8] - Size of the font
     */
    constructor(size = 8)
    {
        super(vertex, fragment);
        this.size = size;
    }

    /**
     * The pixel size used by the filter.
     */
    get size(): number
    {
        return this.uniforms.pixelSize;
    }
    set size(value: number)
    {
        this.uniforms.pixelSize = value;
    }
}

export { AsciiFilter };

