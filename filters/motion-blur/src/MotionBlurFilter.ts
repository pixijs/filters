import { vertex, wgslVertex } from '@tools/fragments';
import fragment from './motion-blur.frag';
import source from './motion-blur.wgsl';
import { Filter, GlProgram, GpuProgram } from 'pixi.js';
import type { PointData } from 'pixi.js';

export interface MotionBlurFilterOptions
{
    /**
     * Sets the velocity of the motion for blur effect
     * This should be a size 2 array or an object containing `x` and `y` values, you cannot change types
     * once defined in the constructor
     * @default {x:0,y:0}
     */
    velocity?: PointData;
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
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/motion-blur.png)
 *
 * @class
 * @extends Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-motion-blur|@pixi/filter-motion-blur}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
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

    constructor(options?: MotionBlurFilterOptions)
    {
        options = { ...MotionBlurFilter.DEFAULT_OPTIONS, ...options };

        const gpuProgram = new GpuProgram({
            vertex: {
                source: wgslVertex,
                entryPoint: 'mainVertex',
            },
            fragment: {
                source,
                entryPoint: 'mainFragment',
            },
        });

        const glProgram = new GlProgram({
            vertex,
            fragment,
            name: 'motion-blur-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                motionBlurUniforms: {
                    uVelocity: { value: options.velocity, type: 'vec2<f32>' },
                    uKernelSize: { value: Math.trunc(options.kernelSize ?? 5), type: 'f32' },
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
    set velocity(value: PointData)
    {
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
