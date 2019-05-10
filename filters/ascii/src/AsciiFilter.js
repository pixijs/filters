import {vertex} from '@tools/fragments';
import fragment from './ascii.frag';
import {Filter} from '@pixi/core';

// TODO (cengler) - The Y is flipped in this shader for some reason.

/**
 * @author Vico @vicocotea
 * original shader : https://www.shadertoy.com/view/lssGDj by @movAX13h
 */

/**
 * An ASCII filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/ascii.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-ascii|@pixi/filter-ascii}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 * @param {number} [size=8] Size of the font
 */
class AsciiFilter extends Filter {

    constructor(size = 8) {
        super(vertex, fragment);
        this.size = size;
    }

    /**
     * The pixel size used by the filter.
     *
     * @member {number}
     */
    get size() {
        return this.uniforms.pixelSize;
    }
    set size(value) {
        this.uniforms.pixelSize = value;
    }
}

export { AsciiFilter };

