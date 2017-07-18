var glslify  = require('glslify');

/**
 * GlowFilter, originally by mishaa
 * http://www.html5gamedevs.com/topic/12756-glow-filter/?hl=mishaa#entry73578
 * http://codepen.io/mishaa/pen/raKzrm
 *
 * @class
 * 
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [distance=10] The distance of the glow. Make it 2 times more for resolution=2. It cant be changed after filter creation
 * @param {number} [outerStrength=4] The strength of the glow outward from the edge of the sprite.
 * @param {number} [innerStrength=0] The strength of the glow inward from the edge of the sprite.
 * @param {number} [color=0xffffff] The color of the glow.
 * @param {number} [quality=0.1] A number between 0 and 1 that describes the quality of the glow.
 *
 * @example
 *  someSprite.filters = [
 *      new GlowFilter(15, 2, 1, 0xFF0000, 0.5)
 *  ];
 */
function GlowFilter(distance, outerStrength, innerStrength, color, quality) {

    // default
    distance = distance || 10;
    outerStrength = outerStrength || 4;
    innerStrength = innerStrength || 0;
    quality = quality || 0.1;
    color = color || 0xffffff;

    PIXI.Filter.call(this,
        // vertex shader
        // vertex shader
        glslify('./glow.vert'),
        // fragment shader
        glslify('./glow.frag')
            .replace(/%QUALITY_DIST%/gi, '' + (1 / quality / distance).toFixed(7))
            .replace(/%DIST%/gi, '' + distance.toFixed(7))
    );

    this.uniforms.glowColor = new Float32Array([0, 0, 0, 1]);

    quality = Math.pow(quality, 1/3);
    this.uniforms.distance.value *= quality;

    this.distance = distance;
    this.quality = quality;
    this.color = color;
    this.outerStrength = outerStrength;
    this.innerStrength = innerStrength;
}

GlowFilter.prototype = Object.create(PIXI.Filter.prototype);
GlowFilter.prototype.constructor = GlowFilter;
module.exports = GlowFilter;

Object.defineProperties(GlowFilter.prototype, {
    color: {
        get: function () {
            return PIXI.utils.rgb2hex(this.uniforms.glowColor);
        },
        set: function(value) {
            PIXI.utils.hex2rgb(value, this.uniforms.glowColor);
        }
    },
    distance: {
        get: function () {
            return this.uniforms.distance;
        },
        set: function (value) {
            this.uniforms.distance = value;
        }
    },
    outerStrength: {
        get: function () {
            return this.uniforms.outerStrength;
        },
        set: function (value) {
            this.uniforms.outerStrength = value;
        }
    },
    innerStrength: {
        get: function () {
            return this.uniforms.innerStrength;
        },
        set: function (value) {
            this.uniforms.innerStrength = value;
        }
    }
});
