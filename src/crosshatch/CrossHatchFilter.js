var glslify  = require('glslify');

/**
 * A Cross Hatch effect filter.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 */
function CrossHatchFilter()
{
    PIXI.Filter.call(this,
        // vertex shader
        glslify('../fragments/default.vert'),
        // fragment shader
        glslify('./crosshatch.frag')
    );
}

CrossHatchFilter.prototype = Object.create(PIXI.Filter.prototype);
CrossHatchFilter.prototype.constructor = CrossHatchFilter;
module.exports = CrossHatchFilter;
