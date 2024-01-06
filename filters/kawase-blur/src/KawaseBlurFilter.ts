import { Filter, GlProgram, GpuProgram, TexturePool } from 'pixi.js';
import fragment from './kawase-blur.frag';
import source from './kawase-blur.wgsl';
import fragmentClamp from './kawase-blur-clamp.frag';
import sourceClamp from './kawase-blur-clamp.wgsl';
import { vertex, wgslVertex } from '@tools/fragments';

import type { FilterSystem, PointData, RenderSurface, Texture } from 'pixi.js';

export interface KawaseBlurFilterOptions
{
    /**
     * The blur of the filter. Should be greater than `0`.
     * If value is an Array, setting kernels.
     * @default 4
     */
    strength?: number | [number, number];
    /**
     * The quality of the filter. Should be an integer greater than `1`
     * @default 3
     */
    quality?: number;
    /**
     * Clamp edges, useful for removing dark edges from fullscreen filters or bleeding to the edge of filterArea.
     * @default false
     */
    clamp?: boolean;
    /**
     * Sets the pixel size of the filter. Large size is blurrier. For advanced usage.
     * @default {x:1,y:1}
     */
    pixelSize?: PointData;
}

/**
 * A much faster blur than Gaussian blur, but more complicated to use.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/kawase-blur.png)
 *
 * @see https://software.intel.com/en-us/blogs/2014/07/15/an-investigation-of-fast-real-time-gpu-based-image-blur-algorithms
 * @class
 * @extends Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-kawase-blur|@pixi/filter-kawase-blur}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export class KawaseBlurFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: KawaseBlurFilterOptions = {
        strength: 4,
        quality: 3,
        clamp: false,
        pixelSize: { x: 1, y: 1 },
    };

    public uniforms: {
        uOffset: Float32Array;
    };

    private _pixelSize = { x: 0, y: 0 };
    private _clamp: boolean;
    private _kernels: number[] = [];
    private _blur!: number;
    private _quality!: number;

    constructor(options?: KawaseBlurFilterOptions)
    {
        options = { ...KawaseBlurFilter.DEFAULT_OPTIONS, ...options };

        const gpuProgram = new GpuProgram({
            vertex: {
                source: wgslVertex,
                entryPoint: 'mainVertex',
            },
            fragment: {
                source: options?.clamp ? sourceClamp : source,
                entryPoint: 'mainFragment',
            },
        });
        const glProgram = new GlProgram({
            vertex,
            fragment: options?.clamp ? fragmentClamp : fragment,
            name: 'kawase-blur-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                kawaseBlurUniforms: {
                    uOffset: { value: new Float32Array(2), type: 'vec2<f32>' },
                }
            },
        });

        this.uniforms = this.resources.kawaseBlurUniforms.uniforms;

        this._pixelSize = options.pixelSize ?? { x: 1, y: 1 };

        if (Array.isArray(options.strength))
        {
            this.kernels = options.strength;
        }
        else if (typeof options.strength === 'number')
        {
            this._blur = options.strength;
            this.quality = options.quality ?? 3;
        }

        this._clamp = !!options.clamp;
    }

    /**
     * Override existing apply method in `Filter`
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
        const uvX = this.pixelSizeX / input.source.width;
        const uvY = this.pixelSizeY / input.source.height;
        let offset;

        if (this._quality === 1 || this._blur === 0)
        {
            offset = this._kernels[0] + 0.5;
            this.uniforms.uOffset[0] = offset * uvX;
            this.uniforms.uOffset[1] = offset * uvY;
            filterManager.applyFilter(this, input, output, clearMode);
        }
        else
        {
            const renderTarget = TexturePool.getSameSizeTexture(input);

            let source = input;
            let target = renderTarget;
            let tmp;

            const last = this._quality - 1;

            for (let i = 0; i < last; i++)
            {
                offset = this._kernels[i] + 0.5;
                this.uniforms.uOffset[0] = offset * uvX;
                this.uniforms.uOffset[1] = offset * uvY;
                filterManager.applyFilter(this, source, target, true);

                tmp = source;
                source = target;
                target = tmp;
            }

            offset = this._kernels[last] + 0.5;
            this.uniforms.uOffset[0] = offset * uvX;
            this.uniforms.uOffset[1] = offset * uvY;

            filterManager.applyFilter(this, source, output, clearMode);
            TexturePool.returnTexture(renderTarget);
        }
    }

    /**
      * The amount of blur, value greater than `0`.
      * @default 4
      */
    get strength(): number { return this._blur; }
    set strength(value: number)
    {
        this._blur = value;
        this._generateKernels();
    }

    /**
      * The quality of the filter, integer greater than `1`.
      * @default 3
      */
    get quality(): number { return this._quality; }
    set quality(value: number)
    {
        this._quality = Math.max(1, Math.round(value));
        this._generateKernels();
    }

    /**
      * The kernel size of the blur filter, for advanced usage
      * @default [0]
      */
    get kernels(): number[] { return this._kernels; }
    set kernels(value: number[])
    {
        if (Array.isArray(value) && value.length > 0)
        {
            this._kernels = value;
            this._quality = value.length;
            this._blur = Math.max(...value);
        }
        else
        {
            // If value is invalid, set default value
            this._kernels = [0];
            this._quality = 1;
        }
    }

    /**
      * The size of the pixels. Large size is blurrier. For advanced usage.
      * @default {x:1,y:1}
      */
    get pixelSize(): PointData { return this._pixelSize; }
    set pixelSize(value: PointData) { this._pixelSize = value; }

    /**
      * The size of the pixels on the `x` axis. Large size is blurrier. For advanced usage.
      * @default 1
      */
    get pixelSizeX(): number { return this.pixelSize.x; }
    set pixelSizeX(value: number) { this.pixelSize.x = value; }

    /**
      * The size of the pixels on the `y` axis. Large size is blurrier. For advanced usage.
      * @default 1
      */
    get pixelSizeY(): number { return this.pixelSize.y; }
    set pixelSizeY(value: number) { this.pixelSize.y = value; }

    /**
      * Get the if the filter is clamped
      * @default false
      */
    get clamp(): boolean { return this._clamp; }

    /** Update padding based on kernel data */
    private _updatePadding()
    {
        this.padding = Math.ceil(this._kernels.reduce((acc, v) => acc + v + 0.5, 0));
    }

    /** Auto generate kernels by blur & quality */
    private _generateKernels()
    {
        const blur = this._blur;
        const quality = this._quality;
        const kernels: number[] = [blur];

        if (blur > 0)
        {
            let k = blur;
            const step = blur / quality;

            for (let i = 1; i < quality; i++)
            {
                k -= step;
                kernels.push(k);
            }
        }

        this._kernels = kernels;
        this._updatePadding();
    }
}
