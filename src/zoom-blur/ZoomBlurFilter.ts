import { Filter, GlProgram, GpuProgram, PointData } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './zoom-blur.frag';
import source from './zoom-blur.wgsl';

/** Options for the ZoomBlurFilter constructor. */
export interface ZoomBlurFilterOptions
{
    /**
     * Sets the strength of the zoom blur effect
     * @default 0.1
     */
    strength?: number;
    /**
     * The `x` and `y` offset coordinates to change the position of the center of the circle of effect.
     * This should be a size 2 array or an object containing `x` and `y` values, you cannot change types
     * once defined in the constructor
     * @default {x:0,y:0}
     */
    center?: PointData | number[];
    /**
     * The inner radius of zoom. The part in inner circle won't apply zoom blur effect
     * @default 0
     */
    innerRadius?: number;
    /**
     * Outer radius of the effect. less than `0` equates to infinity
     * @default -1
     */
    radius?: number;
    /**
     * On older iOS devices, it's better to not go above `13.0`.
     * Decreasing this value will produce a lower-quality blur effect with more dithering
     * @default 32
     */
    maxKernelSize?: number;
}

/**
 * The ZoomFilter applies a Zoom blur to an object.<br>
 * ![original](../screenshots/original.png)![filter](../screenshots/zoom-blur.png)
 *
 * @class
 * @extends Filter
 */
export class ZoomBlurFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: ZoomBlurFilterOptions = {
        strength: 0.1,
        center: { x: 0, y: 0 },
        innerRadius: 0,
        radius: -1,
        maxKernelSize: 32,
    };

    public uniforms: {
        uStrength: number;
        uCenter: PointData;
        uRadii: Float32Array
    };

    /**
     * @param options - Options for the ZoomBlurFilter constructor.
     */
    constructor(options?: ZoomBlurFilterOptions)
    {
        options = { ...ZoomBlurFilter.DEFAULT_OPTIONS, ...options };

        const kernelSize = options.maxKernelSize ?? 32;

        const gpuProgram = GpuProgram.from({
            vertex: {
                source: wgslVertex,
                entryPoint: 'mainVertex',
            },
            fragment: {
                source: source.replace('${MAX_KERNEL_SIZE}', kernelSize.toFixed(1)),
                entryPoint: 'mainFragment',
            },
        });

        const glProgram = GlProgram.from({
            vertex,
            fragment: fragment.replace('${MAX_KERNEL_SIZE}', kernelSize.toFixed(1)),
            name: 'zoom-blur-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                zoomBlurUniforms: {
                    uStrength: { value: options.strength, type: 'f32' },
                    uCenter: { value: { x: 0, y: 0 }, type: 'vec2<f32>' },
                    uRadii: { value: new Float32Array(2), type: 'vec2<f32>' },
                }
            },
        });

        this.uniforms = this.resources.zoomBlurUniforms.uniforms;

        Object.assign(this, options);
    }

    /**
     * Sets the strength of the zoom blur effect
     * @default 0.1
     */
    get strength(): number { return this.uniforms.uStrength; }
    set strength(value: number) { this.uniforms.uStrength = value; }

    /**
     * The center of the zoom
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
     * The inner radius of zoom. The part in inner circle won't apply zoom blur effect
     * @default 0
     */
    get innerRadius(): number { return this.uniforms.uRadii[0]; }
    set innerRadius(value: number) { this.uniforms.uRadii[0] = value; }

    /**
     * Outer radius of the effect. less than `0` equates to infinity
     * @default -1
     */
    get radius(): number { return this.uniforms.uRadii[1]; }
    set radius(value: number) { this.uniforms.uRadii[1] = (value < 0 || value === Infinity) ? -1 : value; }
}
