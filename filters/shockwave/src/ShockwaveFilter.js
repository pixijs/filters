import {vertex} from '@tools/fragments';
import fragment from './shockwave.frag';
import * as PIXI from 'pixi.js';

/**
 * The ShockwaveFilter class lets you apply a shockwave effect.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/shockwave.gif)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 *
 * @param {PIXI.Point|number[]} [center=[0.5, 0.5]] See `center` property.
 * @param {object} [options] - The optional parameters of shockwave filter.
 * @param {number} [options.amplitude=0.5] - See `amplitude`` property.
 * @param {number} [options.wavelength=1.0] - See `wavelength` property.
 * @param {number} [options.speed=500.0] - See `speed` property.
 * @param {number} [options.brightness=8] - See `brightness` property.
 * @param {number} [options.radius=4] - See `radius` property.
 * @param {number} [time=0] - See `time` property.
 */
export default class ShockwaveFilter extends PIXI.Filter {

    constructor(center = [0.0, 0.0], options = {}, time = 0) {
        super(vertex, fragment);

        this.center = center;

        if (Array.isArray(options)) {
            // eslint-disable-next-line no-console
            console.warn('Deprecated Warning: ShockwaveFilter params Array has been changed to options Object.');
            options = {};
        }

        options = Object.assign({
            amplitude: 30.0,
            wavelength: 160.0,
            brightness: 1.0,
            speed: 500.0,
            radius: -1.0,
        }, options);

        this.amplitude = options.amplitude;

        this.wavelength = options.wavelength;

        this.brightness = options.brightness;

        this.speed = options.speed;

        this.radius = options.radius;

        /**
         * Sets the elapsed time of the shockwave.
         * It could control the current size of shockwave.
         *
         * @member {number}
         */
        this.time = time;
    }

    apply(filterManager, input, output, clear) {
        /**
         * There is no set/get of `time`, for performance.
         * Because in the most real cases, `time` will be changed in ever game tick.
         * Use set/get will take more function-call.
         */
        this.uniforms.time = this.time;

        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * Sets the center of the shockwave in normalized screen coords. That is
     * (0,0) is the top-left and (1,1) is the bottom right.
     *
     * @member {PIXI.Point|number[]}
     */
    get center() {
        return this.uniforms.center;
    }
    set center(value) {
        this.uniforms.center = value;
    }

    /**
     * The amplitude of the shockwave.
     *
     * @member {number}
     */
    get amplitude() {
        return this.uniforms.amplitude;
    }
    set amplitude(value) {
        this.uniforms.amplitude = value;
    }

    /**
     * The wavelength of the shockwave.
     *
     * @member {number}
     */
    get wavelength() {
        return this.uniforms.wavelength;
    }
    set wavelength(value) {
        this.uniforms.wavelength = value;
    }

    /**
     * The brightness of the shockwave.
     *
     * @member {number}
     */
    get brightness() {
        return this.uniforms.brightness;
    }
    set brightness(value) {
        this.uniforms.brightness = value;
    }

    /**
     * The speed about the shockwave ripples out.
     * The unit is `pixel/second`
     *
     * @member {number}
     */
    get speed() {
        return this.uniforms.speed;
    }
    set speed(value) {
        this.uniforms.speed = value;
    }

    /**
     * The maximum radius of shockwave.
     * `< 0.0` means it's infinity.
     *
     * @member {number}
     */
    get radius() {
        return this.uniforms.radius;
    }
    set radius(value) {
        this.uniforms.radius = value;
    }
}

