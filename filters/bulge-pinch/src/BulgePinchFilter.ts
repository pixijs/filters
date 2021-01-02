import {vertex} from '@tools/fragments';
import fragment from './bulgePinch.frag';
import {Filter} from '@pixi/core';
import type { Point } from '@pixi/math';

type PointLike = Point | number[];

interface BulgePinchFilterOptions {
    center: PointLike;
    radius: number;
    strength: number;
}

/**
 * @author Julien CLEREL @JuloxRox
 * original filter https://github.com/evanw/glfx.js/blob/master/src/filters/warp/bulgepinch.js by Evan Wallace : http://madebyevan.com/
 */

/**
 * Bulges or pinches the image in a circle.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/bulge-pinch.gif)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-bulge-pinch|@pixi/filter-bulge-pinch}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
class BulgePinchFilter extends Filter {

    /**
     * @param {object} [options] Options to use for filter.
     * @param {PIXI.Point|Array<number>} [options.center=[0,0]] The x and y coordinates of the center of the circle of effect.
     * @param {number} [options.radius=100] The radius of the circle of effect.
     * @param {number} [options.strength=1] -1 to 1 (-1 is strong pinch, 0 is no effect, 1 is strong bulge)
     */
    constructor(options?: Partial<BulgePinchFilterOptions>) {
        super(vertex, fragment);

        // @deprecated (center, radius, strength) args
        if (typeof options !== 'object') {
            const [center, radius, strength] = arguments;
            options = {};
            if (center !== undefined) {
                options.center = center;
            }
            if (radius !== undefined) {
                options.radius = radius;
            }
            if (strength !== undefined) {
                options.strength = strength;
            }
        }

        this.uniforms.dimensions = new Float32Array(2);

        Object.assign(this, {
            center: [0.5, 0.5],
            radius: 100,
            strength: 1,
        }, options);
    }

    apply(filterManager, input, output, clear) {
        this.uniforms.dimensions[0] = input.filterFrame.width;
        this.uniforms.dimensions[1] = input.filterFrame.height;
        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * The radius of the circle of effect.
     *
     * @member {number}
     */
    get radius(): number {
        return this.uniforms.radius;
    }
    set radius(value: number) {
        this.uniforms.radius = value;
    }

    /**
     * The strength of the effect. -1 to 1 (-1 is strong pinch, 0 is no effect, 1 is strong bulge)
     *
     * @member {number}
     */
    get strength(): number {
        return this.uniforms.strength;
    }
    set strength(value: number) {
        this.uniforms.strength = value;
    }

    /**
     * The x and y coordinates of the center of the circle of effect.
     *
     * @member {PIXI.Point | Array<number>}
     */
    get center(): PointLike {
        return this.uniforms.center;
    }
    set center(value: PointLike) {
        this.uniforms.center = value;
    }
}

export { BulgePinchFilter };
export type { BulgePinchFilterOptions };
