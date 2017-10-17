import {vertex} from '@tools/fragments';
import fragment from './dropshadow.frag';

/**
 * Drop shadow filter.
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

        this.rotation = rotation;
        this.padding = distance;
        this.distance = distance;
        this.alpha = alpha;
        this.color = color;
    }

    apply(filterManager, input, output) {
        const target = filterManager.getRenderTarget();
        target.transform = new PIXI.Matrix();
        target.transform.translate(
            this.distance * Math.cos(this.angle),
            this.distance * Math.sin(this.angle)
        );
        this.tintFilter.apply(filterManager, input, target, true);
        this.blurFilter.apply(filterManager, target, output);
        super.apply(filterManager, input, output);
        target.transform = null;
        filterManager.returnRenderTarget(target);
    }

    updatePadding() {
        this.padding = this.distance + (this.blur * 2);
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
        this.updatePadding();
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
        this.updatePadding();
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

// Export to PixiJS namespace
PIXI.filters.DropShadowFilter = DropShadowFilter;

