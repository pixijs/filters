import {vertex} from '@tools/fragments';
import fragment from './bevel.frag';
import * as PIXI from 'pixi.js';

/**
 * Bevel Filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/bevel.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [rotation = 45] The angle of the light in degrees.
 * @param {number} [thickness = 2] The tickness of the bevel.
 * @param {number} [lightColor = 0xffffff] Color of the light.
 * @param {number} [lightAlpha = 0.7] Alpha of the light.
 * @param {number} [shadowColor = 0x000000] Color of the shadow.
 * @param {number} [shadowAlpha = 0.7] Alpha of the shadow.
 */
export default class BevelFilter extends PIXI.Filter {
    constructor(rotation = 45, thickness = 2, lightColor = 0xffffff, lightAlpha = 0.7, shadowColor = 0x000000, shadowAlpha = 0.7){
        super(vertex, fragment);

        this.rotation = rotation;
        this.thickness = thickness;
        this.lightColor = lightColor;
        this.lightAlpha = lightAlpha;
        this.shadowColor = shadowColor;
        this.shadowAlpha = shadowAlpha;
    }

    /**
     * Update the transform matrix of offset angle.
     * @private
     */
    _updateTransform() {
        this.uniforms.transformX = this._thickness * Math.cos(this._angle);
        this.uniforms.transformY = this._thickness * Math.sin(this._angle);
    }

    /**
     * The angle of the light in degrees.
     * @member {number}
     * @default 45
     */
    get rotation() {
        return this._angle / PIXI.DEG_TO_RAD;
    }
    set rotation(value) {
        this._angle = value * PIXI.DEG_TO_RAD;
        this._updateTransform();
    }

    /**
     * The tickness of the bevel.
     * @member {number}
     * @default 2
     */
    get thickness() {
        return this._thickness;
    }
    set thickness(value) {
        this._thickness = value;
        this._updateTransform();
    }

    /**
     * The color of the light.
     * @member {number}
     * @default 0xffffff
     */
    get lightColor() {
        return PIXI.utils.rgb2hex(this.uniforms.lightColor);
    }
    set lightColor(value) {
        PIXI.utils.hex2rgb(value, this.uniforms.lightColor);
    }

    /**
     * The alpha of the light.
     * @member {number}
     * @default 0.7
     */
    get lightAlpha() {
        return this.uniforms.lightAlpha;
    }
    set lightAlpha(value) {
        this.uniforms.lightAlpha = value;
    }

    /**
     * The color of the shadow.
     * @member {number}
     * @default 0x000000
     */
    get shadowColor() {
        return PIXI.utils.rgb2hex(this.uniforms.shadowColor);
    }
    set shadowColor(value) {
        PIXI.utils.hex2rgb(value, this.uniforms.shadowColor);
    }

    /**
     * The alpha of the shadow.
     * @member {number}
     * @default 0.7
     */
    get shadowAlpha() {
        return this.uniforms.shadowAlpha;
    }
    set shadowAlpha(value) {
        this.uniforms.shadowAlpha = value;
    }
}
