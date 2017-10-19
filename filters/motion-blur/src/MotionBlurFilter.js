import vertex from './motion-blur.vert';
import fragment from './motion-blur.frag';

/**
 * The MotionBlurFilter applies a Motion blur to an object.
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/motion-blur.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {PIXI.Point|number[]} [velocity=[0, 0]] Sets the velocity of the motion for blur effect.
 * @param {number} [kernelSize=5] - The kernelSize of the blur filter. Options: the `odd number` >= 5.
 */
export default class MotionBlurFilter extends PIXI.Filter
{
    constructor(velocity = [0, 0], kernelSize = 5)
    {
        super(vertex, fragment);

        this._velocity = new PIXI.Point(0,0);
        this.velocity = velocity;

        this.kernelSize = kernelSize;

        this._uVelocity = new Float32Array(2);
        this.uniforms.uVelocity = this._uVelocity;
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear)
    {
        const velX = this.velocity.x;
        const velY = this.velocity.y;

        if (velX !== 0 || velY !== 0)
        {
            this._uVelocity[0] = velX / input.size.width;
            this._uVelocity[1] = velY / input.size.height;

            this.uniforms.uKernelSize = this.kernelSize;
        }
        else
        {
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
    set velocity(value)
    {
        if (Array.isArray(value))
        {
            this._velocity.x = value[0];
            this._velocity.y = value[1];
        }
        else if (value instanceof PIXI.Point)
        {
            this._velocity.x = value.x;
            this._velocity.y = value.y;
        }
    }

    get velocity()
    {
        return this._velocity;
    }
}

// Export to PixiJS namespace
PIXI.filters.MotionBlurFilter = MotionBlurFilter;
