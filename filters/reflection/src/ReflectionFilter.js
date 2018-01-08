import {vertex} from '@tools/fragments';
import fragment from './reflection.frag';

/**
 * The ReflectionFilter applies a reflection effect to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/reflection.gif)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 *
 * @param {object} [options] - The optional parameters of Reflection effect.
 * @param {number} [options.mirror=true] - TODO
 * @param {number} [options.boundary=0.5] - TODO
 * @param {number} [options.amplitude=[0, 20]] - TODO
 * @param {number} [options.waveLength=[30, 100]] - TODO
 * @param {number} [options.alpha=[1, 1]] - TODO
 * @param {number} [time=0] - TODO
 */
export default class ReflectionFilter extends PIXI.Filter {
    constructor(options) {
        super(vertex, fragment);

        Object.assign(this, {
            mirror: true,
            boundary: 0.5,
            amplitude: [0, 20],
            waveLength: [30, 100],
            alpha: [1, 1],
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

    set mirror(value) {
        this.uniforms.mirror = value;
    }

    get mirror() {
        return this.uniforms.mirror;
    }

    set boundary(value) {
        this.uniforms.boundary = value;
    }

    get boundary() {
        return this.uniforms.boundary;
    }

    set amplitude(value) {
        this.uniforms.amplitude[0] = value[0];
        this.uniforms.amplitude[1] = value[1];
    }

    get amplitude() {
        return this.uniforms.amplitude;
    }

    set waveLength(value) {
        this.uniforms.waveLength[0] = value[0];
        this.uniforms.waveLength[1] = value[1];
    }

    get waveLength() {
        return this.uniforms.waveLength;
    }

    set alpha(value) {
        this.uniforms.alpha[0] = value[0];
        this.uniforms.alpha[1] = value[1];
    }

    get alpha() {
        return this.uniforms.alpha;
    }

}

// Export to PixiJS namespace
PIXI.filters.ReflectionFilter = ReflectionFilter;
