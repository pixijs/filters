var glslify  = require('glslify');

/**
 * @author Julien CLEREL @JuloxRox
 * original filter https://github.com/evanw/glfx.js/blob/master/src/filters/warp/bulgepinch.js by Evan Wallace : http://madebyevan.com/
 */
 
/**
 * Bulges or pinches the image in a circle.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {PIXI.Point|Array<number>} [center=[0,0]] The x and y coordinates of the center of the circle of effect.
 * @param {number} [radius=100] The radius of the circle of effect.
 * @param {number} [strength=1] -1 to 1 (-1 is strong pinch, 0 is no effect, 1 is strong bulge)
 */

function BulgePinchFilter(center, radius, strength) {
    PIXI.Filter.call(this,
        // vertex shader
        glslify('./bulgePinch.vert'),
        // fragment shader
        glslify('./bulgePinch.frag')
    );

    this.center = center || [0.5, 0.5];
    this.radius = radius || 100;
    this.strength = strength || 1;
}

BulgePinchFilter.prototype = Object.create(PIXI.Filter.prototype);
BulgePinchFilter.prototype.constructor = BulgePinchFilter;
module.exports = BulgePinchFilter;

Object.defineProperties(BulgePinchFilter.prototype, {
    /**
     * The radius of the circle of effect.
     *
     * @property radius
     * @type Number
     */
    radius: {
        get: function ()
        {
            return this.uniforms.radius;
        },
        set: function (value)
        {
            this.uniforms.radius = value;
        }
    },
    /**
     * The strength of the effect. -1 to 1 (-1 is strong pinch, 0 is no effect, 1 is strong bulge)
     *
     * @property strength
     * @type Number
     */
    strength: {
        get: function ()
        {
            return this.uniforms.strength;
        },
        set: function (value)
        {
            this.uniforms.strength = value;
        }
    },
    /**
     * The x and y coordinates of the center of the circle of effect.
     *
     * @property center
     * @type Point
     */
    center: {
        get: function ()
        {
            return this.uniforms.center;
        },
        set: function (value)
        {
            this.uniforms.center = value;
        }
    }
});
