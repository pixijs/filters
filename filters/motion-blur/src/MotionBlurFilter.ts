import { vertex } from '@tools/fragments';
import fragment from './motion-blur.frag';
import { Filter, GlProgram, ObservablePoint, Point } from 'pixi.js';
import type { FilterSystem, RenderSurface, Texture } from 'pixi.js';

/**
 * The MotionBlurFilter applies a Motion blur to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/motion-blur.png)
 *
 * @class
 * @extends Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-motion-blur|@pixi/filter-motion-blur}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export class MotionBlurFilter extends Filter
{
    /**
     * The kernelSize of the blur, higher values are slower but look better.
     * Use odd value greater than 5.
     */
    public kernelSize = 5;

    // private _velocity: Point;

    /**
     * @param {ObservablePoint|Point|number[]} [velocity=[0, 0]] - Sets the velocity of the motion for blur effect.
     * @param {number} [kernelSize=5] - The kernelSize of the blur filter. Must be odd number >= 5
     * @param {number} [offset=0] - The offset of the blur filter.
     */
    constructor(velocity: number[] | Point | ObservablePoint = [0, 0], kernelSize = 5, offset = 0)
    {
        const glProgram = new GlProgram({
            vertex,
            fragment,
            name: 'motion-blur-filter',
        });

        super({
            glProgram,
            resources: {},
        });

        // this.uniforms.uVelocity = new Float32Array(2);
        // this._velocity = new ObservablePoint(this.velocityChanged, this);
        this.setVelocity(velocity);

        this.kernelSize = kernelSize;
        // this.offset = offset;
    }

    /**
     * Override existing apply method in Filter
     * @private
     */
    apply(filterManager: FilterSystem, input: Texture, output: RenderSurface, clear: boolean): void
    {
        // const { x, y } = this.velocity;

        // this.uniforms.uKernelSize = (x !== 0 || y !== 0) ? this.kernelSize : 0;
        // filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * Sets the velocity of the motion for blur effect.
     *
     * @member {ObservablePoint|Point|number[]}
     */
    // set velocity(value: Point)
    // {
    //     this.setVelocity(value);
    // }
    // get velocity(): Point
    // {
    //     return this._velocity;
    // }

    /**
     * Set velocity with more broad types
     */
    private setVelocity(value: Point | number[])
    {
        // if (Array.isArray(value))
        // {
        //     const [x, y] = value;

        //     this._velocity.set(x, y);
        // }
        // else
        // {
        //     this._velocity.copyFrom(value);
        // }
    }

    /**
     * Handle velocity changed
     * @private
     */
    private velocityChanged()
    {
        // this.uniforms.uVelocity[0] = this._velocity.x;
        // this.uniforms.uVelocity[1] = this._velocity.y;

        // The padding will be increased as the velocity and intern the blur size is changed
        // this.padding = (Math.max(Math.abs(this._velocity.x), Math.abs(this._velocity.y)) >> 0) + 1;
    }

    /**
     * The offset of the blur filter.
     * @default 0
     */
    // set offset(value: number)
    // {
    //     this.uniforms.uOffset = value;
    // }

    // get offset(): number
    // {
    //     return this.uniforms.uOffset;
    // }
}
