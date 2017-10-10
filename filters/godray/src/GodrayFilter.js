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

        this.lacunarity = 2.0;
        this.gain = 0.5;
        this.angle = 30;
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

    /**
     * The angle of the rays in degrees. For instance, a value of 0 is vertical rays, 
     * values of 90 or -90 produce horizontal rays. 
     *
     * @member {number}
     * @default 30
     */
    get angle() {
        return this.uniforms.angle;
    }
    set angle(value) {
        this.uniforms.angle = value;
    }

    /**
     * Generally intense the effect is. A value closer to 1 will produce a more intense effect,
     * where a value closer to 0 will produce a subtler effect.
     *
     * @member {number}
     * @default 0.5
     */
    get gain() {
        return this.uniforms.gain;
    }
    set gain(value) {
        this.uniforms.gain = value;
    }

    /**
     * The density of the fractal noise. A higher amount produces more rays and a smaller amound
     * produces fewer waves.
     *
     * @member {number}
     * @default 2.0
     */
    get lacunarity() {
        return this.uniforms.lacunarity;
    }
    set lacunarity(value) {
        this.uniforms.lacunarity = value;
    }
}

// Export to PixiJS namespace
PIXI.filters.GodrayFilter = GodrayFilter;

