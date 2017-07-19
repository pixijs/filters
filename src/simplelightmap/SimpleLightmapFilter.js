import vertex from './simpleLightmap.vert';
import fragment from './simpleLightmap.frag';

/**
* SimpleLightmap, originally by Oza94
* http://www.html5gamedevs.com/topic/20027-pixijs-simple-lightmapping/
* http://codepen.io/Oza94/pen/EPoRxj
*
* @class
* @extends PIXI.Filter
* @memberof PIXI.filters
* @param {PIXI.Texture} lightmapTexture a texture where your lightmap is rendered
* @param {Array<number>} ambientColor An RGBA array of the ambient color
* @param {Array<number>} [resolution=[1, 1]] An array for X/Y resolution
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

    constructor(lightmapTexture, ambientColor, resolution = [1, 1]) {    
        super(vertex, fragment);
        this.uniforms.u_lightmap = lightmapTexture;
        this.uniforms.resolution = new Float32Array(resolution);
        this.uniforms.ambientColor =  new Float32Array(ambientColor);
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

    /**
     * An array for X/Y resolution
     * @member {Array<number>}
     */
    get resolution() {
        return this.uniforms.resolution;
    }
    set resolution(value) {
        this.uniforms.resolution = new Float32Array(value);
    }
}
