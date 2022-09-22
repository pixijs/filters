import { vertex } from '@tools/fragments';
import fragment from './simpleLightmap.frag';
import { Filter, utils } from '@pixi/core';
import type { Texture, FilterSystem, RenderTexture, CLEAR_MODES } from '@pixi/core';

type Color = number | number[];

/**
* SimpleLightmap, originally by Oza94
* http://www.html5gamedevs.com/topic/20027-pixijs-simple-lightmapping/
* http://codepen.io/Oza94/pen/EPoRxj
*
* You have to specify filterArea, or suffer consequences.
* You may have to use it with `filter.dontFit = true`,
*  until we rewrite this using same approach as for DisplacementFilter.
*
* ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/simple-lightmap.png)
* @class
* @extends PIXI.Filter
* @see {@link https://www.npmjs.com/package/@pixi/filter-simple-lightmap|@pixi/filter-simple-lightmap}
* @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
*
* @example
*  displayObject.filters = [new SimpleLightmapFilter(texture, 0x666666)];
*/
class SimpleLightmapFilter extends Filter
{
    private _color = 0x0;

    /**
     * @param {PIXI.Texture} texture - a texture where your lightmap is rendered
     * @param {Array<number>|number} [color=0x000000] - An RGBA array of the ambient color
     * @param {number} [alpha=1] - Default alpha set independent of color (if it's a number, not array).
     */
    constructor(texture: Texture, color: Color = 0x000000, alpha = 1)
    {
        super(vertex, fragment);
        this.uniforms.dimensions = new Float32Array(2);
        this.uniforms.ambientColor = new Float32Array([0, 0, 0, alpha]);
        this.texture = texture;
        this.color = color;
    }

    /**
     * Applies the filter.
     * @private
     * @param {PIXI.FilterManager} filterManager - The manager.
     * @param {PIXI.RenderTarget} input - The input target.
     * @param {PIXI.RenderTarget} output - The output target.
     */
    apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clear: CLEAR_MODES): void
    {
        this.uniforms.dimensions[0] = input.filterFrame?.width;
        this.uniforms.dimensions[1] = input.filterFrame?.height;

        // draw the filter...
        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * a texture where your lightmap is rendered
     * @member {PIXI.Texture}
     */
    get texture(): Texture
    {
        return this.uniforms.uLightmap;
    }
    set texture(value: Texture)
    {
        this.uniforms.uLightmap = value;
    }

    /**
     * An RGBA array of the ambient color or a hex color without alpha
     * @member {Array<number>|number}
     */
    set color(value: Color)
    {
        const arr = this.uniforms.ambientColor;

        if (typeof value === 'number')
        {
            utils.hex2rgb(value, arr);
            this._color = value;
        }
        else
        {
            arr[0] = value[0];
            arr[1] = value[1];
            arr[2] = value[2];
            arr[3] = value[3];
            this._color = utils.rgb2hex(arr);
        }
    }
    get color(): Color
    {
        return this._color;
    }

    /**
     * When setting `color` as hex, this can be used to set alpha independently.
     */
    get alpha(): number
    {
        return this.uniforms.ambientColor[3];
    }
    set alpha(value: number)
    {
        this.uniforms.ambientColor[3] = value;
    }
}

export { SimpleLightmapFilter };
