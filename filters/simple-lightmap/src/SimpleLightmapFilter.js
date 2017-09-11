import {vertex} from '@tools/fragments';
import fragment from './simpleLightmap.frag';

/**
* SimpleLightmap, originally by Oza94
* http://www.html5gamedevs.com/topic/20027-pixijs-simple-lightmapping/
* http://codepen.io/Oza94/pen/EPoRxj
*
* You have to specify filterArea, or suffer consequences.
* You may have to use it with "filter.dontFit=true",
*  until we rewrite this using same approach as for DisplacementFilter.
*
* @class
* @extends PIXI.Filter
* @memberof PIXI.filters
* @param {PIXI.Texture} lightmapTexture a texture where your lightmap is rendered
* @param {Array<number>} ambientColor An RGBA array of the ambient color
*
* @example
*  var lightmapTex = new PIXI.RenderTexture(renderer, 400, 300);
*
*  // ... render lightmap on lightmapTex
*
*  stageContainer.filters = [
*    new SimpleLightmapFilter(lightmapTex, [0.3, 0.3, 0.7, 0.5], [1.0, 1.0])
*  ];
*/
export default class SimpleLightmapFilter extends PIXI.Filter {

    constructor(lightmapTexture, ambientColor) {
        super(vertex, fragment);
        this.uniforms.uLightmap = lightmapTexture;
        this.uniforms.ambientColor =  new Float32Array(ambientColor);
    }

    /**
     * Applies the filter.
     *
     * @param {PIXI.FilterManager} filterManager - The manager.
     * @param {PIXI.RenderTarget} input - The input target.
     * @param {PIXI.RenderTarget} output - The output target.
     */
    apply(filterManager, input, output)
    {
        this.uniforms.dimensions[0] = input.sourceFrame.width;
        this.uniforms.dimensions[1] = input.sourceFrame.height;

        // draw the filter...
        filterManager.applyFilter(this, input, output);
    }


    /**
     * a texture where your lightmap is rendered
     * @member {PIXI.Texture}
     */
    get texture() {
        return this.uniforms.u_lightmap;
    }
    set texture(value) {
        this.uniforms.u_lightmap = value;
    }

    /**
     * An RGBA array of the ambient color
     * @member {Array<number>}
     */
    get color() {
        return this.uniforms.ambientColor;
    }
    set color(value) {
        this.uniforms.ambientColor = new Float32Array(value);
    }
}

// Export to PixiJS namespace
PIXI.filters.SimpleLightmapFilter = SimpleLightmapFilter;

