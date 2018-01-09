import {vertex} from '@tools/fragments';
import fragment from './glow.frag';
import * as PIXI from 'pixi.js';

/**
 * GlowFilter, originally by mishaa
 * http://www.html5gamedevs.com/topic/12756-glow-filter/?hl=mishaa#entry73578
 * http://codepen.io/mishaa/pen/raKzrm<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/glow.png)
 *
 * @class
 *
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [distance=10] The distance of the glow. Make it 2 times more for resolution=2. It cant be changed after filter creation
 * @param {number} [outerStrength=4] The strength of the glow outward from the edge of the sprite.
 * @param {number} [innerStrength=0] The strength of the glow inward from the edge of the sprite.
 * @param {number} [color=0xffffff] The color of the glow.
 * @param {number} [quality=0.1] A number between 0 and 1 that describes the quality of the glow.
 *
 * @example
 *  someSprite.filters = [
 *      new GlowFilter(15, 2, 1, 0xFF0000, 0.5)
 *  ];
 */
export default class GlowFilter extends PIXI.Filter {

    constructor(distance = 10, outerStrength = 4, innerStrength = 0, color = 0xffffff, quality = 0.1) {
        super(vertex, fragment
            .replace(/%QUALITY_DIST%/gi, '' + (1 / quality / distance).toFixed(7))
            .replace(/%DIST%/gi, '' + distance.toFixed(7)));

        this.uniforms.glowColor = new Float32Array([0, 0, 0, 1]);
        this.distance = distance;
        this.color = color;
        this.outerStrength = outerStrength;
        this.innerStrength = innerStrength;
    }

    /**
     * The color of the glow.
     * @member {number}
     * @default 0xFFFFFF
     */
    get color() {
        return PIXI.utils.rgb2hex(this.uniforms.glowColor);
    }
    set color(value) {
        PIXI.utils.hex2rgb(value, this.uniforms.glowColor);
    }

    /**
     * The distance of the glow. Make it 2 times more for resolution=2. It cant be changed after filter creation
     * @member {number}
     * @default 10
     */
    get distance() {
        return this.uniforms.distance;
    }
    set distance(value) {
        this.uniforms.distance = value;
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
}
