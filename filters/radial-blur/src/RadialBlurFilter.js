import {vertex} from '@tools/fragments';
import fragment from './radial-blur.frag';
import * as PIXI from 'pixi.js';

/**
 * The RadialBlurFilter applies a Motion blur to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/radial-blur.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [angle=0] Sets the angle of the motion for blur effect.
 * @param {PIXI.Point|number[]} [center=[0,0]] The center of the radial.
 * @param {number} [kernelSize=5] - The kernelSize of the blur filter. But be odd number >= 3
 * @param {number} [radius=-1] - The maximum size of the blur radius, `-1` is infinite
 */
export default class RadialBlurFilter extends PIXI.Filter {
    constructor(angle = 0, center = [0, 0], kernelSize = 5, radius = -1) {
        super(vertex, fragment);

        this._angle = 0;
        this.angle = angle;
        this.center = center;
        this.kernelSize = kernelSize;
        this.radius = radius;
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        this.uniforms.uKernelSize = this._angle !== 0 ? this.kernelSize : 0;
        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * Sets the angle in degrees of the motion for blur effect.
     *
     * @member {PIXI.Point|number[]}
     * @default [0, 0]
     */
    set angle(value) {
        this._angle = value;
        this.uniforms.uRadian = value * Math.PI / 180;
    }

    get angle() {
        return this._angle;
    }

    /**
     * Center of the effect.
     *
     * @member {PIXI.Point|number[]}
     * @default [0, 0]
     */
    get center() {
        return this.uniforms.uCenter;
    }

    set center(value) {
        this.uniforms.uCenter = value;
    }

    /**
     * Outer radius of the effect. The default value of `-1` is infinite.
     *
     * @member {number}
     * @default -1
     */
    get radius() {
        return this.uniforms.uRadius;
    }

    set radius(value) {
        if (value < 0 || value === Infinity) {
            value = -1;
        }
        this.uniforms.uRadius = value;
    }
}
