import {vertex} from '@tools/fragments';
import fragment from './crosshatch.frag';

/**
 * A Cross Hatch effect filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/cross-hatch.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 */
export default class CrossHatchFilter extends PIXI.Filter {
    constructor() {
        super(vertex, fragment);
    }
}

// Export to PixiJS namespace
PIXI.filters.CrossHatchFilter = CrossHatchFilter;
