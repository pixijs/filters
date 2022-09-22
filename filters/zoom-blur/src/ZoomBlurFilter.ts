import { vertex } from '@tools/fragments';
import fragment from './zoom-blur.frag';
import { Filter, Point } from '@pixi/core';

type PointLike = Point | number[];

interface ZoomBlurFilterOptions {
    strength: number;
    center: PointLike;
    innerRadius: number;
    radius: number;
    maxKernelSize: number;
}

/**
 * The ZoomFilter applies a Zoom blur to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/zoom-blur.png)
 *
 * @class
 * @extends PIXI.Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-zoom-blur|@pixi/filter-zoom-blur}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
class ZoomBlurFilter extends Filter
{
    /** Default constructor options. */
    public static readonly defaults: ZoomBlurFilterOptions = {
        strength: 0.1,
        center: [0, 0],
        innerRadius: 0,
        radius: -1,
        maxKernelSize: 32,
    };

    /**
     * @param {object} [options] - Filter options to use.
     * @param {number} [options.strength=0.1] - Sets the strength of the zoom blur effect
     * @param {PIXI.Point|number[]} [options.center=[0,0]] - The center of the zoom.
     * @param {number} [options.innerRadius=0] - The inner radius of zoom. The part in inner circle won't apply
     *        zoom blur effect.
     * @param {number} [options.radius=-1] - See `radius` property.
     * @param {number} [options.maxKernelSize=32] - On older iOS devices, it's better to not go above `13.0`.
     *        Decreasing this value will produce a lower-quality blur effect with more dithering.
     */
    constructor(options?: Partial<ZoomBlurFilterOptions>)
    {
        const { maxKernelSize, ...rest }: ZoomBlurFilterOptions = Object.assign(ZoomBlurFilter.defaults, options);

        super(vertex, fragment.replace('${maxKernelSize}', maxKernelSize.toFixed(1)));

        Object.assign(this, rest);
    }

    /**
     * Center of the effect.
     *
     * @member {PIXI.Point|number[]}
     * @default [0, 0]
     */
    get center(): PointLike
    {
        return this.uniforms.uCenter;
    }
    set center(value: PointLike)
    {
        this.uniforms.uCenter = value;
    }

    /**
     * Intensity of the zoom effect.
     * @default 0.1
     */
    get strength(): number
    {
        return this.uniforms.uStrength;
    }
    set strength(value: number)
    {
        this.uniforms.uStrength = value;
    }

    /**
     * Radius of the inner region not effected by blur.
     * @default 0
     */
    get innerRadius(): number
    {
        return this.uniforms.uInnerRadius;
    }
    set innerRadius(value: number)
    {
        this.uniforms.uInnerRadius = value;
    }

    /**
     * Outer radius of the effect. The default value is `-1`.
     * `< 0.0` means it's infinity.
     * @default -1
     */
    get radius(): number
    {
        return this.uniforms.uRadius;
    }
    set radius(value: number)
    {
        if (value < 0 || value === Infinity)
        {
            value = -1;
        }
        this.uniforms.uRadius = value;
    }
}

export { ZoomBlurFilter };
export type { ZoomBlurFilterOptions };
