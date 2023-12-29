import { vertex } from '@tools/fragments';
import fragment from './bulgePinch.frag';
import { Filter, GlProgram } from 'pixi.js';
import type { Point, FilterSystem, Texture, RenderSurface } from 'pixi.js';

type PointLike = Point | number[];

export interface BulgePinchFilterOptions
{
    center: PointLike;
    radius: number;
    strength: number;
}

// @author Julien CLEREL @JuloxRox
// original filter https://github.com/evanw/glfx.js/blob/master/src/filters/warp/bulgepinch.js
// by Evan Wallace : http://madebyevan.com/

/**
 * Bulges or pinches the image in a circle.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/bulge-pinch.gif)
 *
 * @class
 * @extends Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-bulge-pinch|@pixi/filter-bulge-pinch}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export class BulgePinchFilter extends Filter
{
    /** Default constructor options. */
    public static readonly defaults: BulgePinchFilterOptions = {
        center: [0.5, 0.5],
        radius: 100,
        strength: 1,
    };

    /**
     * @param {object} [options] - Options to use for filter.
     * @param {Point|Array<number>} [options.center=[0,0]] - The x and y coordinates of the center
     *        of the circle of effect.
     * @param {number} [options.radius=100] - The radius of the circle of effect.
     * @param {number} [options.strength=1] - -1 to 1 (-1 is strong pinch, 0 is no effect, 1 is strong bulge)
     */
    constructor(options?: Partial<BulgePinchFilterOptions>)
    {
        const glProgram = new GlProgram({
            vertex,
            fragment,
            name: 'bulge-pinch-filter',
        });

        super({
            glProgram,
            resources: {},
        });

        // this.uniforms.dimensions = new Float32Array(2);

        Object.assign(this, BulgePinchFilter.defaults, options);
    }

    apply(filterManager: FilterSystem, input: Texture, output: RenderSurface, clear: boolean): void
    {
        // const { width, height } = input.filterFrame as Rectangle;

        // this.uniforms.dimensions[0] = width;
        // this.uniforms.dimensions[1] = height;
        // filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * The radius of the circle of effect.
     */
    // get radius(): number
    // {
    //     return this.uniforms.radius;
    // }
    // set radius(value: number)
    // {
    //     this.uniforms.radius = value;
    // }

    /**
     * The strength of the effect. -1 to 1 (-1 is strong pinch, 0 is no effect, 1 is strong bulge)
     */
    // get strength(): number
    // {
    //     return this.uniforms.strength;
    // }
    // set strength(value: number)
    // {
    //     this.uniforms.strength = value;
    // }

    /**
     * The x and y coordinates of the center of the circle of effect.
     *
     * @member {Point | Array<number>}
     */
    // get center(): PointLike
    // {
    //     return this.uniforms.center;
    // }
    // set center(value: PointLike)
    // {
    //     this.uniforms.center = value;
    // }
}
