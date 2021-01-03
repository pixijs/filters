import { vertex } from '@tools/fragments';
import fragment from './color-map.frag';
import { Filter, Texture, TextureSource } from '@pixi/core';
import { MIPMAP_MODES, SCALE_MODES } from '@pixi/constants';
import type { FilterSystem, RenderTexture } from '@pixi/core';
import type { CLEAR_MODES } from '@pixi/constants';

type ColorMapSource = TextureSource | Texture | null;

/**
 * The ColorMapFilter applies a color-map effect to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/color-map.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-color-map|@pixi/filter-color-map}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
class ColorMapFilter extends Filter
{
    /**
     * The mix from 0 to 1, where 0 is the original image and 1 is the color mapped image.
     * @member {number}
     */
    public mix = 1;

    private _size = 0;
    private _sliceSize = 0;
    private _slicePixelSize = 0;
    private _sliceInnerSize = 0;
    private _nearest = false;
    private _scaleMode: SCALE_MODES | null = null;
    private _colorMap: Texture | null = null;

    /**
     * @param {HTMLImageElement|HTMLCanvasElement|PIXI.BaseTexture|PIXI.Texture} [colorMap] - The colorMap texture of the filter.
     * @param {boolean} [nearest=false] - Whether use NEAREST for colorMap texture.
     * @param {number} [mix=1] - The mix from 0 to 1, where 0 is the original image and 1 is the color mapped image.
     */
    constructor(colorMap: ColorMapSource, nearest = false, mix = 1)
    {
        super(vertex, fragment);

        this._scaleMode = null;
        this.nearest = nearest;
        this.mix = mix;
        this.colorMap = colorMap;
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clear?: CLEAR_MODES): void
    {
        this.uniforms._mix = this.mix;

        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * the size of one color slice
     * @member {number}
     * @readonly
     */
    get colorSize(): number
    {
        return this._size;
    }

    /**
     * the colorMap texture
     * @member {PIXI.Texture}
     */
    get colorMap(): ColorMapSource
    {
        return this._colorMap;
    }
    set colorMap(colorMap: ColorMapSource)
    {
        if (!colorMap)
        {
            return;
        }
        if (!(colorMap instanceof Texture))
        {
            colorMap = Texture.from(colorMap);
        }
        if ((colorMap as Texture)?.baseTexture)
        {
            colorMap.baseTexture.scaleMode = this._scaleMode as SCALE_MODES;
            colorMap.baseTexture.mipmap = MIPMAP_MODES.OFF;

            this._size = colorMap.height;
            this._sliceSize = 1 / this._size;
            this._slicePixelSize = this._sliceSize / this._size;
            this._sliceInnerSize = this._slicePixelSize * (this._size - 1);

            this.uniforms._size = this._size;
            this.uniforms._sliceSize = this._sliceSize;
            this.uniforms._slicePixelSize = this._slicePixelSize;
            this.uniforms._sliceInnerSize = this._sliceInnerSize;

            this.uniforms.colorMap = colorMap;
        }

        this._colorMap = colorMap;
    }

    /**
     * Whether use NEAREST for colorMap texture.
     * @member {boolean}
     */
    get nearest(): boolean
    {
        return this._nearest;
    }
    set nearest(nearest: boolean)
    {
        this._nearest = nearest;
        this._scaleMode = nearest ? SCALE_MODES.NEAREST : SCALE_MODES.LINEAR;

        const texture = this._colorMap;

        if (texture && texture.baseTexture)
        {
            texture.baseTexture._glTextures = {};

            texture.baseTexture.scaleMode = this._scaleMode;
            texture.baseTexture.mipmap = MIPMAP_MODES.OFF;

            texture._updateID++;
            texture.baseTexture.emit('update', texture.baseTexture);
        }
    }

    /**
     * If the colorMap is based on canvas , and the content of canvas has changed,
     *   then call `updateColorMap` for update texture.
     */
    updateColorMap()
    {
        const texture = this._colorMap;

        if (texture && texture.baseTexture)
        {
            texture._updateID++;
            texture.baseTexture.emit('update', texture.baseTexture);

            this.colorMap = texture;
        }
    }

    /**
     * Destroys this filter
     *
     * @param {boolean} [destroyBase=false] Whether to destroy the base texture of colorMap as well
     */
    destroy(destroyBase = false)
    {
        if (this._colorMap)
        {
            this._colorMap.destroy(destroyBase);
        }
        super.destroy();
    }
}

export { ColorMapFilter };

