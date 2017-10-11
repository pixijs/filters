import vertex from './zoom-blur.vert.js';
import fragment from './zoom-blur.frag.js';

/**
 * The ZoomFilter applies a Zoom blur to an object.
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/zoom-filter.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [strength=2] Sets the strength of the zoom blur effect
 * @param {number} [centerX=0] The center(x-axis) of the zoom.
 * @param {number} [centerY=0] The center(y-axis) of the zoom.
 * @param {number} [innerRadius=0] The inner radius of zoom. The part in inner circle won't apply zoom blur effect.
 */
export default class ZoomBlurFilter extends PIXI.Filter
{
    constructor(strength = 0.1, centerX, centerY, innerRadius)
    {
        super(
            vertex,
            fragment
        );

        this.strength = strength;

        this._center = new Float32Array([0, 0]);
        this.center = new PIXI.Point(0, 0);
        this.centerX = centerX || 0;
        this.centerY = centerY || 0;

        this.innerRadius = innerRadius || 0;

        // outer radius, default value should be very very very big.
        this.radius = 1E9;

        this._viewSize = new Float32Array([0, 0]);
        this.viewSize = null;
    }

    apply(filterManager, input, output, clear)
    {
        this._center[0] = this.center.x;
        this._center[1] = this.center.y;

        this.uniforms.uStrength = this.strength;
        this.uniforms.uCenter = this._center;
        this.uniforms.uInnerRadius = this.innerRadius;
        this.uniforms.uRadius = this.radius;

        if (this.viewSize)
        {
            this.uniforms.uViewSize = this.viewSize;
        }
        else
        {
            this._viewSize[0] = input.sourceFrame.width;
            this._viewSize[1] = input.sourceFrame.height;
            this.uniforms.uViewSize = this._viewSize;
        }

        filterManager.applyFilter(this, input, output, clear);
    }

    setViewSize(width, height)
    {
        if (width === null)
        {
            this.viewSize = null;

            return;
        }
        if (!this.viewSize)
        {
            this.viewSize = new Float32Array(2);
        }
        this.viewSize[0] = width;
        this.viewSize[1] = height;
    }

    get centerX() {
        return this.center.x;
    }
    set centerX(value) {
        this.center.x = value;
    }

    get centerY() {
        return this.center.y;
    }
    set centerY(value) {
        this.center.y = value;
    }
}

// Export to PixiJS namespace
PIXI.filters.ZoomBlurFilter = ZoomBlurFilter;

