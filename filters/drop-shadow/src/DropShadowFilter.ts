import { KawaseBlurFilter } from '@pixi/filter-kawase-blur';
import { vertex } from '@tools/fragments';
import fragment from './dropshadow.frag';
import { Filter, DEG_TO_RAD, ObservablePoint, utils } from '@pixi/core';
import type { IPoint, CLEAR_MODES, FilterSystem, RenderTexture, IPointData } from '@pixi/core';

type PixelSizeValue = number | number[] | IPoint;

interface DropShadowFilterOptions
{
    /** @deprecated */
    rotation?: number;
    /** @deprecated */
    distance?: number;
    offset: IPointData;
    color: number;
    alpha: number;
    shadowOnly: boolean;
    blur: number;
    quality: number;
    kernels: number[] | null;
    pixelSize: PixelSizeValue;
    resolution: number;
}

/**
 * Drop shadow filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/drop-shadow.png)
 * @class
 * @extends PIXI.Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-drop-shadow|@pixi/filter-drop-shadow}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
class DropShadowFilter extends Filter
{
    /** Default constructor options. */
    public static readonly defaults: DropShadowFilterOptions = {
        offset: { x: 4, y: 4 },
        color: 0x000000,
        alpha: 0.5,
        shadowOnly: false,
        kernels: null,
        blur: 2,
        quality: 3,
        pixelSize: 1,
        resolution: 1,
    };

    /** Hide the contents, only show the shadow. */
    public shadowOnly: boolean;

    /**
     * Angle of the shadow in degrees
     * @deprecated since 5.3.0
     * @see DropShadowFilter#offset
     */
    public angle = 45;

    private _offset: ObservablePoint;
    private _distance = 5;
    private _tintFilter: Filter;
    private _blurFilter: KawaseBlurFilter;
    protected _resolution = 1;

    /**
     * @param {object} [options] - Filter options
     * @param {number} [options.offset={x: 4, y: 4}] - Offset of the shadow
     * @param {number} [options.color=0x000000] - Color of the shadow
     * @param {number} [options.alpha=0.5] - Alpha of the shadow
     * @param {boolean} [options.shadowOnly=false] - Whether render shadow only
     * @param {number} [options.blur=2] - Sets the strength of the Blur properties simultaneously
     * @param {number} [options.quality=3] - The quality of the Blur filter.
     * @param {number[]} [options.kernels=null] - The kernels of the Blur filter.
     * @param {number|number[]|PIXI.Point} [options.pixelSize=1] - the pixelSize of the Blur filter.
     * @param {number} [options.resolution=1] - The resolution of the Blur filter.
     */
    constructor(options?: Partial<DropShadowFilterOptions>)
    {
        super();

        const opt: DropShadowFilterOptions = options
            ? { ...DropShadowFilter.defaults, ...options }
            : DropShadowFilter.defaults;

        const { kernels, blur, quality, pixelSize, resolution } = opt;

        this._offset = new ObservablePoint(this._updatePadding, this);
        this._tintFilter = new Filter(vertex, fragment);
        this._tintFilter.uniforms.color = new Float32Array(4);
        this._tintFilter.uniforms.shift = this._offset;
        this._tintFilter.resolution = resolution;
        this._blurFilter = kernels
            ? new KawaseBlurFilter(kernels)
            : new KawaseBlurFilter(blur, quality);

        this.pixelSize = pixelSize;
        this.resolution = resolution;

        const { shadowOnly, rotation, distance, offset, alpha, color } = opt;

        this.shadowOnly = shadowOnly;

        // Check for deprecated options first
        if (rotation !== undefined && distance !== undefined)
        {
            this.rotation = rotation;
            this.distance = distance;
        }
        else
        {
            this.offset = offset;
        }

        this.alpha = alpha;
        this.color = color;
    }

    apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clear: CLEAR_MODES): void
    {
        const target = filterManager.getFilterTexture();

        this._tintFilter.apply(filterManager, input, target, 1);
        this._blurFilter.apply(filterManager, target, output, clear);

        if (this.shadowOnly !== true)
        {
            filterManager.applyFilter(this, input, output, 0);
        }

        filterManager.returnFilterTexture(target);
    }

    /**
     * Recalculate the proper padding amount.
     * @private
     */
    private _updatePadding()
    {
        const offsetPadding = Math.max(
            Math.abs(this._offset.x),
            Math.abs(this._offset.y)
        );

        this.padding = offsetPadding + (this.blur * 2);
    }

    /**
     * Update the transform matrix of offset angle.
     * @private
     * @deprecated
     */
    private _updateShift()
    {
        this._tintFilter.uniforms.shift.set(
            this.distance * Math.cos(this.angle),
            this.distance * Math.sin(this.angle),
        );
    }

    /**
     * Set the offset position of the drop-shadow relative to the original image.
     * @type {PIXI.IPointData}
     * @default {x: 4, y: 4}
     */
    public set offset(value: IPointData)
    {
        this._offset.copyFrom(value);
        this._updatePadding();
    }
    public get offset(): ObservablePoint
    {
        return this._offset;
    }

    /**
     * The resolution of the filter.
     * @default 1
     */
    get resolution(): number
    {
        return this._resolution;
    }
    set resolution(value: number)
    {
        this._resolution = value;

        if (this._tintFilter)
        {
            this._tintFilter.resolution = value;
        }
        if (this._blurFilter)
        {
            this._blurFilter.resolution = value;
        }
    }

    /**
     * Distance offset of the shadow
     * @default 5
     * @deprecated since 5.3.0
     * @see DropShadowFilter#offset
     */
    get distance(): number
    {
        return this._distance;
    }
    set distance(value: number)
    {
        utils.deprecation('5.3.0', 'DropShadowFilter distance is deprecated, use offset');
        this._distance = value;
        this._updatePadding();
        this._updateShift();
    }

    /**
     * The angle of the shadow in degrees
     * @deprecated since 5.3.0
     * @see DropShadowFilter#offset
     */
    get rotation(): number
    {
        return this.angle / DEG_TO_RAD;
    }
    set rotation(value: number)
    {
        utils.deprecation('5.3.0', 'DropShadowFilter rotation is deprecated, use offset');
        this.angle = value * DEG_TO_RAD;
        this._updateShift();
    }

    /**
     * The alpha of the shadow
     * @default 1
     */
    get alpha(): number
    {
        return this._tintFilter.uniforms.alpha;
    }
    set alpha(value: number)
    {
        this._tintFilter.uniforms.alpha = value;
    }

    /**
     * The color of the shadow.
     * @default 0x000000
     */
    get color(): number
    {
        return utils.rgb2hex(this._tintFilter.uniforms.color);
    }
    set color(value: number)
    {
        utils.hex2rgb(value, this._tintFilter.uniforms.color);
    }

    /**
     * Sets the kernels of the Blur Filter
     */
    get kernels(): number[]
    {
        return this._blurFilter.kernels;
    }
    set kernels(value: number[])
    {
        this._blurFilter.kernels = value;
    }

    /**
     * The blur of the shadow
     * @default 2
     */
    get blur(): number
    {
        return this._blurFilter.blur;
    }
    set blur(value: number)
    {
        this._blurFilter.blur = value;
        this._updatePadding();
    }

    /**
     * Sets the quality of the Blur Filter
     * @default 4
     */
    get quality(): number
    {
        return this._blurFilter.quality;
    }
    set quality(value: number)
    {
        this._blurFilter.quality = value;
    }

    /**
     * Sets the pixelSize of the Kawase Blur filter
     *
     * @member {number|number[]|PIXI.Point}
     * @default 1
     */
    get pixelSize(): PixelSizeValue
    {
        return this._blurFilter.pixelSize;
    }
    set pixelSize(value: PixelSizeValue)
    {
        this._blurFilter.pixelSize = value;
    }
}

export { DropShadowFilter };
export type { DropShadowFilterOptions };
