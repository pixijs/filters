import { ExtractBrightnessFilter } from './ExtractBrightnessFilter';
import { KawaseBlurFilter } from '@pixi/filter-kawase-blur';
import { vertex } from '@tools/fragments';
import fragment from './advanced-bloom.frag';
import { Filter } from '@pixi/core';
import { settings } from '@pixi/settings';
import type { FilterSystem, FilterState, RenderTexture } from '@pixi/core';
import type { CLEAR_MODES } from '@pixi/constants';
import type { PixelSizeValue } from '@pixi/filter-kawase-blur';

interface AdvancedBloomFilterOptions {
    threshold: number,
    bloomScale: number,
    brightness: number,
    kernels: number[],
    blur: number,
    quality: number,
    pixelSize: PixelSizeValue,
    resolution: number,
}

/**
 * The AdvancedBloomFilter applies a Bloom Effect to an object. Unlike the normal BloomFilter
 * this had some advanced controls for adjusting the look of the bloom. Note: this filter
 * is slower than normal BloomFilter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/advanced-bloom.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-advanced-bloom|@pixi/filter-advanced-bloom}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 *
 * @param {object|number} [options] - The optional parameters of advanced bloom filter.
 *                        When options is a number , it will be `options.threshold`.
 * @param {number} [options.threshold=0.5] - Defines how bright a color needs to be to affect bloom.
 * @param {number} [options.bloomScale=1.0] - To adjust the strength of the bloom. Higher values is more intense brightness.
 * @param {number} [options.brightness=1.0] - The brightness, lower value is more subtle brightness, higher value is blown-out.
 * @param {number} [options.blur=8] - Sets the strength of the Blur properties simultaneously
 * @param {number} [options.quality=4] - The quality of the Blur filter.
 * @param {number[]} [options.kernels=null] - The kernels of the Blur filter.
 * @param {number|number[]|PIXI.Point} [options.pixelSize=1] - the pixelSize of the Blur filter.
 * @param {number} [options.resolution=PIXI.settings.FILTER_RESOLUTION] - The resolution of the Blur filter.
 */
class AdvancedBloomFilter extends Filter
{
    /**
     * To adjust the strength of the bloom. Higher values is more intense brightness.
     *
     * @member {number}
     * @default 1.0
     */
    public bloomScale = 1;

    /**
     * The brightness, lower value is more subtle brightness, higher value is blown-out.
     *
     * @member {number}
     * @default 1.0
     */
    public brightness = 1;

    private _extractFilter: ExtractBrightnessFilter;
    private _blurFilter: KawaseBlurFilter;
    private _resolution: number = settings.FILTER_RESOLUTION;

    constructor(options?: Partial<AdvancedBloomFilterOptions>)
    {
        super(vertex, fragment);

        if (typeof options === 'number')
        {
            options = { threshold: options };
        }

        const opt:AdvancedBloomFilterOptions = Object.assign({
            threshold: 0.5,
            bloomScale: 1.0,
            brightness: 1.0,
            kernels: null,
            blur: 8,
            quality: 4,
            pixelSize: 1,
            resolution: settings.FILTER_RESOLUTION,
        }, options);

        this.bloomScale = opt.bloomScale;
        this.brightness = opt.brightness;

        const { kernels, blur, quality, pixelSize, resolution } = opt;

        this._extractFilter = new ExtractBrightnessFilter(opt.threshold);
        this._extractFilter.resolution = resolution;
        this._blurFilter = kernels
            ? new KawaseBlurFilter(kernels)
            : new KawaseBlurFilter(blur, quality);
        this.pixelSize = pixelSize;
        this.resolution = resolution;
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clear?: CLEAR_MODES, currentState?: FilterState): void
    {
        const brightTarget = filterManager.getFilterTexture();

        this._extractFilter.apply(filterManager, input, brightTarget, 1, currentState);

        const bloomTarget = filterManager.getFilterTexture();

        this._blurFilter.apply(filterManager, brightTarget, bloomTarget, 1);

        this.uniforms.bloomScale = this.bloomScale;
        this.uniforms.brightness = this.brightness;
        this.uniforms.bloomTexture = bloomTarget;

        filterManager.applyFilter(this, input, output, clear);

        filterManager.returnFilterTexture(bloomTarget);
        filterManager.returnFilterTexture(brightTarget);
    }

    /**
     * The resolution of the filter.
     *
     * @member {number}
     */
    get resolution(): number
    {
        return this._resolution;
    }
    set resolution(value)
    {
        this._resolution = value;

        if (this._extractFilter)
        {
            this._extractFilter.resolution = value;
        }
        if (this._blurFilter)
        {
            this._blurFilter.resolution = value;
        }
    }

    /**
     * Defines how bright a color needs to be to affect bloom.
     *
     * @member {number}
     * @default 0.5
     */
    get threshold(): number
    {
        return this._extractFilter.threshold;
    }
    set threshold(value: number)
    {
        this._extractFilter.threshold = value;
    }

    /**
     * Sets the kernels of the Blur Filter
     *
     * @member {number[]}
     */
    get kernels(): number[]
    {
        return this._blurFilter.kernels;
    }
    set kernels(value: number[])
    {
        this._blurFilter.kernels = value;
    }

    /**
     * Sets the strength of the Blur properties simultaneously
     *
     * @member {number}
     * @default 2
     */
    get blur(): number
    {
        return this._blurFilter.blur;
    }
    set blur(value: number)
    {
        this._blurFilter.blur = value;
    }

    /**
     * Sets the quality of the Blur Filter
     *
     * @member {number}
     * @default 4
     */
    get quality(): number
    {
        return this._blurFilter.quality;
    }
    set quality(value: number)
    {
        this._blurFilter.quality = value;
    }

    /**
     * Sets the pixelSize of the Kawase Blur filter
     *
     * @member {number|number[]|PIXI.Point}
     * @default 1
     */
    get pixelSize(): PixelSizeValue
    {
        return this._blurFilter.pixelSize;
    }
    set pixelSize(value: PixelSizeValue)
    {
        this._blurFilter.pixelSize = value;
    }
}

export { AdvancedBloomFilter };
export type { AdvancedBloomFilterOptions };
