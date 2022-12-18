import { vertex } from '@tools/fragments';
import fragment from './glow.frag';
import { Filter, utils } from '@pixi/core';

interface GlowFilterOptions
{
    distance: number;
    outerStrength: number;
    innerStrength: number;
    color: number;
    quality: number;
    knockout: boolean;
    alpha: number;
}

/**
 * GlowFilter, originally by mishaa
 * [codepen]{@link http://codepen.io/mishaa/pen/raKzrm}.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/glow.png)
 * @class
 *
 * @extends PIXI.Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-glow|@pixi/filter-glow}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 *
 * @example
 *  someSprite.filters = [
 *      new GlowFilter({ distance: 15, outerStrength: 2 })
 *  ];
 */
class GlowFilter extends Filter
{
    /** Default values for options. */
    static readonly defaults: GlowFilterOptions = {
        distance: 10,
        outerStrength: 4,
        innerStrength: 0,
        color: 0xffffff,
        quality: 0.1,
        knockout: false,
        alpha: 1,
    };

    /**
     * @param {number} [options] - Options for glow.
     * @param {number} [options.distance=10] - The distance of the glow. Make it 2 times more for resolution=2.
     *        It can't be changed after filter creation.
     * @param {number} [options.outerStrength=4] - The strength of the glow outward from the edge of the sprite.
     * @param {number} [options.innerStrength=0] - The strength of the glow inward from the edge of the sprite.
     * @param {number} [options.color=0xffffff] - The color of the glow.
     * @param {number} [options.quality=0.1] - A number between 0 and 1 that describes the quality of the glow.
     *        The higher the number the less performant.
     * @param {boolean} [options.knockout=false] - Toggle to hide the contents and only show glow.
     */
    constructor(options?: Partial<GlowFilterOptions>)
    {
        const opts: GlowFilterOptions = Object.assign({}, GlowFilter.defaults, options);
        const {
            outerStrength,
            innerStrength,
            color,
            knockout,
            quality,
            alpha } = opts;

        const distance = Math.round(opts.distance);

        super(vertex, fragment
            .replace(/__ANGLE_STEP_SIZE__/gi, `${(1 / quality / distance).toFixed(7)}`)
            .replace(/__DIST__/gi, `${distance.toFixed(0)}.0`));

        this.uniforms.glowColor = new Float32Array([0, 0, 0, 1]);
        this.uniforms.alpha = 1;

        Object.assign(this, {
            color,
            outerStrength,
            innerStrength,
            padding: distance,
            knockout,
            alpha,
        });
    }

    /**
     * The color of the glow.
     * @default 0xFFFFFF
     */
    get color(): number
    {
        return utils.rgb2hex(this.uniforms.glowColor);
    }
    set color(value: number)
    {
        utils.hex2rgb(value, this.uniforms.glowColor);
    }

    /**
     * The strength of the glow outward from the edge of the sprite.
     * @default 4
     */
    get outerStrength(): number
    {
        return this.uniforms.outerStrength;
    }
    set outerStrength(value: number)
    {
        this.uniforms.outerStrength = value;
    }

    /**
     * The strength of the glow inward from the edge of the sprite.
     * @default 0
     */
    get innerStrength(): number
    {
        return this.uniforms.innerStrength;
    }
    set innerStrength(value: number)
    {
        this.uniforms.innerStrength = value;
    }

    /**
     * Only draw the glow, not the texture itself
     * @default false
     */
    get knockout(): boolean
    {
        return this.uniforms.knockout;
    }
    set knockout(value: boolean)
    {
        this.uniforms.knockout = value;
    }

    /**
     * The alpha value of the glow
     * @default 1
     */
    get alpha(): boolean
    {
        return this.uniforms.alpha;
    }
    set alpha(value: boolean)
    {
        this.uniforms.alpha = value;
    }
}

export { GlowFilter };
export type { GlowFilterOptions };
