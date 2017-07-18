var glslify  = require('glslify');

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
* @param {Array<number>} [resolution] An array for X/Y resolution
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
function SimpleLightmapFilter(lightmapTexture, ambientColor, resolution) {
    PIXI.Filter.call(this,
        // vertex shader
        // vertex shader
        glslify('./simpleLightmap.vert'),
        // fragment shader
        glslify('./simpleLightmap.frag')
    );
    this.uniforms.u_lightmap = lightmapTexture;
    this.uniforms.resolution = new Float32Array(resolution || [1.0, 1.0]);
    this.uniforms.ambientColor =  new Float32Array(ambientColor);
}

SimpleLightmapFilter.prototype = Object.create(PIXI.Filter.prototype);
SimpleLightmapFilter.prototype.constructor = SimpleLightmapFilter;

Object.defineProperties(SimpleLightmapFilter.prototype, {
    texture: {
        get: function () {
            return this.uniforms.u_lightmap;
        },
        set: function (value) {
            this.uniforms.u_lightmap = value;
        }
    },
    color: {
        get: function () {
            return this.uniforms.ambientColor;
        },
        set: function (value) {
            this.uniforms.ambientColor = new Float32Array(value);
        }
    },
    resolution: {
        get: function () {
            return this.uniforms.resolution;
        },
        set: function (value) {
            this.uniforms.resolution = new Float32Array(value);
        }
    }
});

module.exports = SimpleLightmapFilter;
