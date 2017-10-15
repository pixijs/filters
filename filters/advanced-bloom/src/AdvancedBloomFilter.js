const { BlurXFilter, BlurYFilter } = PIXI.filters;

import ExtractBrightnessFilter from './ExtractBrightnessFilter';

import vertex from './advanced-bloom.vert';
import fragment from './advanced-bloom.frag';

/**
 * The AdvancedBloomFilter applies a Bloom Effect to an object.
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/bloom.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [minBright=0.5] TODO
 * @param {number} [brightScale=1.0] TODO
 * @param {number} [toneScale=1.0] TODO
 * @param {number} [blur=8] Sets the strength of both the blurX and blurY properties simultaneously
 * @param {number} [quality=4] The quality of the blurX & blurY filter.
 * @param {number} [resolution=PIXI.settings.RESOLUTION] The resolution of the blurX & blurY filter.
 * @param {number} [kernelSize=5] The kernelSize of the blurX & blurY filter.Options: 5, 7, 9, 11, 13, 15.
 */
export default class AdvancedBloomFilter extends PIXI.Filter
{
    constructor(minBright = 0.5, brightScale = 1.0, toneScale = 1.0,
                blur = 8, quality = 4, resolution = PIXI.settings.RESOLUTION, kernelSize = 5)
    {
        super(
            vertex,
            fragment
        );

        this.brightScale = brightScale;
        this.toneScale = toneScale;

        this.extractBrightnessFilter = new ExtractBrightnessFilter(minBright);
        this.blurXFilter = new BlurXFilter(blur, this.quality, this.resolution, this.kernelSize);
        this.blurYFilter = new BlurYFilter(blur, this.quality, this.resolution, this.kernelSize);
    }

    apply(filterManager, input, output, clear, currentState)
    {
        const brightTarget = filterManager.getRenderTarget(true);

        this.extractBrightnessFilter.apply(filterManager, input, brightTarget, true, currentState);
        this.blurXFilter.apply(filterManager, brightTarget, brightTarget, true, currentState);
        this.blurYFilter.apply(filterManager, brightTarget, brightTarget, true, currentState);

        this.uniforms.brightScale = this.brightScale;
        this.uniforms.toneScale = this.toneScale;
        this.uniforms.bloomTexture = brightTarget;

        filterManager.applyFilter(this, input, output, clear);

        filterManager.returnRenderTarget(brightTarget);
    }

    get minBright()
    {
        return this.extractBrightnessFilter.minBright;
    }

    set minBright(value)
    {
        this.extractBrightnessFilter.minBright = value;
    }

    /**
     * Sets the strength of both the blurX and blurY properties simultaneously
     *
     * @member {number}
     * @default 2
     */
    get blur() {
        return this.blurXFilter.blur;
    }
    set blur(value) {
        this.blurXFilter.blur = this.blurYFilter.blur = value;
    }
}

// Export to PixiJS namespace
PIXI.filters.AdvancedBloomFilter = AdvancedBloomFilter;

