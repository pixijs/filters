import {vertex} from '@tools/fragments';
import fragment from './dropshadow.frag';
import * as PIXI from 'pixi.js';

/**
 * Drop shadow filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/drop-shadow.png)
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [rotation=45] The angle of the shadow in degrees.
 * @param {number} [distance=5] Distance of shadow
 * @param {number} [blur=2] Blur of the shadow
 * @param {number} [color=0x000000] Color of the shadow
 * @param {number} [alpha=0.5] Alpha of the shadow
 */
export default class DropShadowFilter extends PIXI.Filter {
    constructor(rotation = 45, distance = 5, blur = 2, color = 0x000000, alpha = 0.5) {
        super();

        this.tintFilter = new PIXI.Filter(vertex, fragment);
        this.blurFilter = new PIXI.filters.BlurFilter();
        this.blurFilter.blur = blur;

        this.targetTransform = new PIXI.Matrix();

        this.rotation = rotation;
        this.padding = distance;
        this.distance = distance;
        this.alpha = alpha;
        this.color = color;
    }

    apply(filterManager, input, output, clear) {
        const target = filterManager.getRenderTarget();

        target.transform = this.targetTransform;
        this.tintFilter.apply(filterManager, input, target, true);
        this.blurFilter.apply(filterManager, target, output);
        filterManager.applyFilter(this, input, output, clear);
        target.transform = null;
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
     * The blur of the shadow
     * @member {number}
     * @default 2
     */
    get blur() {
        return this.blurFilter.blur;
    }
    set blur(value) {
        this.blurFilter.blur = value;
        this._updatePadding();
    }

    /**
     * The alpha of the shadow
     * @member {number}
     * @default 1
     */
    get alpha() {
        return this.tintFilter.uniforms.alpha;
    }
    set alpha(value) {
        this.tintFilter.uniforms.alpha = value;
    }

    /**
     * The color of the shadow.
     * @member {number}
     * @default 0x000000
     */
    get color() {
        return PIXI.utils.rgb2hex(this.tintFilter.uniforms.color);
    }
    set color(value) {
        PIXI.utils.hex2rgb(value, this.tintFilter.uniforms.color);
    }
}
