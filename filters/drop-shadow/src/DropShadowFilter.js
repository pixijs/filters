import {KawaseBlurFilter} from '@pixi/filter-kawase-blur';
import {vertex} from '@tools/fragments';
import fragment from './dropshadow.frag';
import * as PIXI from 'pixi.js';

/**
 * Drop shadow filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/drop-shadow.png)
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {object} [options] Filter options
 * @param {number} [options.rotation=45] The angle of the shadow in degrees.
 * @param {number} [options.distance=5] Distance of shadow
 * @param {number} [options.color=0x000000] Color of the shadow
 * @param {number} [options.alpha=0.5] Alpha of the shadow
 * @param {number} [options.shadowOnly=false] Whether render shadow only
 * @param {number} [options.blur=2] - Sets the strength of the Blur properties simultaneously
 * @param {number} [options.quality=3] - The quality of the Blur filter.
 * @param {number[]} [options.kernels=null] - The kernels of the Blur filter.
 * @param {number|number[]|PIXI.Point} [options.pixelSize=1] - the pixelSize of the Blur filter.
 * @param {number} [options.resolution=PIXI.settings.RESOLUTION] - The resolution of the Blur filter.
 */
export default class DropShadowFilter extends PIXI.Filter {
    constructor(options) {

        // Fallback support for ctor: (rotation, distance, blur, color, alpha)
        if (options && options.constructor !== Object) {
            // eslint-disable-next-line no-console
            console.warn('DropShadowFilter now uses options instead of (rotation, distance, blur, color, alpha)');
            options = { rotation: options };
            if (arguments[1] !== undefined) {
                options.distance = arguments[1];
            }
            if (arguments[2] !== undefined) {
                options.blur = arguments[2];
            }
            if (arguments[3] !== undefined) {
                options.color = arguments[3];
            }
            if (arguments[4] !== undefined) {
                options.alpha = arguments[4];
            }
        }

        options = Object.assign({
            rotation: 45,
            distance: 5,
            color: 0x000000,
            alpha: 0.5,
            shadowOnly: false,
            kernels: null,
            blur: 2,
            quality: 3,
            pixelSize: 1,
            resolution: PIXI.settings.RESOLUTION,
        }, options);

        super();

        const { kernels, blur, quality, pixelSize, resolution } = options;

        this._tintFilter = new PIXI.Filter(vertex, fragment);
        this._tintFilter.uniforms.color = new Float32Array(4);
        this._tintFilter.resolution = resolution;
        this._blurFilter = kernels ?
            new KawaseBlurFilter(kernels) :
            new KawaseBlurFilter(blur, quality);

        this.pixelSize = pixelSize;
        this.resolution = resolution;

        this.targetTransform = new PIXI.Matrix();

        const { shadowOnly, rotation, distance, alpha, color } = options;

        this.shadowOnly = shadowOnly;
        this.rotation = rotation;
        this.distance = distance;
        this.alpha = alpha;
        this.color = color;

        this._updatePadding();
    }

    apply(filterManager, input, output, clear) {
        const target = filterManager.getRenderTarget();

        target.transform = this.targetTransform;
        this._tintFilter.apply(filterManager, input, target, true);
        target.transform = null;

        this._blurFilter.apply(filterManager, target, output);

        if (this.shadowOnly !== true) {
            filterManager.applyFilter(this, input, output, clear);
        }

        filterManager.returnRenderTarget(target);
    }

    /**
     * Recalculate the proper padding amount.
     * @private
     */
    _updatePadding() {
        this.padding = this.distance + (this.blur * 2);
    }

    /**
     * Update the transform matrix of offset angle.
     * @private
     */
    _updateTargetTransform() {
        this.targetTransform.tx = this.distance * Math.cos(this.angle);
        this.targetTransform.ty = this.distance * Math.sin(this.angle);
    }

    /**
     * The resolution of the filter.
     *
     * @member {number}
     * @default PIXI.settings.RESOLUTION
     */
    get resolution() {
        return this._resolution;
    }
    set resolution(value) {
        this._resolution = value;

        if (this._tintFilter) {
            this._tintFilter.resolution = value;
        }
        if (this._blurFilter) {
            this._blurFilter.resolution = value;
        }
    }

    /**
     * Distance offset of the shadow
     * @member {number}
     * @default 5
     */
    get distance() {
        return this._distance;
    }
    set distance(value) {
        this._distance = value;
        this._updatePadding();
        this._updateTargetTransform();
    }

    /**
     * The angle of the shadow in degrees
     * @member {number}
     * @default 2
     */
    get rotation() {
        return this.angle / PIXI.DEG_TO_RAD;
    }
    set rotation(value) {
        this.angle = value * PIXI.DEG_TO_RAD;
        this._updateTargetTransform();
    }

    /**
     * The alpha of the shadow
     * @member {number}
     * @default 1
     */
    get alpha() {
        return this._tintFilter.uniforms.alpha;
    }
    set alpha(value) {
        this._tintFilter.uniforms.alpha = value;
    }

    /**
     * The color of the shadow.
     * @member {number}
     * @default 0x000000
     */
    get color() {
        return PIXI.utils.rgb2hex(this._tintFilter.uniforms.color);
    }
    set color(value) {
        PIXI.utils.hex2rgb(value, this._tintFilter.uniforms.color);
    }

    /**
     * Sets the kernels of the Blur Filter
     *
     * @member {number[]}
     */
    get kernels() {
        return this._blurFilter.kernels;
    }
    set kernels(value) {
        this._blurFilter.kernels = value;
    }

    /**
     * The blur of the shadow
     * @member {number}
     * @default 2
     */
    get blur() {
        return this._blurFilter.blur;
    }
    set blur(value) {
        this._blurFilter.blur = value;
        this._updatePadding();
    }

    /**
     * Sets the quality of the Blur Filter
     *
     * @member {number}
     * @default 4
     */
    get quality() {
        return this._blurFilter.quality;
    }
    set quality(value) {
        this._blurFilter.quality = value;
    }

    /**
     * Sets the pixelSize of the Kawase Blur filter
     *
     * @member {number|number[]|PIXI.Point}
     * @default 1
     */
    get pixelSize() {
        return this._blurFilter.pixelSize;
    }
    set pixelSize(value) {
        this._blurFilter.pixelSize = value;
    }
}
