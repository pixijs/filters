import {vertex} from '@tools/fragments';
import fragment from './adjustment.frag';

/**
 * The AdjustmentFilter to adjust gamma/contrast/saturation/brightness.
.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/adjustment.gif)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 *
 * @param {object|number} [options] - The optional parameters of the filter.
 * @param {number} [options.gamma=1] - TODO
 * @param {number} [options.saturation=1] - TODO
 * @param {number} [options.contrast=1] - TODO
 * @param {number} [options.brightness=1] - TODO
 * @param {number} [options.red=1] - TODO
 * @param {number} [options.green=1] - TODO
 * @param {number} [options.blue=1] - TODO
 * @param {number} [options.alpha=1] - TODO
 */
export default class AdjustmentFilter extends PIXI.Filter {
    constructor(options) {
        super(vertex, fragment);

        Object.assign(this, {
            /**
             * The amount of Gamma
             * @member {number} gamma
             * @default 1
             */
            gamma: 1,

            /**
             * The amount of saturation
             * @member {number} saturation
             * @default 1
             */
            saturation: 1,

            /**
             * The amount of contrast
             * @member {number} contrast
             * @default 1
             */
            contrast: 1,

            /**
             * The amount of brightness
             * @member {number} brightness
             * @default 1
             */
            brightness: 1,

            /**
             * The amount of Red Channel
             * @member {number} red
             * @default 1
             */
            red: 1,

            /**
             * The amount of Green Channel
             * @member {number} green
             * @default 1
             */
            green: 1,

            /**
             * The amount of Blue Channel
             * @member {number} blue
             * @default 1
             */
            blue: 1,

            /**
             * The amount of Alpha Channel
             * @member {number} alpha
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

// Export to PixiJS namespace
PIXI.filters.AdjustmentFilter = AdjustmentFilter;
