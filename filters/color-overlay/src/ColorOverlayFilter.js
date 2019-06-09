import {vertex} from '@tools/fragments';
import fragment from './colorOverlay.frag';
import {Filter} from '@pixi/core';
import {hex2rgb, rgb2hex} from '@pixi/utils';

/**
 * Replace all colors within a source graphic with a single color.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/color-overlay.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-color-replace|@pixi/filter-color-replace}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 * @param {number|Array<number>} [color=0x000000] The resulting color, as a 3 component RGB e.g. [1.0, 0.5, 1.0]
 *
 * @example
 *  // replaces red with blue
 *  someSprite.filters = [new ColorOverlayFilter(
 *   [1, 0, 0],
 *   [0, 0, 1],
 *   0.001
 *   )];
 *
 */
class ColorOverlayFilter extends Filter {

    constructor(color = 0x000000) {
        super(vertex, fragment);
        this.uniforms.color = new Float32Array(3);
        this.color = color;
    }

    /**
     * The resulting color, as a 3 component RGB e.g. [1.0, 0.5, 1.0]
     * @member {number|Array<number>}
     * @default 0x000000
     */
    set color(value) {
        let arr = this.uniforms.color;
        if (typeof value === 'number') {
            hex2rgb(value, arr);
            this._color = value;
        }
        else {
            arr[0] = value[0];
            arr[1] = value[1];
            arr[2] = value[2];
            this._color = rgb2hex(arr);
        }
    }
    get color() {
        return this._color;
    }
}

export { ColorOverlayFilter };
