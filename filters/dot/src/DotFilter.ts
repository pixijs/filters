import { vertex } from '@tools/fragments';
import fragment from './dot.frag';
import { Filter, GlProgram } from 'pixi.js';

// @author Mat Groves http://matgroves.com/ @Doormat23
// original filter: https://github.com/evanw/glfx.js/blob/master/src/filters/fun/dotscreen.js

/**
 * This filter applies a dotscreen effect making display objects appear to be made out of
 * black and white halftone dots like an old printer.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/dot.png)
 *
 * @class
 * @extends Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-dot|@pixi/filter-dot}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export class DotFilter extends Filter
{
    /**
     * @param {number} [scale=1] - The scale of the effect.
     * @param {number} [angle=5] - The radius of the effect.
     * @param {boolean} [grayscale=true] - Render as grayscale.
     */
    constructor(scale = 1, angle = 5, grayscale = true)
    {
        const glProgram = new GlProgram({
            vertex,
            fragment,
            name: 'dot-filter',
        });

        super({
            glProgram,
            resources: {},
        });

        // this.scale = scale;
        // this.angle = angle;
        // this.grayscale = grayscale;
    }

    /**
     * The scale of the effect.
     * @default 1
     */
    // get scale(): number
    // {
    //     return this.uniforms.scale;
    // }
    // set scale(value: number)
    // {
    //     this.uniforms.scale = value;
    // }

    /**
     * The radius of the effect.
     * @default 5
     */
    // get angle(): number
    // {
    //     return this.uniforms.angle;
    // }
    // set angle(value: number)
    // {
    //     this.uniforms.angle = value;
    // }

    /**
     * Render as grayscale.
     * @default true
     */
    // get grayscale(): boolean
    // {
    //     return this.uniforms.grayscale;
    // }
    // set grayscale(value: boolean)
    // {
    //     this.uniforms.grayscale = value;
    // }
}
