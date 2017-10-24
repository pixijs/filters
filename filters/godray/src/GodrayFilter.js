import {vertex} from '@tools/fragments';
import perlin from './perlin.frag';
import main from './main.frag';

/**
* GordayFilter, {@link https://codepen.io/alaingalvan originally} by Alain Galvan
*
*
*
* ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/godray.gif)
* @class
* @extends PIXI.Filter
* @memberof PIXI.filters
*
* @example
*  displayObject.filters = [new GodrayFilter()];
* @param {number} [angle=30] Angle of the rays.
* @param {number} [gain=0.5] General intensity of the effect.
* @param {number} [lacunrity=2.5] The density of the fractal noise.
* @param {number} [time=0] The current time position.
*/
export default class GodrayFilter extends PIXI.Filter {

    constructor(angle = 30, gain = 0.5, lacunarity = 2.5, time = 0) {
        super(vertex, main.replace('$perlin', perlin));

        /**
         * The angle of the rays in degrees. For instance, a value of 0 is vertical rays,
         * values of 90 or -90 produce horizontal rays.
         *
         * @member {number}
         * @default 30
         */
        this.angle = angle;

        this.gain = gain;
        this.lacunarity = lacunarity;
        this.time = time;
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
        const radians = this.angle * PIXI.DEG_TO_RAD;

        //compensate angle, divide by wh or multiply by hw
        const cos = Math.cos(radians) * input.sourceFrame.width;
        const sin = Math.sin(radians) * input.sourceFrame.height;
        const d = Math.sqrt(cos * cos + sin * sin);
        const dir = this.uniforms.angleDir;
        dir[0] = cos / d;
        dir[1] = sin / d;

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
     * General intensity of the effect. A value closer to 1 will produce a more intense effect,
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
     * @default 2.5
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

