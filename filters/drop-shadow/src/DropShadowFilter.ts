import { KawaseBlurFilter } from '@pixi/filter-kawase-blur';
import { vertex } from '@tools/fragments';
import fragment from './dropshadow.frag';
import { Filter } from '@pixi/core';
import { settings } from '@pixi/settings';
import { DEG_TO_RAD, Point } from '@pixi/math';
import { rgb2hex, hex2rgb } from '@pixi/utils';
import type { FilterSystem, RenderTexture } from '@pixi/core';
import type { CLEAR_MODES } from '@pixi/constants';
import type { IPoint } from '@pixi/math';

type PixelSizeValue = number | number[] | IPoint;

interface DropShadowFilterOptions {
    rotation: number;
    distance: number;
    color: number;
    alpha: number;
    shadowOnly: boolean;
    blur: number;
    quality: number;
    kernels: number[];
    pixelSize: PixelSizeValue;
    resolution: number;
}

/**
 * Drop shadow filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/drop-shadow.png)
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-drop-shadow|@pixi/filter-drop-shadow}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
class DropShadowFilter extends Filter
{
    /**
     * Hide the contents, only show the shadow.
     *
     * @member {boolean}
     * @default false
     */
    public shadowOnly: boolean;

    /**
     * Angle of the shadow in degrees.
     *
     * @member {number}
     * @default 45
     */
    public angle = 45;

    private _distance = 5;
    private _resolution: number = settings.FILTER_RESOLUTION;
    private _tintFilter: Filter;
    private _blurFilter: KawaseBlurFilter;

    /**
     * @param {object} [options] Filter options
     * @param {number} [options.rotation=45] The angle of the shadow in degrees.
     * @param {number} [options.distance=5] Distance of shadow
     * @param {number} [options.color=0x000000] Color of the shadow
     * @param {number} [options.alpha=0.5] Alpha of the shadow
     * @param {boolean} [options.shadowOnly=false] Whether render shadow only
     * @param {number} [options.blur=2] - Sets the strength of the Blur properties simultaneously
     * @param {number} [options.quality=3] - The quality of the Blur filter.
     * @param {number[]} [options.kernels=null] - The kernels of the Blur filter.
     * @param {number|number[]|PIXI.Point} [options.pixelSize=1] - the pixelSize of the Blur filter.
     * @param {number} [options.resolution=PIXI.settings.FILTER_RESOLUTION] - The resolution of the Blur filter.
     */
    constructor(options?: Partial<DropShadowFilterOptions>)
    {
        super();

        const opt: DropShadowFilterOptions = Object.assign({
            rotation: 45,
            distance: 5,
            color: 0x000000,
            alpha: 0.5,
            shadowOnly: false,
            kernels: null,
            blur: 2,
            quality: 3,
            pixelSize: 1,
            resolution: settings.FILTER_RESOLUTION,
        }, options);

        const { kernels, blur, quality, pixelSize, resolution } = opt;

        this._tintFilter = new Filter(vertex, fragment);
        this._tintFilter.uniforms.color = new Float32Array(4);
        this._tintFilter.uniforms.shift = new Point();
        this._tintFilter.resolution = resolution;
        this._blurFilter = kernels
            ? new KawaseBlurFilter(kernels)
            : new KawaseBlurFilter(blur, quality);

        this.pixelSize = pixelSize;
        this.resolution = resolution;

        const { shadowOnly, rotation, distance, alpha, color } = opt;

        this.shadowOnly = shadowOnly;
        this.rotation = rotation;
        this.distance = distance;
        this.alpha = alpha;
        this.color = color;

        this._updatePadding();
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
        this.padding = this.distance + (this.blur * 2);
    }

    /**
     * Update the transform matrix of offset angle.
     * @private
     */
    private _updateShift()
    {
        this._tintFilter.uniforms.shift.set(
            this.distance * Math.cos(this.angle),
            this.distance * Math.sin(this.angle),
        );
    }

    /**
     * The resolution of the filter.
     *
     * @member {number}
     * @default PIXI.settings.FILTER_RESOLUTION
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
     * @member {number}
     * @default 5
     */
    get distance(): number
    {
        return this._distance;
    }
    set distance(value: number)
    {
        this._distance = value;
        this._updatePadding();
        this._updateShift();
    }

    /**
     * The angle of the shadow in degrees
     * @member {number}
     * @default 2
     */
    get rotation(): number
    {
        return this.angle / DEG_TO_RAD;
    }
    set rotation(value: number)
    {
        this.angle = value * DEG_TO_RAD;
        this._updateShift();
    }

    /**
     * The alpha of the shadow
     * @member {number}
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
     * @member {number}
     * @default 0x000000
     */
    get color(): number
    {
        return rgb2hex(this._tintFilter.uniforms.color);
    }
    set color(value: number)
    {
        hex2rgb(value, this._tintFilter.uniforms.color);
    }

    /**
     * Sets the kernels of the Blur Filter
     *
     * @member {number[]}
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
     * @member {number}
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
     *
     * @member {number}
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
