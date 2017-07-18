var glslify  = require('glslify');

/**
 * ColorReplaceFilter, originally by mishaa, updated by timetocode
 * http://www.html5gamedevs.com/topic/10640-outline-a-sprite-change-certain-colors/?p=69966
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param originalColor {number|number[]} The color that will be changed, as a 3 component RGB e.g. [1.0, 1.0, 1.0]
 * @param newColor {number|number[]} The resulting color, as a 3 component RGB e.g. [1.0, 0.5, 1.0]
 * @param epsilon {float} Tolerance/sensitivity of the floating-point comparison between colors (lower = more exact, higher = more inclusive)
 *
 * @example
 *  // replaces true red with true blue
 *  someSprite.filters = [new ColorReplaceFilter(
 *   [1, 0, 0],
 *   [0, 0, 1],
 *   0.001
 *   )];
 *  // replaces the RGB color 220, 220, 220 with the RGB color 225, 200, 215
 *  someOtherSprite.filters = [new ColorReplaceFilter(
 *   [220/255.0, 220/255.0, 220/255.0],
 *   [225/255.0, 200/255.0, 215/255.0],
 *   0.001
 *   )];
 *  // replaces the RGB color 220, 220, 220 with the RGB color 225, 200, 215
 *  someOtherSprite.filters = [new ColorReplaceFilter(0xdcdcdc, 0xe1c8d7, 0.001)];
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
            var arr = this.uniforms.originalColor;
            if (typeof value === "number") {
                PIXI.utils.hex2rgb(value, arr);
                this._originalColor = value;
            } else {
                arr[0] = value[0];
                arr[1] = value[1];
                arr[2] = value[2];
                this._originalColor = PIXI.utils.rgb2hex(arr);
            }
        },
        get: function() {
            return this._originalColor;
        }
    },
    newColor: {
        set: function (value) {
			var arr = this.uniforms.newColor;
			if (typeof value === "number") {
				PIXI.utils.hex2rgb(value, arr);
				this._newColor = value;
			} else {
				arr[0] = value[0];
				arr[1] = value[1];
				arr[2] = value[2];
				this._newColor = PIXI.utils.rgb2hex(arr);
			}
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
