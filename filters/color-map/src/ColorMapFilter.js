import {vertex} from '@tools/fragments';
import fragment from './color-map.frag';
import * as PIXI from 'pixi.js';

/**
 * The ColorMapFilter applies a color-map effect to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/color-map.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {HTMLImageElement|HTMLCanvasElement|PIXI.BaseTexture|PIXI.Texture} [colorMap] - The colorMap texture of the filter.
 * @param {booleane} [nearest=false] - Whether use NEAREST for colorMap texture.
 */
export default class ColorMapFilter extends PIXI.Filter {

    constructor(colorMap, nearest = false) {
        super(vertex, fragment);

        this._size = 0;
        this._sliceSize = 0;
        this._slicePixelSize = 0;
        this._sliceInnerSize = 0;

        this._scaleMode = null;
        this._nearest = false;
        this.nearest = nearest;

        /**
         * mix
         */
        this.mix = 1;

        this.colorMap = colorMap;
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        this.uniforms._mix = this.mix;

        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * the size of one color slice
     * @readonly
     */
    get colorSize() {
        return this._size;
    }

    /**
     * the colorMap texture
     */
    get colorMap() {
        return this._colorMap;
    }
    set colorMap(colorMap) {
        const texture = PIXI.Texture.from(colorMap);

        if (texture && texture.baseTexture) {
            texture.baseTexture.scaleMode = this._scaleMode;
            texture.baseTexture.mipmap = false;

            this._size = texture.height;
            this._sliceSize = 1 / this._size;
            this._slicePixelSize = this._sliceSize / this._size;
            this._sliceInnerSize = this._slicePixelSize * (this._size - 1);

            this.uniforms._size = this._size;
            this.uniforms._sliceSize = this._sliceSize;
            this.uniforms._slicePixelSize = this._slicePixelSize;
            this.uniforms._sliceInnerSize = this._sliceInnerSize;

            this.uniforms.colorMap = texture;
        }

        this._colorMap = texture;
    }

    /**
     * Whether use NEAREST for colorMap texture.
     */
    get nearest() {
        return this._nearest;
    }
    set nearest(nearest) {
        this._nearest = nearest;
        this._scaleMode = nearest ? PIXI.SCALE_MODES.NEAREST : PIXI.SCALE_MODES.LINEAR;

        const texture = this._colorMap;

        if (texture && texture.baseTexture) {
            texture.baseTexture._glTextures = {};

            texture.baseTexture.scaleMode = this._scaleMode;
            texture.baseTexture.mipmap = false;

            texture._updateID++;
            texture.baseTexture.emit('update', texture.baseTexture);
        }
    }

    /**
     * If the colorMap is based on canvas , and the content of canvas has changed,
     *   then call `updateColorMap` for update texture.
     */
    updateColorMap() {
        const texture = this._colorMap;

        if (texture && texture.baseTexture) {
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
    destroy(destroyBase) {
        if (this._colorMap) {
            this._colorMap.destroy(destroyBase);
        }
        super.destroy();
    }
}
