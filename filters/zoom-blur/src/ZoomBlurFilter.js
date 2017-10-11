import vertex from './zoom-blur.vert';
import fragment from './zoom-blur.frag';

/**
 * The ZoomFilter applies a Zoom blur to an object.
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/zoom-filter.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [strength=2] Sets the strength of the zoom blur effect
 * @param {PIXI.Point|number[]} [center=[0,0]] The center of the zoom.
 * @param {number} [innerRadius=0] The inner radius of zoom. The part in inner circle won't apply zoom blur effect.
 * @param {number} [radius=1E9] Very very large outer radius of the zoom.
 */
export default class ZoomBlurFilter extends PIXI.Filter
{
    constructor(strength = 0.1, center = [0, 0], innerRadius = 0, radius = 1E9) {
        super(vertex, fragment);

        this.center = center;
        this.strength = strength;
        this.innerRadius = innerRadius;
        this.radius = radius;

        this._defaultSize = new Float32Array([0, 0]);
        this._size = new Float32Array([0, 0]);
        this.clearSize();
    }

    /**
     * Apply the filter
     * @override
     * @private
     */ 
    apply(filterManager, input, output, clear)
    {
        // Apply the input source if view is not set
        if (!this._customSize)
        {
            this._defaultSize[0] = input.sourceFrame.width;
            this._defaultSize[1] = input.sourceFrame.height;
        }
        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * Set the view size, if defining a region.
     * @method
     * @param {number} width - Width of the view size
     * @param {number} height - Height of the view size
     */
    setSize(width, height) {
        this._customSize = true;
        this._size[0] = width;
        this._size[1] = height;
        this.uniforms.uViewSize = this._size;
    }

    /**
     * Clear the defined view size of the region to effect.
     * @method
     */
    clearSize() {
        this._customSize = false;
        this.uniforms.uViewSize = this._defaultSize;
    }

    /**
     * Center of the effect.
     *
     * @member {PIXI.Point|number[]}
     * @default [0, 0]
     */
    get center() {
        return this.uniforms.uCenter;
    }
    set center(value) {
        this.uniforms.uCenter = value;
    }

    /**
     * Intensity of the zoom effect.
     *
     * @member {number}
     * @default 0.1
     */
    get strength() {
        return this.uniforms.uStrength;
    }
    set strength(value) {
        this.uniforms.uStrength = value;
    }

    /**
     * Radius of the inner region not effected by blur.
     *
     * @member {number}
     * @default 0
     */
    get innerRadius() {
        return this.uniforms.uInnerRadius;
    }
    set innerRadius(value) {
        this.uniforms.uInnerRadius = value;
    }

    /**
     * Outer radius of the effect. The default value is very very big.
     *
     * @member {number}
     * @default 1E9
     */
    get radius() {
        return this.uniforms.uRadius;
    }
    set radius(value) {
        this.uniforms.uRadius = value;
    }
}

// Export to PixiJS namespace
PIXI.filters.ZoomBlurFilter = ZoomBlurFilter;

