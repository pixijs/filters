import { Filter, GlProgram, GpuProgram } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './bulge-pinch.frag';
import source from './bulge-pinch.wgsl';

import type { FilterSystem, PointData, RenderSurface, Texture } from 'pixi.js';

// This WebGPU filter has been ported from the WebGL renderer that was originally created by Julien CLEREL (@JuloxRox)

/** Options for the BulgePinchFilter constructor. */
export interface BulgePinchFilterOptions
{
    /**
     * Offset coordinates to change the position of the center of the circle of effect.
     * @default {x:0,y:0}
     */
    center?: PointData | number[] | number;
    /**
     * The radius of the circle of effect
     * @default 100
     */
    radius?: number;
    /**
     * A value between -1 and 1 (-1 is strong pinch, 0 is no effect, 1 is strong bulge)
     * @default 1
     */
    strength?: number;
}

/**
 * Bulges or pinches the image in a circle.<br>
 * ![original](../screenshots/original.png)![filter](../screenshots/bulge-pinch.gif)
 *
 * @class
 * @extends Filter
 */
export class BulgePinchFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: BulgePinchFilterOptions = {
        center: { x: 0.5, y: 0.5 },
        radius: 100,
        strength: 1
    };

    public uniforms: {
        uDimensions: Float32Array;
        uCenter: PointData;
        uRadius: number;
        uStrength: number;
    };

    /**
     * @param options - Options for the BulgePinchFilter constructor.
     */
    constructor(options?: BulgePinchFilterOptions)
    {
        options = { ...BulgePinchFilter.DEFAULT_OPTIONS, ...options };

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
            name: 'bulge-pinch-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                bulgePinchUniforms: {
                    uDimensions: { value: [0, 0], type: 'vec2<f32>' },
                    uCenter: { value: { x: 0, y: 0 }, type: 'vec2<f32>' },
                    uRadius: { value: options.radius, type: 'f32' },
                    uStrength: { value: options.strength, type: 'f32' },
                }
            },
        });

        this.uniforms = this.resources.bulgePinchUniforms.uniforms;

        Object.assign(this, options);
    }

    /**
     * Override existing apply method in `Filter`
     * @override
     * @ignore
     */
    public apply(
        filterManager: FilterSystem,
        input: Texture,
        output: RenderSurface,
        clearMode: boolean
    ): void
    {
        this.uniforms.uDimensions[0] = input.frame.width;
        this.uniforms.uDimensions[1] = input.frame.height;

        filterManager.applyFilter(this, input, output, clearMode);
    }

    /**
     * Sets the center of the effect in normalized screen coords.
     * { x: 0, y: 0 } means top-left and { x: 1, y: 1 } mean bottom-right
     * @default {x:0.5,y:0.5}
     */
    get center(): PointData { return this.uniforms.uCenter; }
    set center(value: PointData | number[] | number)
    {
        if (typeof value === 'number')
        {
            value = { x: value, y: value };
        }

        if (Array.isArray(value))
        {
            value = { x: value[0], y: value[1] };
        }

        this.uniforms.uCenter = value;
    }

    /**
     * Sets the center of the effect in normalized screen coords on the `x` axis
     * @default 0
     */
    get centerX(): number { return this.uniforms.uCenter.x; }
    set centerX(value: number) { this.uniforms.uCenter.x = value; }

    /**
     * Sets the center of the effect in normalized screen coords on the `y` axis
     * @default 0
     */
    get centerY(): number { return this.uniforms.uCenter.y; }
    set centerY(value: number) { this.uniforms.uCenter.y = value; }

    /**
     * The radius of the circle of effect
     * @default 100
     */
    get radius(): number { return this.uniforms.uRadius; }
    set radius(value: number) { this.uniforms.uRadius = value; }

    /**
     * A value between -1 and 1 (-1 is strong pinch, 0 is no effect, 1 is strong bulge)
     * @default 1
     */
    get strength(): number { return this.uniforms.uStrength; }
    set strength(value: number) { this.uniforms.uStrength = value; }
}
