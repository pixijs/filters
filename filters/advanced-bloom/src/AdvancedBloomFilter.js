import ExtractBrightnessFilter from './ExtractBrightnessFilter';
import vertex from './advanced-bloom.vert';
import fragment from './advanced-bloom.frag';

/**
 * The AdvancedBloomFilter applies a Bloom Effect to an object. Unlike the normal BloomFilter
 * this had some advanced controls for adjusting the look of the bloom. Note: this filter
 * is slower than normal BloomFilter.
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
 * @param {number} [options.blur=8] - Sets the strength of both the blurX and blurY properties simultaneously
 * @param {number} [options.quality=4] - The quality of the blurX & blurY filter.
 * @param {number} [options.resolution=PIXI.settings.RESOLUTION] - The resolution of the blurX & blurY filter.
 * @param {number} [options.kernelSize=5] - The kernelSize of the blurX & blurY filter.Options: 5, 7, 9, 11, 13, 15.
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
            blur: 8,
            quality: 4,
            resolution: PIXI.settings.RESOLUTION,
            kernelSize: 5
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

        const { blur, quality, resolution, kernelSize } = options;
        const { BlurXFilter, BlurYFilter } = PIXI.filters;

        this._extract = new ExtractBrightnessFilter(options.threshold);
        this._blurX = new BlurXFilter(blur, quality, resolution, kernelSize);
        this._blurY = new BlurYFilter(blur, quality, resolution, kernelSize);
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear, currentState) {

        const brightTarget = filterManager.getRenderTarget(true);

        this._extract.apply(filterManager, input, brightTarget, true, currentState);
        this._blurX.apply(filterManager, brightTarget, brightTarget, true, currentState);
        this._blurY.apply(filterManager, brightTarget, brightTarget, true, currentState);

        this.uniforms.bloomScale = this.bloomScale;
        this.uniforms.brightness = this.brightness;
        this.uniforms.bloomTexture = brightTarget;

        filterManager.applyFilter(this, input, output, clear);

        filterManager.returnRenderTarget(brightTarget);
    }

    /**
     * Defines how bright a color needs to be to affect bloom.
     *
     * @member {number}
     * @default 0.5
     */
    get threshold() {
        return this._extract.threshold;
    }
    set threshold(value) {
        this._extract.threshold = value;
    }

    /**
     * Sets the strength of both the blurX and blurY properties simultaneously
     *
     * @member {number}
     * @default 2
     */
    get blur() {
        return this._blurX.blur;
    }
    set blur(value) {
        this._blurX.blur = this._blurY.blur = value;
    }
}

// Export to PixiJS namespace
PIXI.filters.AdvancedBloomFilter = AdvancedBloomFilter;
