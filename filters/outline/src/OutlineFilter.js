import {vertex} from '@tools/fragments';
import fragment from './outline.frag';
import * as PIXI from 'pixi.js';

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
 * @param {number} [color=0x000000] The color of the outline.
 * @param {number} [quality=0.1] The quality of the outline from `0` to `1`, using a higher quality
 *        setting will result in slower performance and more accuracy.
 *
 * @example
 *  someSprite.shader = new OutlineFilter(9, 0xFF0000);
 */
export default class OutlineFilter extends PIXI.Filter {

    constructor(thickness = 1, color = 0x000000, quality = 0.1) {
        const samples =  Math.max(
            quality * OutlineFilter.MAX_SAMPLES,
            OutlineFilter.MIN_SAMPLES
        );
        const angleStep = (Math.PI * 2 / samples).toFixed(7);

        super(vertex, fragment.replace(/\$\{angleStep\}/, angleStep));
        this.uniforms.thickness = new Float32Array([0, 0]);

        /**
         * The thickness of the outline.
         * @member {number}
         * @default 1
         */
        this.thickness = thickness;

        this.uniforms.outlineColor = new Float32Array([0, 0, 0, 1]);
        this.color = color;

        this.quality = quality;
    }

    apply(filterManager, input, output, clear) {
        this.uniforms.thickness[0] = this.thickness / input.size.width;
        this.uniforms.thickness[1] = this.thickness / input.size.height;

        filterManager.applyFilter(this, input, output, clear);
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
}

/**
 * The minimum number of samples for rendering outline.
 * @static
 * @member {number} MIN_SAMPLES
 * @memberof PIXI.filters.OutlineFilter
 * @default 1
 */
OutlineFilter.MIN_SAMPLES = 1;

/**
 * The maximum number of samples for rendering outline.
 * @static
 * @member {number} MAX_SAMPLES
 * @memberof PIXI.filters.OutlineFilter
 * @default 100
 */
OutlineFilter.MAX_SAMPLES = 100;
