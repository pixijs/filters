const {BlurXFilter, BlurYFilter, VoidFilter} = PIXI.filters;

/**
 * The BloomFilter applies a Gaussian blur to an object.
 * The strength of the blur can be set for x- and y-axis separately.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number|PIXI.Point} [blur=2] Sets the strength of both the blurX and blurY properties simultaneously
 */
export default class BloomFilter extends PIXI.Filter {

    constructor(blur = 2) {
        super();
        this.blurXFilter = new BlurXFilter();
        this.blurYFilter = new BlurYFilter();
        this.blurYFilter.blendMode = PIXI.BLEND_MODES.SCREEN;
        this.defaultFilter = new VoidFilter();

        if (typeof blur === 'number') {
            this.blur = blur;
        }
        else if (blur instanceof PIXI.Point) {
            this.blurX = blur.x;
            this.blurY = blur.y;
        }
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
