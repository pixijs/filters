import {vertex} from '@tools/fragments';
import fragment from './reflection.frag';
import * as PIXI from 'pixi.js';

/**
 * Applies a reflection effect to simulate the reflection on water with waves.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/reflection.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 *
 * @param {object} [options] - The optional parameters of Reflection effect.
 * @param {number} [options.mirror=true] - `true` to reflect the image, `false` for waves-only
 * @param {number} [options.boundary=0.5] - Vertical position of the reflection point, default is 50% (middle)
 *                 smaller numbers produce a larger reflection, larger numbers produce a smaller reflection.
 * @param {number} [options.amplitude=[0, 20]] - Starting and ending amplitude of waves
 * @param {number} [options.waveLength=[30, 100]] - Starting and ending length of waves
 * @param {number} [options.alpha=[1, 1]] - Starting and ending alpha values
 * @param {number} [options.time=0] - Time for animating position of waves
 */
export default class ReflectionFilter extends PIXI.Filter {
    constructor(options) {
        super(vertex, fragment);
        this.uniforms.amplitude = new Float32Array(2);
        this.uniforms.waveLength = new Float32Array(2);
        this.uniforms.alpha = new Float32Array(2);
        this.uniforms.dimensions = new Float32Array(2);

        Object.assign(this, {
            mirror: true,
            boundary: 0.5,
            amplitude: [0, 20],
            waveLength: [30, 100],
            alpha: [1, 1],

            /**
             * Time for animating position of waves
             *
             * @member {number}
             * @memberof PIXI.filters.ReflectionFilter#
             * @default 0
             */
            time: 0,
        }, options);
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        this.uniforms.dimensions[0] = input.sourceFrame.width;
        this.uniforms.dimensions[1] = input.sourceFrame.height;

        this.uniforms.time = this.time;

        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * `true` to reflect the image, `false` for waves-only
     *
     * @member {boolean}
     * @default true
     */
    set mirror(value) {
        this.uniforms.mirror = value;
    }
    get mirror() {
        return this.uniforms.mirror;
    }

    /**
     * Vertical position of the reflection point, default is 50% (middle)
     * smaller numbers produce a larger reflection, larger numbers produce a smaller reflection.
     *
     * @member {number}
     * @default 0.5
     */
    set boundary(value) {
        this.uniforms.boundary = value;
    }
    get boundary() {
        return this.uniforms.boundary;
    }

    /**
     * Starting and ending amplitude of waves
     * @member {number[]}
     * @default [0, 20]
     */
    set amplitude(value) {
        this.uniforms.amplitude[0] = value[0];
        this.uniforms.amplitude[1] = value[1];
    }
    get amplitude() {
        return this.uniforms.amplitude;
    }

    /**
     * Starting and ending length of waves
     * @member {number[]}
     * @default [30, 100]
     */
    set waveLength(value) {
        this.uniforms.waveLength[0] = value[0];
        this.uniforms.waveLength[1] = value[1];
    }
    get waveLength() {
        return this.uniforms.waveLength;
    }

    /**
     * Starting and ending alpha values
     * @member {number[]}
     * @default [1, 1]
     */
    set alpha(value) {
        this.uniforms.alpha[0] = value[0];
        this.uniforms.alpha[1] = value[1];
    }
    get alpha() {
        return this.uniforms.alpha;
    }
}
