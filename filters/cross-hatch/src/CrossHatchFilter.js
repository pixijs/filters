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
 */
export class CrossHatchFilter extends Filter {
    constructor() {
        super(vertex, fragment);
    }
}
