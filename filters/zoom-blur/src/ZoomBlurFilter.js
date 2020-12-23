import {vertex} from '@tools/fragments';
import fragment from './zoom-blur.frag';
import {Filter} from '@pixi/core';

/**
 * The ZoomFilter applies a Zoom blur to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/zoom-blur.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-zoom-blur|@pixi/filter-zoom-blur}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 * @param {object} [options] Filter options to use.
 * @param {number} [options.strength=0.1] Sets the strength of the zoom blur effect
 * @param {PIXI.Point|number[]} [options.center=[0,0]] The center of the zoom.
 * @param {number} [options.innerRadius=0] The inner radius of zoom. The part in inner circle won't apply zoom blur effect.
 * @param {number} [options.radius=-1] See `radius` property.
 * @param {number} [options.maxKernelSize=32] On older iOS devices, it's better to not go above `13.0`. Decreasing this
 *        value will produce a lower-quality blur effect with more dithering.
 */
class ZoomBlurFilter extends Filter {
    constructor(options) {
        // @deprecated (strength, center, innerRadius, radius) args
        if (typeof options !== 'object') {
            const [strength, center, innerRadius, radius] = arguments;
            options = {};
            if (strength !== undefined) {
                options.strength = strength;
            }
            if (center !== undefined) {
                options.center = center;
            }
            if (innerRadius !== undefined) {
                options.innerRadius = innerRadius;
            }
            if (radius !== undefined) {
                options.radius = radius;
            }
        }

        // Apply default values
        options = Object.assign({
            strength: 0.1,
            center: [0, 0],
            innerRadius: 0,
            radius: -1,
            maxKernelSize: 32,
        }, options);

        super(vertex, fragment.replace('${maxKernelSize}', options.maxKernelSize.toFixed(1)));

        this.strength = options.strength;
        this.center = options.center;
        this.innerRadius = options.innerRadius;
        this.radius = options.radius;
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
     * Outer radius of the effect. The default value is `-1`.
     * `< 0.0` means it's infinity.
     *
     * @member {number}
     * @default -1
     */
    get radius() {
        return this.uniforms.uRadius;
    }
    set radius(value) {
        if (value < 0 || value === Infinity) {
            value = -1;
        }
        this.uniforms.uRadius = value;
    }
}

export { ZoomBlurFilter };

