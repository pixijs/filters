import { vertex } from '@tools/fragments';
import fragment from './twist.frag';
import { Filter } from '@pixi/core';
import { Point } from '@pixi/math';

interface TwistFilterOptions {
    radius: number;
    angle: number;
    padding: number;
    offset: Point;
}

/**
 * This filter applies a twist effect making display objects appear twisted in the given direction.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/twist.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-twist|@pixi/filter-twist}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
class TwistFilter extends Filter
{
    /** Default constructor options. */
    public static readonly defaults: TwistFilterOptions = {
        radius: 200,
        angle: 4,
        padding: 20,
        offset: new Point(),
    };

    /**
     * @param {object} [options] - Object object to use.
     * @param {number} [options.radius=200] - The radius of the twist.
     * @param {number} [options.angle=4] - The angle of the twist.
     * @param {number} [options.padding=20] - Padding for filter area.
     * @param {PIXI.Point} [options.offset] - Center of twist, in local, pixel coordinates.
     */
    constructor(options?: Partial<TwistFilterOptions>)
    {
        super(vertex, fragment);

        Object.assign(this, TwistFilter.defaults, options);
    }

    /**
     * This point describes the the offset of the twist.
     *
     * @member {PIXI.Point}
     */
    get offset(): Point
    {
        return this.uniforms.offset;
    }
    set offset(value: Point)
    {
        this.uniforms.offset = value;
    }

    /**
     * The radius of the twist.
     */
    get radius(): number
    {
        return this.uniforms.radius;
    }
    set radius(value: number)
    {
        this.uniforms.radius = value;
    }

    /**
     * The angle of the twist.
     */
    get angle(): number
    {
        return this.uniforms.angle;
    }
    set angle(value: number)
    {
        this.uniforms.angle = value;
    }
}

export { TwistFilter };
export type { TwistFilterOptions };
