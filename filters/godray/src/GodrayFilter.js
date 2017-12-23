import {vertex} from '@tools/fragments';
import perlin from './perlin.frag';
import fragment from './gorday.frag';

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
* @param {number|PIXI.Point|Array<number>} [light=30] Angle/Light-source of the rays.
* @param {number} [gain=0.5] General intensity of the effect.
* @param {number} [lacunrity=2.5] The density of the fractal noise.
* @param {number} [time=0] The current time position.
*/
export default class GodrayFilter extends PIXI.Filter {

    constructor(light = 30, gain = 0.5, lacunarity = 2.5, time = 0) {
        super(vertex, fragment.replace('${perlin}', perlin));

        this.light = light;

        this.gain = gain;

        this.lacunarity = lacunarity;

        /**
         * The current time.
         *
         * @member {number}
         */
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
        const width = input.sourceFrame.width;
        const height = input.sourceFrame.height;

        this.uniforms.dimensions[0] = width;
        this.uniforms.dimensions[1] = height;
        this.uniforms.aspect = height / width;

        this.uniforms.time = this.time;

        // draw the filter...
        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * The angle/light-source of the rays.
     * If value is number, it means angle in degrees, For instance, a value of 0 is vertical rays,
     *     values of 90 or -90 produce horizontal rays.
     * If value is PIXI.Point/Array, it means light source of rays.
     * @member {number|PIXI.Point|Array<number>}
     * @default 30
     */
    get light() {
        return this._light;
    }
    set light(value) {
        if (typeof value === 'number') {
            this._light = value;

            const radians = value * PIXI.DEG_TO_RAD;

            this._angleCos = Math.cos(radians);
            this._angleSin = Math.sin(radians);

            this.uniforms.light[0] = this._angleCos;
            this.uniforms.light[1] = this._angleSin;
            this.uniforms.parallel = true;
        }
        else if (value instanceof PIXI.Point) {
            this.uniforms.light[0] = value.x;
            this.uniforms.light[1] = value.y;
            this.uniforms.parallel = false;
        }
        else {
            this.uniforms.light[0] = value[0];
            this.uniforms.light[1] = value[1];
            this.uniforms.parallel = false;
        }
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

