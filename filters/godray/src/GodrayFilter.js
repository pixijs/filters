import {vertex} from '@tools/fragments';
import perlin from './perlin.frag';
import fragment from './gorday.frag';
import * as PIXI from 'pixi.js';

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
* @param {object} [options] Filter options
* @param {number} [options.angle=30] Angle/Light-source of the rays.
* @param {number} [options.gain=0.5] General intensity of the effect.
* @param {number} [options.lacunrity=2.5] The density of the fractal noise.
* @param {boolean} [options.parallel=true] `true` to use `angle`, `false` to use `center`
* @param {number} [options.time=0] The current time position.
* @param {PIXI.Point|number[]} [options.center=[0,0]] Focal point for non-parallel rays,
*        to use this `parallel` must be set to `false`.
*/
export default class GodrayFilter extends PIXI.Filter {

    constructor(options) {
        super(vertex, fragment.replace('${perlin}', perlin));

        this.uniforms.dimensions = new Float32Array(2);

        // Fallback support for ctor: (angle, gain, lacunarity, time)
        if (typeof options === 'number') {
            // eslint-disable-next-line no-console
            console.warn('GodrayFilter now uses options instead of (angle, gain, lacunarity, time)');
            options = { angle: options };
            if (arguments[1] !== undefined) {
                options.gain = arguments[1];
            }
            if (arguments[2] !== undefined) {
                options.lacunarity = arguments[2];
            }
            if (arguments[3] !== undefined) {
                options.time = arguments[3];
            }
        }

        options = Object.assign({
            angle: 30,
            gain: 0.5,
            lacunarity: 2.5,
            time: 0,
            parallel: true,
            center: [0, 0],
        }, options);

        this._angleLight = new PIXI.Point();
        this.angle = options.angle;
        this.gain = options.gain;
        this.lacunarity = options.lacunarity;

        /**
         * `true` if light rays are parallel (uses angle),
         * `false` to use the focal `center` point
         *
         * @member {boolean}
         * @default true
         */
        this.parallel = options.parallel;

        /**
         * The position of the emitting point for light rays
         * only used if `parallel` is set to `false`.
         *
         * @member {PIXI.Point|number[]}
         * @default [0, 0]
         */
        this.center = options.center;

        /**
         * The current time.
         *
         * @member {number}
         * @default 0
         */
        this.time = options.time;
    }

    /**
     * Applies the filter.
     * @private
     * @param {PIXI.FilterManager} filterManager - The manager.
     * @param {PIXI.RenderTarget} input - The input target.
     * @param {PIXI.RenderTarget} output - The output target.
     */
    apply(filterManager, input, output, clear) {
        const {width, height} = input.sourceFrame;

        this.uniforms.light = this.parallel ? this._angleLight : this.center;

        this.uniforms.parallel = this.parallel;
        this.uniforms.dimensions[0] = width;
        this.uniforms.dimensions[1] = height;
        this.uniforms.aspect = height / width;
        this.uniforms.time = this.time;

        // draw the filter...
        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * The angle/light-source of the rays in degrees. For instance, a value of 0 is vertical rays,
     *     values of 90 or -90 produce horizontal rays.
     * @member {number}
     * @default 30
     */
    get angle() {
        return this._angle;
    }
    set angle(value) {
        this._angle = value;

        const radians = value * PIXI.DEG_TO_RAD;

        this._angleLight.x = Math.cos(radians);
        this._angleLight.y = Math.sin(radians);
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

