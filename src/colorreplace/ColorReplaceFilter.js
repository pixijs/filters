var glslify  = require('glslify');

/**
 * ColorReplaceFilter, originally by mishaa, updated by timetocode
 * http://www.html5gamedevs.com/topic/10640-outline-a-sprite-change-certain-colors/?p=69966
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param originalColor {FloatArray32} The color that will be changed, as a 3 component RGB e.g. new Float32Array(1.0, 1.0, 1.0)
 * @param newColor {FloatArray32} The resulting color, as a 3 component RGB e.g. new Float32Array(1.0, 0.5, 1.0)
 * @param epsilon {float} Tolerance/sensitivity of the floating-point comparison between colors (lower = more exact, higher = more inclusive)
 *
 * @example
 *  // replaces true red with true blue
 *  someSprite.shader = new ColorReplaceFilter(
 *   new Float32Array([1, 0, 0]),
 *   new Float32Array([0, 0, 1]),
 *   0.001
 *  );
 *  // replaces the RGB color 220, 220, 220 with the RGB color 225, 200, 215
 *  someOtherSprite.shader = new ColorReplaceFilter(
 *   new Float32Array([220/255.0, 220/255.0, 220/255.0]),
 *   new Float32Array([225/255.0, 200/255.0, 215/255.0]),
 *   0.001
 *  );
 *
 */
function ColorReplaceFilter(originalColor, newColor, epsilon) {
    PIXI.Filter.call(this,
        // vertex shader
        // vertex shader
        glslify('./colorReplace.vert'),
        // fragment shader
        glslify('./colorReplace.frag')
    );

    this.originalColor = originalColor || 0xFF0000;
    this.newColor = newColor || 0x000000;
    this.epsilon = epsilon || 1;
}

ColorReplaceFilter.prototype = Object.create(PIXI.Filter.prototype);
ColorReplaceFilter.prototype.constructor = ColorReplaceFilter;
module.exports = ColorReplaceFilter;

Object.defineProperties(ColorReplaceFilter.prototype, {
    originalColor: {
        set: function (value) {
            this._originalColor = value;
            var r = ((value & 0xFF0000) >> 16) / 255;
            var g = ((value & 0x00FF00) >> 8) / 255;
            var b = (value & 0x0000FF) / 255;
            this.uniforms.originalColor = {
                x: r,
                y: g,
                z: b
            };
        },
        get: function() {
            return this._originalColor;
        }
    },
    newColor: {
        set: function (value) {
            this._newColor = value;
            var r = ((value & 0xFF0000) >> 16) / 255;
            var g = ((value & 0x00FF00) >> 8) / 255;
            var b = (value & 0x0000FF) / 255;
            this.uniforms.newColor = {
                x: r,
                y: g,
                z: b
            };
        },
        get: function() {
            return this._newColor;
        }
    },
    epsilon: {
        set: function (value) {
            this.uniforms.epsilon = value;
        },
        get: function() {
            return this.uniforms.epsilon;
        }
    }
});
