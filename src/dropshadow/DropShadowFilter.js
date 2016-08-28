var BlurXFilter = PIXI.filters.BlurXFilter,
    BlurYTintFilter = require('./BlurYTintFilter');

/**
 * The DropShadowFilter applies a Gaussian blur to an object.
 * The strength of the blur can be set for x- and y-axis separately.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 */
function DropShadowFilter()
{
    PIXI.Filter.call(this);

    this.blurXFilter = new BlurXFilter();
    this.blurYTintFilter = new BlurYTintFilter();

    this.defaultFilter = new PIXI.Filter();

    this.padding = 30;

    this._dirtyPosition = true;
    this._angle = 90 * Math.PI / 180;
    this._distance = 10;
    this.alpha = 0.75;
    this.hideObject = false;
    this.blendMode = PIXI.BLEND_MODES.MULTIPLY;
}

DropShadowFilter.prototype = Object.create(PIXI.Filter.prototype);
DropShadowFilter.prototype.constructor = DropShadowFilter;
module.exports = DropShadowFilter;

DropShadowFilter.prototype.apply = function (filterManager, input, output)
{
    var renderTarget = filterManager.getRenderTarget(true);

    //TODO - copyTexSubImage2D could be used here?
    if(this._dirtyPosition)
    {
        this._dirtyPosition = false;

        this.blurYTintFilter.uniforms.offset[0] = Math.sin(this._angle) * this._distance;
        this.blurYTintFilter.uniforms.offset[1] = Math.cos(this._angle) * this._distance;
    }

    this.blurXFilter.apply(filterManager, input, renderTarget);

    // renderer.blendModeManager.setBlendMode(this.blendMode);

    this.blurYTintFilter.apply(filterManager, renderTarget, output);

    // renderer.blendModeManager.setBlendMode(PIXI.BLEND_MODES.NORMAL);

    if(!this.hideObject)
    {
        this.defaultFilter.apply(filterManager, input, output);
    }
    
    
    filterManager.returnRenderTarget(renderTarget);
};

Object.defineProperties(DropShadowFilter.prototype, {
    /**
     * Sets the strength of both the blurX and blurY properties simultaneously
     *
     * @member {number}
     * @memberOf PIXI.filters.DropShadowFilter#
     * @default 2
     */
    blur: {
        get: function ()
        {
            return this.blurXFilter.blur;
        },
        set: function (value)
        {
            this.blurXFilter.blur = this.blurYTintFilter.blur = value;
        }
    },

    /**
     * Sets the strength of the blurX property
     *
     * @member {number}
     * @memberOf PIXI.filters.DropShadowFilter#
     * @default 2
     */
    blurX: {
        get: function ()
        {
            return this.blurXFilter.blur;
        },
        set: function (value)
        {
            this.blurXFilter.blur = value;
        }
    },

    /**
     * Sets the strength of the blurY property
     *
     * @member {number}
     * @memberOf PIXI.filters.DropShadowFilter#
     * @default 2
     */
    blurY: {
        get: function ()
        {
            return this.blurYTintFilter.blur;
        },
        set: function (value)
        {
            this.blurYTintFilter.blur = value;
        }
    },

    /**
     * Sets the color of the shadow
     *
     * @member {number}
     * @memberOf PIXI.filters.DropShadowFilter#
     */
    color: {
        get: function ()
        {
            return  PIXI.utils.rgb2hex( this.blurYTintFilter.uniforms.color.value );
        },
        set: function (value)
        {
            this.blurYTintFilter.uniforms.color.value = PIXI.utils.hex2rgb(value);
        }
    },

    /**
     * Sets the alpha of the shadow
     *
     * @member {number}
     * @memberOf PIXI.filters.DropShadowFilter#
     */
    alpha: {
        get: function ()
        {
            return  this.blurYTintFilter.uniforms.alpha.value;
        },
        set: function (value)
        {
            this.blurYTintFilter.uniforms.alpha.value = value;
        }
    },

    /**
     * Sets the distance of the shadow
     *
     * @member {number}
     * @memberOf PIXI.filters.DropShadowFilter#
     */
    distance: {
        get: function ()
        {
            return  this._distance;
        },
        set: function (value)
        {
            this._dirtyPosition = true;
            this._distance = value;
        }
    },

    /**
     * Sets the angle of the shadow
     *
     * @member {number}
     * @memberOf PIXI.filters.DropShadowFilter#
     */
    angle: {
        get: function ()
        {
            return  this._angle;
        },
        set: function (value)
        {
            this._dirtyPosition = true;
            this._angle = value;
        }
    }
});
