import {vertex} from '@tools/fragments';
import fragment from './twist.frag';
import {Filter} from '@pixi/core';
import {Point} from '@pixi/math';

/**
 * This filter applies a twist effect making display objects appear twisted in the given direction.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/twist.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-twist|@pixi/filter-twist}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 * @param {object} [options] Object object to use.
 * @param {number} [options.radius=200] The radius of the twist.
 * @param {number} [options.angle=4] The angle of the twist.
 * @param {number} [options.padding=20] Padding for filter area.
 * @param {number} [options.offset] Center of twist, in local, pixel coordinates.
 */
class TwistFilter extends Filter {
    constructor(options) {
        super(vertex, fragment);

        // @deprecated: constructor (radius, angle, padding)
        if (typeof options === 'number') {
            options = { radius: options };
            if (arguments[1] !== undefined) {
                options.angle = arguments[1];
            }
            if (arguments[2] !== undefined) {
                options.padding = arguments[2];
            }
        }

        Object.assign(this, {
            radius: 200,
            angle: 4,
            padding: 20,
            offset: new Point(),
        }, options);
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

export { TwistFilter };

