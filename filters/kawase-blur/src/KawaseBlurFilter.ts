import { vertex } from '@tools/fragments';
import fragment from './kawase-blur.frag';
import fragmentClamp from './kawase-blur-clamp.frag';
import { Filter, Point } from '@pixi/core';
import type { IPoint, CLEAR_MODES, FilterSystem, RenderTexture } from '@pixi/core';

type PixelSizeValue = IPoint | number[] | number;

/**
 * A much faster blur than Gaussian blur, but more complicated to use.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/kawase-blur.png)
 *
 * @see https://software.intel.com/en-us/blogs/2014/07/15/an-investigation-of-fast-real-time-gpu-based-image-blur-algorithms
 * @class
 * @extends PIXI.Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-kawase-blur|@pixi/filter-kawase-blur}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
class KawaseBlurFilter extends Filter
{
    private _pixelSize: Point;
    private _clamp: boolean;
    private _kernels: number[] = [];
    private _blur = 4;
    private _quality = 3;

    /**
     * @param {number|number[]} [blur=4] - The blur of the filter. Should be greater than `0`. If
     *        value is an Array, setting kernels.
     * @param {number} [quality=3] - The quality of the filter. Should be an integer greater than `1`.
     * @param {boolean} [clamp=false] - Clamp edges, useful for removing dark edges
     *        from fullscreen filters or bleeding to the edge of filterArea.
     */
    constructor(blur: number | number[] = 4, quality = 3, clamp = false)
    {
        super(vertex, clamp ? fragmentClamp : fragment);
        this.uniforms.uOffset = new Float32Array(2);

        this._pixelSize = new Point();
        this.pixelSize = 1;
        this._clamp = clamp;

        // if `blur` is array , as kernels
        if (Array.isArray(blur))
        {
            this.kernels = blur;
        }
        else
        {
            this._blur = blur;
            this.quality = quality;
        }
    }

    /**
     * Overrides apply
     * @private
     */
    apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clear: CLEAR_MODES): void
    {
        const uvX = this._pixelSize.x / input._frame.width;
        const uvY = this._pixelSize.y / input._frame.height;
        let offset;

        if (this._quality === 1 || this._blur === 0)
        {
            offset = this._kernels[0] + 0.5;
            this.uniforms.uOffset[0] = offset * uvX;
            this.uniforms.uOffset[1] = offset * uvY;
            filterManager.applyFilter(this, input, output, clear);
        }
        else
        {
            const renderTarget = filterManager.getFilterTexture();

            let source = input;
            let target = renderTarget;
            let tmp;

            const last = this._quality - 1;

            for (let i = 0; i < last; i++)
            {
                offset = this._kernels[i] + 0.5;
                this.uniforms.uOffset[0] = offset * uvX;
                this.uniforms.uOffset[1] = offset * uvY;
                filterManager.applyFilter(this, source, target, 1);

                tmp = source;
                source = target;
                target = tmp;
            }
            offset = this._kernels[last] + 0.5;
            this.uniforms.uOffset[0] = offset * uvX;
            this.uniforms.uOffset[1] = offset * uvY;
            filterManager.applyFilter(this, source, output, clear);

            filterManager.returnFilterTexture(renderTarget);
        }
    }

    private _updatePadding()
    {
        this.padding = Math.ceil(this._kernels.reduce((acc, v) => acc + v + 0.5, 0));
    }

    /**
     * Auto generate kernels by blur & quality
     * @private
     */
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

    /**
     * The kernel size of the blur filter, for advanced usage.
     * @default [0]
     */
    get kernels(): number[]
    {
        return this._kernels;
    }
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
            // if value is invalid , set default value
            this._kernels = [0];
            this._quality = 1;
        }
    }

    /**
     * Get the if the filter is clampped.
     *
     * @readonly
     * @default false
     */
    get clamp(): boolean
    {
        return this._clamp;
    }

    /**
     * Sets the pixel size of the filter. Large size is blurrier. For advanced usage.
     *
     * @member {PIXI.Point|number[]}
     * @default [1, 1]
     */
    set pixelSize(value: PixelSizeValue)
    {
        if (typeof value === 'number')
        {
            this._pixelSize.x = value;
            this._pixelSize.y = value;
        }
        else if (Array.isArray(value))
        {
            this._pixelSize.x = value[0];
            this._pixelSize.y = value[1];
        }
        else if (value instanceof Point)
        {
            this._pixelSize.x = value.x;
            this._pixelSize.y = value.y;
        }
        else
        {
            // if value is invalid , set default value
            this._pixelSize.x = 1;
            this._pixelSize.y = 1;
        }
    }
    get pixelSize(): PixelSizeValue
    {
        return this._pixelSize;
    }

    /**
     * The quality of the filter, integer greater than `1`.
     * @default 3
     */
    get quality(): number
    {
        return this._quality;
    }
    set quality(value: number)
    {
        this._quality = Math.max(1, Math.round(value));
        this._generateKernels();
    }

    /**
     * The amount of blur, value greater than `0`.
     * @default 4
     */
    get blur(): number
    {
        return this._blur;
    }
    set blur(value: number)
    {
        this._blur = value;
        this._generateKernels();
    }
}

export { KawaseBlurFilter };
export type { PixelSizeValue };
