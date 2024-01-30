// eslint-disable-next-line camelcase
import { deprecation, Filter, GlProgram, GpuProgram, v8_0_0 } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './radial-blur.frag';
import source from './radial-blur.wgsl';

import type { PointData } from 'pixi.js';

type DeprecatedPointLike = PointData | number[];

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
    center?: PointData;
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
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
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

    constructor(options?: RadialBlurFilterOptions);
    /**
     * @deprecated since 8.0.0
     *
     * @param {number} [angle=0] - Sets the angle of the motion for blur effect.
     * @param {PIXI.Point|number[]} [center=[0,0]] - The center of the radial.
     * @param {number} [kernelSize=5] - The kernelSize of the blur filter. Must be odd number >= 3
     * @param {number} [radius=-1] - The maximum size of the blur radius, `-1` is infinite
     */
    constructor(angle?: number, center?: DeprecatedPointLike, kernelSize?: number, radius?: number);
    constructor(...args: [RadialBlurFilterOptions?] | [number?, DeprecatedPointLike?, number?, number?])
    {
        let options = args[0] ?? {};

        if (typeof options === 'number')
        {
            // eslint-disable-next-line max-len
            deprecation(v8_0_0, 'RadialBlurFilter constructor params are now options object. See params: { angle, center, kernelSize, radius }');

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
            name: 'radial-blur-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                radialBlurUniforms: {
                    uRadian: { value: 0, type: 'f32' },
                    uCenter: { value: options.center, type: 'vec2<f32>' },
                    uKernelSize: { value: options.kernelSize, type: 'f32' },
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
    set center(value: PointData | DeprecatedPointLike)
    {
        if (Array.isArray(value))
        {
            deprecation(v8_0_0, 'RadialBlurFilter.center now only accepts {x,y} PointData.');
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
