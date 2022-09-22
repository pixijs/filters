import { vertex } from '@tools/fragments';
import fragment from './adjustment.frag';
import { Filter } from '@pixi/core';
import type { FilterSystem, RenderTexture, CLEAR_MODES } from '@pixi/core';

interface AdjustmentFilterOptions {
    gamma: number;
    saturation: number;
    contrast: number;
    brightness: number;
    red: number;
    green: number;
    blue: number;
    alpha: number;
}

/**
 * The ability to adjust gamma, contrast, saturation, brightness, alpha or color-channel shift.
 * This is a faster and much simpler to use than
 * {@link http://pixijs.download/release/docs/PIXI.filters.ColorMatrixFilter.html ColorMatrixFilter}
 * because it does not use a matrix.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/adjustment.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-adjustment|@pixi/filter-adjustment}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
class AdjustmentFilter extends Filter
{
    /** The amount of luminance */
    public gamma = 1;

    /** The amount of saturation */
    public saturation = 1;

    /** The amount of contrast */
    public contrast = 1;

    /** The amount of brightness */
    public brightness = 1;

    /** The amount of red channel */
    public red = 1;

    /** The amount of green channel */
    public green = 1;

    /** The amount of blue channel */
    public blue = 1;

    /** The amount of alpha channel */
    public alpha = 1;

    /**
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
    constructor(options?: Partial<AdjustmentFilterOptions>)
    {
        super(vertex, fragment);

        Object.assign(this, options);
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @ignore
     */
    apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clear: CLEAR_MODES): void
    {
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

export { AdjustmentFilter };
export type { AdjustmentFilterOptions };
