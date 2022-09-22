import { vertex } from '@tools/fragments';
import fragment from './dot.frag';
import { Filter } from '@pixi/core';

// @author Mat Groves http://matgroves.com/ @Doormat23
// original filter: https://github.com/evanw/glfx.js/blob/master/src/filters/fun/dotscreen.js

/**
 * This filter applies a dotscreen effect making display objects appear to be made out of
 * black and white halftone dots like an old printer.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/dot.png)
 *
 * @class
 * @extends PIXI.Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-dot|@pixi/filter-dot}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
class DotFilter extends Filter
{
    /**
     * @param {number} [scale=1] - The scale of the effect.
     * @param {number} [angle=5] - The radius of the effect.
     */
    constructor(scale = 1, angle = 5)
    {
        super(vertex, fragment);
        this.scale = scale;
        this.angle = angle;
    }

    /**
     * The scale of the effect.
     * @default 1
     */
    get scale(): number
    {
        return this.uniforms.scale;
    }
    set scale(value: number)
    {
        this.uniforms.scale = value;
    }

    /**
     * The radius of the effect.
     * @default 5
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

export { DotFilter };
