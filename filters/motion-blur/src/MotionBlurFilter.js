import vertex from './motion-blur.vert';
import fragment from './motion-blur.frag';

/**
 * The MotionBlurFilter applies a Motion blur to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/motion-blur.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {PIXI.Point|number[]} [velocity=[0, 0]] Sets the velocity of the motion for blur effect.
 * @param {number} [kernelSize=5] - The kernelSize of the blur filter. Options: the `odd number` >= 5.
 * @param {number} [offset=0] - The offset of the blur filter.
 */
export default class MotionBlurFilter extends PIXI.Filter {
    constructor(velocity = [0, 0], kernelSize = 5, offset = 0) {
        super(vertex, fragment);

        this._velocity = new PIXI.Point(0,0);
        this.velocity = velocity;

        this.kernelSize = kernelSize;
        this.offset = offset;
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        const velX = this.velocity.x;
        const velY = this.velocity.y;

        if (velX !== 0 || velY !== 0) {
            this.uniforms.uKernelSize = this.kernelSize;
        }
        else {
            this.uniforms.uKernelSize = 0;
        }

        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * Sets the velocity of the motion for blur effect.
     *
     * @member {PIXI.Point|number[]}
     * @default [0, 0]
     */
    set velocity(value) {
        if (Array.isArray(value)) {
            this._velocity.x = value[0];
            this._velocity.y = value[1];
        }
        else if (value instanceof PIXI.Point) {
            this._velocity.x = value.x;
            this._velocity.y = value.y;
        }

        this.uniforms.uVelocity[0] = this._velocity.x;
        this.uniforms.uVelocity[1] = this._velocity.y;
    }

    get velocity() {
        return this._velocity;
    }

    /**
     * The offset of the blur filter.
     *
     * @member {number}
     * @default 0
     */
    set offset(value) {
        this.uniforms.uOffset = value;
    }

    get offset() {
        return this.uniforms.uOffset;
    }
}

// Export to PixiJS namespace
PIXI.filters.MotionBlurFilter = MotionBlurFilter;
