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
 * @param {number} [quality=0.1] The quality of the outline. It's from 0.0 to 1.0
 *
 * @example
 *  someSprite.shader = new OutlineFilter(9, 0xFF0000);
 */

const MIN_SAMPLE = 1;
const MAX_SAMPLE = 100;

export default class OutlineFilter extends PIXI.Filter {

    constructor(thickness = 1, color = 0x000000, quality = 0.1) {
        const sample =  Math.max(quality * MAX_SAMPLE, MIN_SAMPLE);

        super(vertex,
            fragment.replace(/%ANGLE_STEP%/gi, (Math.PI * 2 / sample).toFixed(7))
        );

        this.uniforms.thickness = new Float32Array([0, 0]);
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

// Export to PixiJS namespace
PIXI.filters.OutlineFilter = OutlineFilter;
