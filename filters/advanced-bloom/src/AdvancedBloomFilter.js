import ExtractBrightnessFilter from './ExtractBrightnessFilter';
import {KawaseBlurFilter} from '@pixi/filter-kawase-blur';
import {vertex} from '@tools/fragments';
import fragment from './advanced-bloom.frag';
import * as PIXI from 'pixi.js';

/**
 * The AdvancedBloomFilter applies a Bloom Effect to an object. Unlike the normal BloomFilter
 * this had some advanced controls for adjusting the look of the bloom. Note: this filter
 * is slower than normal BloomFilter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/advanced-bloom.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
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
 * @param {number} [options.resolution=PIXI.settings.RESOLUTION] - The resolution of the Blur filter.
 */
export default class AdvancedBloomFilter extends PIXI.Filter {

    constructor(options) {

        super(vertex, fragment);

        if (typeof options === 'number') {
            options = { threshold: options };
        }

        options = Object.assign({
            threshold: 0.5,
            bloomScale: 1.0,
            brightness: 1.0,
            kernels: null,
            blur: 8,
            quality: 4,
            pixelSize: 1,
            resolution: PIXI.settings.RESOLUTION,
        }, options);

        /**
         * To adjust the strength of the bloom. Higher values is more intense brightness.
         *
         * @member {number}
         * @default 1.0
         */
        this.bloomScale = options.bloomScale;

        /**
         * The brightness, lower value is more subtle brightness, higher value is blown-out.
         *
         * @member {number}
         * @default 1.0
         */
        this.brightness = options.brightness;

        const { kernels, blur, quality, pixelSize, resolution } = options;

        this._extractFilter = new ExtractBrightnessFilter(options.threshold);
        this._extractFilter.resolution = resolution;
        this._blurFilter = kernels ?
            new KawaseBlurFilter(kernels) :
            new KawaseBlurFilter(blur, quality);
        this.pixelSize = pixelSize;
        this.resolution = resolution;
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear, currentState) {

        const brightTarget = filterManager.getRenderTarget(true);

        this._extractFilter.apply(filterManager, input, brightTarget, true, currentState);

        const bloomTarget = filterManager.getRenderTarget(true);

        this._blurFilter.apply(filterManager, brightTarget, bloomTarget, true, currentState);

        this.uniforms.bloomScale = this.bloomScale;
        this.uniforms.brightness = this.brightness;
        this.uniforms.bloomTexture = bloomTarget;

        filterManager.applyFilter(this, input, output, clear);

        filterManager.returnRenderTarget(bloomTarget);
        filterManager.returnRenderTarget(brightTarget);
    }

    /**
     * The resolution of the filter.
     *
     * @member {number}
     */
    get resolution() {
        return this._resolution;
    }
    set resolution(value) {
        this._resolution = value;

        if (this._extractFilter) {
            this._extractFilter.resolution = value;
        }
        if (this._blurFilter) {
            this._blurFilter.resolution = value;
        }
    }

    /**
     * Defines how bright a color needs to be to affect bloom.
     *
     * @member {number}
     * @default 0.5
     */
    get threshold() {
        return this._extractFilter.threshold;
    }
    set threshold(value) {
        this._extractFilter.threshold = value;
    }

    /**
     * Sets the kernels of the Blur Filter
     *
     * @member {number}
     * @default 4
     */
    get kernels() {
        return this._blurFilter.kernels;
    }
    set kernels(value) {
        this._blurFilter.kernels = value;
    }

    /**
     * Sets the strength of the Blur properties simultaneously
     *
     * @member {number}
     * @default 2
     */
    get blur() {
        return this._blurFilter.blur;
    }
    set blur(value) {
        this._blurFilter.blur = value;
    }

    /**
     * Sets the quality of the Blur Filter
     *
     * @member {number}
     * @default 4
     */
    get quality() {
        return this._blurFilter.quality;
    }
    set quality(value) {
        this._blurFilter.quality = value;
    }

    /**
     * Sets the pixelSize of the Kawase Blur filter
     *
     * @member {number|number[]|PIXI.Point}
     * @default 1
     */
    get pixelSize() {
        return this._blurFilter.pixelSize;
    }
    set pixelSize(value) {
        this._blurFilter.pixelSize = value;
    }
}
