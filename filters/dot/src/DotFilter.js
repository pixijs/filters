import {vertex} from '@tools/fragments';
import fragment from './dot.frag';
import * as PIXI from 'pixi.js';

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 * original filter: https://github.com/evanw/glfx.js/blob/master/src/filters/fun/dotscreen.js
 */

/**
 * This filter applies a dotscreen effect making display objects appear to be made out of
 * black and white halftone dots like an old printer.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/dot.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [scale=1] The scale of the effect.
 * @param {number} [angle=5] The radius of the effect.
 */
export default class DotFilter extends PIXI.Filter {

    constructor(scale = 1, angle = 5) {
        super(vertex, fragment);
        this.scale = scale;
        this.angle = angle;
    }

    /**
     * The scale of the effect.
     * @member {number}
     * @default 1
     */
    get scale() {
        return this.uniforms.scale;
    }
    set scale(value) {
        this.uniforms.scale = value;
    }

    /**
     * The radius of the effect.
     * @member {number}
     * @default 5
     */
    get angle() {
        return this.uniforms.angle;
    }
    set angle(value) {
        this.uniforms.angle = value;
    }
}
