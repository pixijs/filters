import {vertex} from '@tools/fragments';
import fragment from './outline.frag';

/**
 * OutlineFilter, originally by mishaa
 * http://www.html5gamedevs.com/topic/10640-outline-a-sprite-change-certain-colors/?p=69966
 * http://codepen.io/mishaa/pen/emGNRB<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/outline.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [thickness=1] The tickness of the outline. Make it 2 times more for resolution 2
 * @param {number} [color=0x000000] The color of the glow.
 *
 * @example
 *  someSprite.shader = new OutlineFilter(9, 0xFF0000);
 */
export default class OutlineFilter extends PIXI.Filter {

    constructor(thickness = 1, color = 0x000000) {
        super(vertex, fragment.replace(/%THICKNESS%/gi, (1.0 / thickness).toFixed(7)));
        this.thickness = thickness;
        this.uniforms.outlineColor = new Float32Array([0, 0, 0, 1]);
        this.color = color;
    }

    /**
     * The color of the glow.
     * @member {number}
     * @default 0x000000
     */
    get color() {
        return PIXI.utils.rgb2hex(this.uniforms.outlineColor);
    }
    set color(value) {
        PIXI.utils.hex2rgb(value, this.uniforms.outlineColor);
    }

    /**
     * The tickness of the outline. Make it 2 times more for resolution 2
     * @member {number}
     * @default 1
     */
    get thickness() {
        return this.uniforms.thickness;
    }
    set thickness(value) {
        this.uniforms.thickness = value;
    }
}

// Export to PixiJS namespace
PIXI.filters.OutlineFilter = OutlineFilter;

