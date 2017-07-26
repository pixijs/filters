import {vertex} from '@tools/fragments';
import fragment from './crosshatch.frag';

/**
 * A Cross Hatch effect filter.
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
