import {vertex} from '@tools/fragments';
import fragment from './crosshatch.frag';
import {Filter} from '@pixi/core';

/**
 * A Cross Hatch effect filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/cross-hatch.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-cross-hatch|@pixi/filter-cross-hatch}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
class CrossHatchFilter extends Filter {
    constructor() {
        super(vertex, fragment);
    }
}

export { CrossHatchFilter };
