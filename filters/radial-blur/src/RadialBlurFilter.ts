import { vertex } from '@tools/fragments';
import fragment from './radial-blur.frag';
import { Filter } from '@pixi/core';
import type { Point } from '@pixi/math';
import type { FilterSystem, RenderTexture } from '@pixi/core';
import type { CLEAR_MODES } from '@pixi/constants';

type PointLike = Point | number[];

/**
 * The RadialBlurFilter applies a Motion blur to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/radial-blur.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-radial-blur|@pixi/filter-radial-blur}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
class RadialBlurFilter extends Filter
{
    private _angle = 0;

    /**
     * The kernelSize for the blur filter. Must be odd number >= 3.
     * @member {number}
     * @default 5
     */
    public kernelSize: number;

    /**
     * @param {number} [angle=0] - Sets the angle of the motion for blur effect.
     * @param {PIXI.Point|number[]} [center=[0,0]] - The center of the radial.
     * @param {number} [kernelSize=5] - The kernelSize of the blur filter. Must be odd number >= 3
     * @param {number} [radius=-1] - The maximum size of the blur radius, `-1` is infinite
     */
    constructor(angle = 0, center: PointLike = [0, 0], kernelSize = 5, radius = -1)
    {
        super(vertex, fragment);

        this.angle = angle;
        this.center = center;
        this.kernelSize = kernelSize;
        this.radius = radius;
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clear: CLEAR_MODES): void
    {
        this.uniforms.uKernelSize = this._angle !== 0 ? this.kernelSize : 0;
        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * Sets the angle in degrees of the motion for blur effect.
     *
     * @member {PIXI.Point|number[]}
     * @default 0
     */
    set angle(value: number)
    {
        this._angle = value;
        this.uniforms.uRadian = value * Math.PI / 180;
    }

    get angle(): number
    {
        return this._angle;
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
     * Outer radius of the effect. The default value of `-1` is infinite.
     *
     * @member {number}
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

export { RadialBlurFilter };

