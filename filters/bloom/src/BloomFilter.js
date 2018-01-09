import * as PIXI from 'pixi.js';

const {BlurXFilter, BlurYFilter, AlphaFilter} = PIXI.filters;

/**
 * The BloomFilter applies a Gaussian blur to an object.
 * The strength of the blur can be set for x- and y-axis separately.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/bloom.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number|PIXI.Point|number[]} [blur=2] Sets the strength of both the blurX and blurY properties simultaneously
 * @param {number} [quality=4] The quality of the blurX & blurY filter.
 * @param {number} [resolution=PIXI.settings.RESOLUTION] The resolution of the blurX & blurY filter.
 * @param {number} [kernelSize=5] The kernelSize of the blurX & blurY filter.Options: 5, 7, 9, 11, 13, 15.
 */
export default class BloomFilter extends PIXI.Filter {

    constructor(blur = 2, quality = 4, resolution = PIXI.settings.RESOLUTION, kernelSize = 5) {
        super();

        let blurX;
        let blurY;

        if (typeof blur === 'number') {
            blurX = blur;
            blurY = blur;
        }
        else if (blur instanceof PIXI.Point) {
            blurX = blur.x;
            blurY = blur.y;
        }
        else if (Array.isArray(blur)) {
            blurX = blur[0];
            blurY = blur[1];
        }

        this.blurXFilter = new BlurXFilter(blurX, quality, resolution, kernelSize);
        this.blurYFilter = new BlurYFilter(blurY, quality, resolution, kernelSize);
        this.blurYFilter.blendMode = PIXI.BLEND_MODES.SCREEN;
        this.defaultFilter = new AlphaFilter();
    }

    apply(filterManager, input, output) {
        const renderTarget = filterManager.getRenderTarget(true);

        //TODO - copyTexSubImage2D could be used here?
        this.defaultFilter.apply(filterManager, input, output);

        this.blurXFilter.apply(filterManager, input, renderTarget);
        this.blurYFilter.apply(filterManager, renderTarget, output);

        filterManager.returnRenderTarget(renderTarget);
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

    /**
     * Sets the strength of the blurX property
     *
     * @member {number}
     * @default 2
     */
    get blurX() {
        return this.blurXFilter.blur;
    }
    set blurX(value) {
        this.blurXFilter.blur = value;
    }

    /**
     * Sets the strength of the blurY property
     *
     * @member {number}
     * @default 2
     */
    get blurY() {
        return this.blurYFilter.blur;
    }
    set blurY(value) {
        this.blurYFilter.blur = value;
    }
}

