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
 * @param {boolean} [nearest=false] - Whether use NEAREST for colorMap texture.
 * @param {number} [mix=1] - The mix from 0 to 1, where 0 is the original image and 1 is the color mapped image.
 */
export default class ColorMapFilter extends PIXI.Filter {

    constructor(colorMap, nearest = false, mix = 1) {
        super(vertex, fragment);

        this._size = 0;
        this._sliceSize = 0;
        this._slicePixelSize = 0;
        this._sliceInnerSize = 0;

        this._scaleMode = null;
        this._nearest = false;
        this.nearest = nearest;

        /**
         * The mix from 0 to 1, where 0 is the original image and 1 is the color mapped image.
         * @member {number}
         */
        this.mix = mix;

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
     * @member {number}
     * @readonly
     */
    get colorSize() {
        return this._size;
    }

    /**
     * the colorMap texture
     * @member {PIXI.Texture}
     */
    get colorMap() {
        return this._colorMap;
    }
    set colorMap(colorMap) {
        if (!(colorMap instanceof PIXI.Texture)) {
            colorMap = PIXI.Texture.from(colorMap);
        }
        if (colorMap && colorMap.baseTexture) {
            colorMap.baseTexture.scaleMode = this._scaleMode;
            colorMap.baseTexture.mipmap = false;

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
