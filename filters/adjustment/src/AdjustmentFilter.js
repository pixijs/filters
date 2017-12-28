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
 * @param {object|number} [options] - The optional parameters of old film effect.
 *                        When options is a number , it will be `seed`
 * @param {number} [options.sepia=0.3] - The amount of saturation of sepia effect,
 *        a value of `1` is more saturation and closer to `0` is less, and a value of
 *        `0` produces no sepia effect
 * @param {number} [options.noise=0.3] - Opacity/intensity of the noise effect between `0` and `1`
 * @param {number} [options.noiseSize=1.0] - The size of the noise particles
 * @param {number} [options.scratch=0.5] - How often scratches appear
 * @param {number} [options.scratchDensity=0.3] - The density of the number of scratches
 * @param {number} [options.scratchWidth=1.0] - The width of the scratches
 * @param {number} [options.vignetting=0.3] - The radius of the vignette effect, smaller
 *        values produces a smaller vignette
 * @param {number} [options.vignettingAlpha=1.0] - Amount of opacity of vignette
 * @param {number} [options.vignettingBlur=0.3] - Blur intensity of the vignette
 * @param {number} [seed=0] - A see value to apply to the random noise generation
 */
export default class AdjustmentFilter extends PIXI.Filter {
    constructor(options) {
        super(vertex, fragment);

        Object.assign(this, {
            gamma: 1,
            saturation: 1,
            contrast: 1,
            brightness: 1,
            red: 1,
            green: 1,
            blue: 1,
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
