/* eslint-disable max-len */
import { deprecation, Filter, GlProgram, GpuProgram, ObservablePoint, PointData } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './motion-blur.frag';
import source from './motion-blur.wgsl';

/** Options for the MotionBlurFilter constructor. */
export interface MotionBlurFilterOptions
{
    /**
     * Sets the velocity of the motion for blur effect
     * This should be a size 2 array or an object containing `x` and `y` values, you cannot change types
     * once defined in the constructor
     * @default {x:0,y:0}
     */
    velocity?: PointData | number[];
    /**
     * The kernelSize of the blur filter. Must be odd number >= 5
     * @default 5
     */
    kernelSize?: number;
    /**
     * The offset of the blur filter
     * @default 0
     */
    offset?: number;
}

/**
 * The MotionBlurFilter applies a Motion blur to an object.<br>
 * ![original](../screenshots/original.png)![filter](../screenshots/motion-blur.png)
 *
 * @class
 * @extends Filter
 */
export class MotionBlurFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: MotionBlurFilterOptions = {
        velocity: { x: 0, y: 0 },
        kernelSize: 5,
        offset: 0,
    };

    public uniforms: {
        uVelocity: PointData;
        uKernelSize: number;
        uOffset: number;
    };

    private _kernelSize!: number;

    /**
     * @param options - Options for the MotionBlurFilter constructor.
     */
    constructor(options?: MotionBlurFilterOptions);
    /**
     * @deprecated since 8.0.0
     *
     * @param {PIXI.ObservablePoint|PIXI.PointData|number[]} [velocity=[0, 0]] - Sets the velocity of the motion for blur effect.
     * @param {number} [kernelSize=5] - The kernelSize of the blur filter. Must be odd number >= 5
     * @param {number} [offset=0] - The offset of the blur filter.
     */
    constructor(velocity?: number[] | PointData | ObservablePoint, kernelSize?: number, offset?: number);
    /** @ignore */
    constructor(...args: [MotionBlurFilterOptions?] | [(number[] | PointData | ObservablePoint)?, number?, number?])
    {
        let options = args[0] ?? {};

        if (Array.isArray(options) || ('x' in options && 'y' in options) || options instanceof ObservablePoint)
        {
            // eslint-disable-next-line max-len
            deprecation('6.0.0', 'MotionBlurFilter constructor params are now options object. See params: { velocity, kernelSize, offset }');

            const x = 'x' in options ? options.x : options[0];
            const y = 'y' in options ? options.y : options[1];

            options = { velocity: { x, y } };

            if (args[1] !== undefined) options.kernelSize = args[1];
            if (args[2] !== undefined) options.offset = args[2];
        }

        options = { ...MotionBlurFilter.DEFAULT_OPTIONS, ...options };

        const gpuProgram = GpuProgram.from({
            vertex: {
                source: wgslVertex,
                entryPoint: 'mainVertex',
            },
            fragment: {
                source,
                entryPoint: 'mainFragment',
            },
        });

        const glProgram = GlProgram.from({
            vertex,
            fragment,
            name: 'motion-blur-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                motionBlurUniforms: {
                    uVelocity: { value: { x: 0, y: 0 }, type: 'vec2<f32>' },
                    uKernelSize: { value: Math.trunc(options.kernelSize ?? 5), type: 'i32' },
                    uOffset: { value: options.offset, type: 'f32' },
                }
            },
        });

        this.uniforms = this.resources.motionBlurUniforms.uniforms;

        Object.assign(this, options);
    }

    /**
     * Sets the velocity of the motion for blur effect
     * This should be a size 2 array or an object containing `x` and `y` values, you cannot change types
     * once defined in the constructor
     * @default {x:0,y:0}
     */
    get velocity(): PointData { return this.uniforms.uVelocity; }
    set velocity(value: PointData | number[])
    {
        if (Array.isArray(value))
        {
            value = { x: value[0], y: value[1] };
        }

        this.uniforms.uVelocity = value;
        this._updateDirty();
    }

    /**
     * Sets the velocity of the motion for blur effect on the `x` axis
     * @default 0
     */
    get velocityX(): number { return this.velocity.x; }
    set velocityX(value: number)
    {
        this.velocity.x = value;
        this._updateDirty();
    }

    /**
     * Sets the velocity of the motion for blur effect on the `x` axis
     * @default 0
     */
    get velocityY(): number { return this.velocity.y; }
    set velocityY(value: number)
    {
        this.velocity.y = value;
        this._updateDirty();
    }

    /**
     * The kernelSize of the blur filter. Must be odd number >= 5
     * @default 5
     */
    get kernelSize(): number { return this._kernelSize; }
    set kernelSize(value: number)
    {
        this._kernelSize = value;
        this._updateDirty();
    }

    /**
     * The offset of the blur filter
     * @default 0
     */
    get offset(): number { return this.uniforms.uOffset; }
    set offset(value: number) { this.uniforms.uOffset = value; }

    private _updateDirty()
    {
        // The padding will be increased as the velocity and intern the blur size is changed
        this.padding = (Math.max(Math.abs(this.velocityX), Math.abs(this.velocityY)) >> 0) + 1;
        this.uniforms.uKernelSize = (this.velocityX !== 0 || this.velocityY !== 0) ? this._kernelSize : 0;
    }
}
