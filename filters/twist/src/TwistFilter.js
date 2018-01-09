import {vertex} from '@tools/fragments';
import fragment from './twist.frag';
import * as PIXI from 'pixi.js';

/**
 * This filter applies a twist effect making display objects appear twisted in the given direction.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/twist.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [radius=200] The radius of the twist.
 * @param {number} [angle=4] The angle of the twist.
 * @param {number} [padding=20] Padding for filter area.
 */
export default class TwistFilter extends PIXI.Filter {
    constructor(radius = 200, angle = 4, padding = 20) {
        super(vertex, fragment);

        this.radius = radius;
        this.angle = angle;
        this.padding = padding;
    }

    /**
     * This point describes the the offset of the twist.
     *
     * @member {PIXI.Point}
     */
    get offset() {
        return this.uniforms.offset;
    }
    set offset(value) {
        this.uniforms.offset = value;
    }

    /**
     * The radius of the twist.
     *
     * @member {number}
     */
    get radius() {
        return this.uniforms.radius;
    }
    set radius(value) {
        this.uniforms.radius = value;
    }

    /**
     * The angle of the twist.
     *
     * @member {number}
     */
    get angle() {
        return this.uniforms.angle;
    }
    set angle(value) {
        this.uniforms.angle = value;
    }
}
