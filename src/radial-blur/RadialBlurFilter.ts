import { deprecation, Filter, GlProgram, GpuProgram } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './radial-blur.frag';
import source from './radial-blur.wgsl';

import type { PointData } from 'pixi.js';

/** Options for the RadialBlurFilter constructor. */
export interface RadialBlurFilterOptions
{
    /**
     * Sets the angle of the motion for blur effect
     * @default 0
     */
    angle?: number;
    /**
     * The `x` and `y` offset coordinates to change the position of the center of the circle of effect.
     * This should be a size 2 array or an object containing `x` and `y` values, you cannot change types
     * once defined in the constructor
     * @default {x:0,y:0}
     */
    center?: PointData | number[];
    /**
     * The kernelSize of the blur filter. Must be odd number >= 3
     * @default 5
     */
    kernelSize?: number;
    /**
     * The maximum size of the blur radius, less than `0` equates to infinity
     * @default -1
     */
    radius?: number
}

/**
 * The RadialBlurFilter applies a Motion blur to an object.<br>
 * ![original](../screenshots/original.png)![filter](../screenshots/radial-blur.png)
 *
 * @class
 * @extends Filter
 */
export class RadialBlurFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: RadialBlurFilterOptions = {
        angle: 0,
        center: { x: 0, y: 0 },
        kernelSize: 5,
        radius: -1,
    };

    public uniforms: {
        uRadian: number;
        uCenter: PointData;
        uKernelSize: number;
        uRadius: number;
    };

    private _angle!: number;
    private _kernelSize!: number;

    /**
     * @param options - Options for the RadialBlurFilter constructor.
     */
    constructor(options?: RadialBlurFilterOptions);
    /**
     * @deprecated since 6.0.0
     *
     * @param {number} [angle=0] - Sets the angle of the motion for blur effect.
     * @param {PIXI.Point|number[]} [center=[0,0]] - The center of the radial.
     * @param {number} [kernelSize=5] - The kernelSize of the blur filter. Must be odd number >= 3
     * @param {number} [radius=-1] - The maximum size of the blur radius, `-1` is infinite
     */
    constructor(angle?: number, center?: PointData | number[], kernelSize?: number, radius?: number);
    /** @ignore */
    constructor(...args: [RadialBlurFilterOptions?] | [number?, (PointData | number[])?, number?, number?])
    {
        let options = args[0] ?? {};

        if (typeof options === 'number')
        {
            // eslint-disable-next-line max-len
            deprecation('6.0.0', 'RadialBlurFilter constructor params are now options object. See params: { angle, center, kernelSize, radius }');

            options = { angle: options };

            if (args[1])
            {
                const x = 'x' in args[1] ? args[1].x : args[1][0];
                const y = 'y' in args[1] ? args[1].y : args[1][1];

                options.center = { x, y };
            }
            if (args[2]) options.kernelSize = args[2];
            if (args[3]) options.radius = args[3];
        }

        options = { ...RadialBlurFilter.DEFAULT_OPTIONS, ...options };

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
            name: 'radial-blur-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                radialBlurUniforms: {
                    uRadian: { value: 0, type: 'f32' },
                    uCenter: { value: { x: 0, y: 0 }, type: 'vec2<f32>' },
                    uKernelSize: { value: options.kernelSize, type: 'i32' },
                    uRadius: { value: options.radius, type: 'f32' },
                }
            },
        });

        this.uniforms = this.resources.radialBlurUniforms.uniforms;

        Object.assign(this, options);
    }

    private _updateKernelSize()
    {
        this.uniforms.uKernelSize = this._angle !== 0 ? this.kernelSize : 0;
    }

    /**
     * Sets the angle in degrees of the motion for blur effect.
     * @default 0
     */
    get angle(): number { return this._angle; }
    set angle(value: number)
    {
        this._angle = value;
        this.uniforms.uRadian = value * Math.PI / 180;
        this._updateKernelSize();
    }

    /**
     * The `x` and `y` offset coordinates to change the position of the center of the circle of effect.
     * This should be a size 2 array or an object containing `x` and `y` values, you cannot change types
     * once defined in the constructor
     * @default {x:0,y:0}
     */
    get center(): PointData { return this.uniforms.uCenter; }
    set center(value: PointData | number[])
    {
        if (Array.isArray(value))
        {
            value = { x: value[0], y: value[1] };
        }

        this.uniforms.uCenter = value;
    }

    /**
     * Sets the velocity of the motion for blur effect on the `x` axis
     * @default 0
     */
    get centerX(): number { return this.center.x; }
    set centerX(value: number) { this.center.x = value; }

    /**
     * Sets the velocity of the motion for blur effect on the `x` axis
     * @default 0
     */
    get centerY(): number { return this.center.y; }
    set centerY(value: number) { this.center.y = value; }

    /**
     * The kernelSize of the blur filter. Must be odd number >= 3
     * @default 5
     */
    get kernelSize(): number { return this._kernelSize; }
    set kernelSize(value: number)
    {
        this._kernelSize = value;
        this._updateKernelSize();
    }

    /**
     * The maximum size of the blur radius, less than `0` equates to infinity
     * @default -1
     */
    get radius(): number { return this.uniforms.uRadius; }
    set radius(value: number) { this.uniforms.uRadius = value < 0 || value === Infinity ? -1 : value; }
}
