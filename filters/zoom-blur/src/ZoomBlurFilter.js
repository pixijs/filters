import vertex from './zoom-blur.vert';
import fragment from './zoom-blur.frag';

/**
 * The ZoomFilter applies a Zoom blur to an object.
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/zoom-blur.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [strength=2] Sets the strength of the zoom blur effect
 * @param {PIXI.Point|number[]} [center=[0,0]] The center of the zoom.
 * @param {number} [innerRadius=0] The inner radius of zoom. The part in inner circle won't apply zoom blur effect.
 * @param {number} [radius=1E8] Outer radius of the zoom, The default value is very very large.
 */
export default class ZoomBlurFilter extends PIXI.Filter
{
    constructor(strength = 0.1, center = [0, 0], innerRadius = 0, radius = 1E8) {
        super(vertex, fragment);

        this.center = center;
        this.strength = strength;
        this.innerRadius = innerRadius;
        this.radius = radius;
    }

    /**
     * Apply the filter
     * @override
     * @private
     */
    apply(filterManager, input, output, clear)
    {
        filterManager.applyFilter(this, input, output, clear);
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

