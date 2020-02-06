import {vertex} from '@tools/fragments';
import fragment from './glow.frag';
import {Filter} from '@pixi/core';
import {rgb2hex, hex2rgb} from '@pixi/utils';

/**
 * GlowFilter, originally by mishaa
 * [codepen]{@link http://codepen.io/mishaa/pen/raKzrm}.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/glow.png)
 * @class
 *
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-glow|@pixi/filter-glow}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 * @param {number} [options] Options for glow.
 * @param {number} [options.distance=10] The distance of the glow. Make it 2 times more for resolution=2.
 *        It can't be changed after filter creation.
 * @param {number} [options.outerStrength=4] The strength of the glow outward from the edge of the sprite.
 * @param {number} [options.innerStrength=0] The strength of the glow inward from the edge of the sprite.
 * @param {number} [options.color=0xffffff] The color of the glow.
 * @param {number} [options.quality=0.1] A number between 0 and 1 that describes the quality of the glow.
 *        The higher the number the less performant.
 * @param {boolean} [options.knockout=false] Toggle to hide the contents and only show glow.
 *
 * @example
 *  someSprite.filters = [
 *      new GlowFilter({ distance: 15, outerStrength: 2 })
 *  ];
 */
class GlowFilter extends Filter {

    constructor(options) {
        let {
            distance,
            outerStrength,
            innerStrength,
            color,
            knockout,
            quality } = Object.assign({}, GlowFilter.defaults, options);

        distance = Math.round(distance);

        super(vertex, fragment
            .replace(/__ANGLE_STEP_SIZE__/gi, '' + (1 / quality / distance).toFixed(7))
            .replace(/__DIST__/gi, distance.toFixed(0) + '.0'));

        this.uniforms.glowColor = new Float32Array([0, 0, 0, 1]);

        Object.assign(this, {
            color,
            outerStrength,
            innerStrength,
            padding: distance,
            knockout,
        });
    }

    /**
     * The color of the glow.
     * @member {number}
     * @default 0xFFFFFF
     */
    get color() {
        return rgb2hex(this.uniforms.glowColor);
    }
    set color(value) {
        hex2rgb(value, this.uniforms.glowColor);
    }

    /**
     * The strength of the glow outward from the edge of the sprite.
     * @member {number}
     * @default 4
     */
    get outerStrength() {
        return this.uniforms.outerStrength;
    }
    set outerStrength(value) {
        this.uniforms.outerStrength = value;
    }

    /**
     * The strength of the glow inward from the edge of the sprite.
     * @member {number}
     * @default 0
     */
    get innerStrength() {
        return this.uniforms.innerStrength;
    }
    set innerStrength(value) {
        this.uniforms.innerStrength = value;
    }

    /**
     * Only draw the glow, not the texture itself
     * @member {boolean}
     * @default false
     */
    get knockout() {
        return this.uniforms.knockout;
    }
    set knockout(value) {
        this.uniforms.knockout = value;
    }
}

GlowFilter.defaults = {
    distance: 10,
    outerStrength: 4,
    innerStrength: 0,
    color: 0xffffff,
    quality: 0.1,
    knockout: false,
};

export { GlowFilter };
