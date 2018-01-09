import {vertex} from '@tools/fragments';
import fragment from './adjustment.frag';
import * as PIXI from 'pixi.js';

/**
 * The ability to adjust gamma, contrast, saturation, brightness, alpha or color-channel shift. This is a faster
 * and much simpler to use than {@link http://pixijs.download/release/docs/PIXI.filters.ColorMatrixFilter.html ColorMatrixFilter}
 * because it does not use a matrix.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/adjustment.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 *
 * @param {object|number} [options] - The optional parameters of the filter.
 * @param {number} [options.gamma=1] - The amount of luminance
 * @param {number} [options.saturation=1] - The amount of color saturation
 * @param {number} [options.contrast=1] - The amount of contrast
 * @param {number} [options.brightness=1] - The overall brightness
 * @param {number} [options.red=1] - The multipled red channel
 * @param {number} [options.green=1] - The multipled green channel
 * @param {number} [options.blue=1] - The multipled blue channel
 * @param {number} [options.alpha=1] - The overall alpha amount
 */
export default class AdjustmentFilter extends PIXI.Filter {
    constructor(options) {
        super(vertex, fragment);

        Object.assign(this, {
            /**
             * The amount of luminance
             * @member {number}
             * @memberof PIXI.filters.AdjustmentFilter#
             * @default 1
             */
            gamma: 1,

            /**
             * The amount of saturation
             * @member {number}
             * @memberof PIXI.filters.AdjustmentFilter#
             * @default 1
             */
            saturation: 1,

            /**
             * The amount of contrast
             * @member {number}
             * @memberof PIXI.filters.AdjustmentFilter#
             * @default 1
             */
            contrast: 1,

            /**
             * The amount of brightness
             * @member {number}
             * @memberof PIXI.filters.AdjustmentFilter#
             * @default 1
             */
            brightness: 1,

            /**
             * The amount of red channel
             * @member {number}
             * @memberof PIXI.filters.AdjustmentFilter#
             * @default 1
             */
            red: 1,

            /**
             * The amount of green channel
             * @member {number}
             * @memberof PIXI.filters.AdjustmentFilter#
             * @default 1
             */
            green: 1,

            /**
             * The amount of blue channel
             * @member {number}
             * @memberof PIXI.filters.AdjustmentFilter#
             * @default 1
             */
            blue: 1,

            /**
             * The amount of alpha channel
             * @member {number}
             * @memberof PIXI.filters.AdjustmentFilter#
             * @default 1
             */
            alpha: 1,
        }, options);
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        this.uniforms.gamma = Math.max(this.gamma, 0.0001);
        this.uniforms.saturation = this.saturation;
        this.uniforms.contrast = this.contrast;
        this.uniforms.brightness = this.brightness;
        this.uniforms.red = this.red;
        this.uniforms.green = this.green;
        this.uniforms.blue = this.blue;
        this.uniforms.alpha = this.alpha;

        filterManager.applyFilter(this, input, output, clear);
    }
}
