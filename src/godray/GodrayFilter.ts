import { DEG_TO_RAD, Filter, GlProgram, GpuProgram } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './god-ray.frag';
import source from './god-ray.wgsl';
import perlin from './perlin.frag';
import sourcePerlin from './perlin.wgsl';

import type { FilterSystem, PointData, RenderSurface, Texture } from 'pixi.js';

/** Options for the GodrayFilter constructor. */
export interface GodrayFilterOptions
{
    /**
     * The angle/light-source of the rays in degrees. For instance,
     * a value of 0 is vertical rays, values of 90 or -90 produce horizontal rays.
     * @default 30
     */
    angle?: number;
    /**
     * `true` if light rays are parallel (uses angle), `false` to use the focal `center` point
     * @default true
     */
    parallel?: boolean;
    /**
     * Focal point for non-parallel rays, to use this `parallel` must be set to `false`.
     * This should be a size 2 array or an object containing `x` and `y` values, you cannot change types
     * once defined in the constructor
     * @default {x:0,y:0}
     */
    center?: PointData | number[];
    /**
     * General intensity of the effect. A value closer to 1 will produce a more intense effect,
     * where a value closer to 0 will produce a subtler effect.
     * @default 0.5
     */
    gain?: number;
    /**
     * The density of the fractal noise
     * @default 2.5
     */
    lacunarity?: number;
    /**
     * The current time position
     * @default 0
     */
    time?: number;
    /**
     * The alpha (opacity) of the rays.  0 is fully transparent, 1 is fully opaque.
     * @default 1
     */
    alpha?: number;
}

/**
 * GordayFilter, {@link https://codepen.io/alaingalvan originally} by Alain Galvan
 *
 *
 *
 * ![original](../screenshots/original.png)![filter](../screenshots/godray.gif)
 * @class
 * @extends Filter
 *
 * @example
 *  displayObject.filters = [new GodrayFilter()];
 */
export class GodrayFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: GodrayFilterOptions = {
        angle: 30,
        gain: 0.5,
        lacunarity: 2.5,
        parallel: true,
        time: 0,
        center: { x: 0, y: 0 },
        alpha: 1,
    };

    public uniforms: {
        uLight: Float32Array;
        uParallel: number;
        uAspect: number;
        uTime: number;
        uRay: Float32Array;
        uDimensions: Float32Array;
    };

    /**
     * The current time position
     * @default 0
     */
    public time = 0;

    private _angleLight: [number, number] = [0, 0];
    private _angle = 0;
    private _center!: PointData;

    /**
     * @param options - Options for the GodrayFilter constructor.
     */
    constructor(options?: GodrayFilterOptions)
    {
        options = { ...GodrayFilter.DEFAULT_OPTIONS, ...options };

        const gpuProgram = GpuProgram.from({
            vertex: {
                source: wgslVertex,
                entryPoint: 'mainVertex',
            },
            fragment: {
                source: source.replace('${PERLIN}', sourcePerlin),
                entryPoint: 'mainFragment',
            },
        });
        const glProgram = GlProgram.from({
            vertex,
            fragment: fragment.replace('${PERLIN}', perlin),
            name: 'god-ray-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                godrayUniforms: {
                    uLight: { value: new Float32Array(2), type: 'vec2<f32>' },
                    uParallel: { value: 0, type: 'f32' },
                    uAspect: { value: 0, type: 'f32' },
                    uTime: { value: options.time, type: 'f32' },
                    uRay: { value: new Float32Array(3), type: 'vec3<f32>' },
                    uDimensions: { value: new Float32Array(2), type: 'vec2<f32>' },
                }
            },
        });

        this.uniforms = this.resources.godrayUniforms.uniforms;

        Object.assign(this, options);
    }

    /**
     * Override existing apply method in Filter
     * @override
     * @ignore
     */
    public override apply(
        filterManager: FilterSystem,
        input: Texture,
        output: RenderSurface,
        clearMode: boolean
    ): void
    {
        const width = input.frame.width;
        const height = input.frame.height;

        this.uniforms.uLight[0] = this.parallel ? this._angleLight[0] : this._center.x;
        this.uniforms.uLight[1] = this.parallel ? this._angleLight[1] : this._center.y;
        this.uniforms.uDimensions[0] = width;
        this.uniforms.uDimensions[1] = height;
        this.uniforms.uAspect = height / width;
        this.uniforms.uTime = this.time;

        // draw the filter...
        filterManager.applyFilter(this, input, output, clearMode);
    }

    /**
     * The angle/light-source of the rays in degrees. For instance,
     * a value of 0 is vertical rays, values of 90 or -90 produce horizontal rays
     * @default 30
     */
    get angle(): number { return this._angle; }
    set angle(value: number)
    {
        this._angle = value;

        const radians = value * DEG_TO_RAD;

        this._angleLight[0] = Math.cos(radians);
        this._angleLight[1] = Math.sin(radians);
    }

    /**
     * `true` if light rays are parallel (uses angle), `false` to use the focal `center` point
     * @default true
     */
    get parallel(): boolean { return this.uniforms.uParallel > 0.5; }
    set parallel(value: boolean) { this.uniforms.uParallel = value ? 1 : 0; }

    /**
     * Focal point for non-parallel rays, to use this `parallel` must be set to `false`.
     * @default {x:0,y:0}
     */
    get center(): PointData { return this._center; }
    set center(value: PointData | number[])
    {
        if (Array.isArray(value))
        {
            value = { x: value[0], y: value[1] };
        }

        this._center = value;
    }

    /**
     * Focal point for non-parallel rays on the `x` axis, to use this `parallel` must be set to `false`.
     * @default 0
     */
    get centerX(): number { return this.center.x; }
    set centerX(value: number) { this.center.x = value; }

    /**
     * Focal point for non-parallel rays on the `y` axis, to use this `parallel` must be set to `false`.
     * @default 0
     */
    get centerY(): number { return this.center.y; }
    set centerY(value: number) { this.center.y = value; }

    /**
     * General intensity of the effect. A value closer to 1 will produce a more intense effect,
     * where a value closer to 0 will produce a subtler effect
     * @default 0.5
     */
    get gain(): number { return this.uniforms.uRay[0]; }
    set gain(value: number) { this.uniforms.uRay[0] = value; }

    /**
     * The density of the fractal noise.
     * A higher amount produces more rays and a smaller amount produces fewer waves
     * @default 2.5
     */
    get lacunarity(): number { return this.uniforms.uRay[1]; }
    set lacunarity(value: number) { this.uniforms.uRay[1] = value; }

    /**
     * The alpha (opacity) of the rays.  0 is fully transparent, 1 is fully opaque.
     * @default 1
     */
    get alpha(): number { return this.uniforms.uRay[2]; }
    set alpha(value: number) { this.uniforms.uRay[2] = value; }
}
