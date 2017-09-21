import {vertex} from '@tools/fragments';
import godray from './godray.frag';
import perlin from './perlin.frag';
import main from './main.frag';

/**
* GordayFilter, originally by Alain Galvan
* https://codepen.io/alaingalvan
*
* TODO: This filter requires more work on extracting parameters from shader into constructor
*
* ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/godray.gif)
* @class
* @extends PIXI.Filter
* @memberof PIXI.filters
*
* @example
*  displayObject.filters = [new GodrayFilter()];
*/
export default class GodrayFilter extends PIXI.Filter {

    constructor() {
        super(vertex, main
            .replace("$perlin", perlin)
            .replace("$godray", godray)
        );

        this.time = 0;
    }

    /**
     * Applies the filter.
     * @private
     * @param {PIXI.FilterManager} filterManager - The manager.
     * @param {PIXI.RenderTarget} input - The input target.
     * @param {PIXI.RenderTarget} output - The output target.
     */
    apply(filterManager, input, output, clear) {
        this.uniforms.dimensions[0] = input.sourceFrame.width;
        this.uniforms.dimensions[1] = input.sourceFrame.height;

        // draw the filter...
        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * The current time.
     *
     * @member {number}
     */
    get time() {
        return this.uniforms.time;
    }
    set time(value) {
        this.uniforms.time = value;
    }
}

// Export to PixiJS namespace
PIXI.filters.GodrayFilter = GodrayFilter;

