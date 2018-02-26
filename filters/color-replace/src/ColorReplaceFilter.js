import {vertex} from '@tools/fragments';
import fragment from './colorReplace.frag';
import * as PIXI from 'pixi.js';

/**
 * ColorReplaceFilter, originally by mishaa, updated by timetocode
 * http://www.html5gamedevs.com/topic/10640-outline-a-sprite-change-certain-colors/?p=69966<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/color-replace.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number|Array<number>} [originalColor=0xFF0000] The color that will be changed, as a 3 component RGB e.g. [1.0, 1.0, 1.0]
 * @param {number|Array<number>} [newColor=0x000000] The resulting color, as a 3 component RGB e.g. [1.0, 0.5, 1.0]
 * @param {number} [epsilon=0.4] Tolerance/sensitivity of the floating-point comparison between colors (lower = more exact, higher = more inclusive)
 *
 * @example
 *  // replaces true red with true blue
 *  someSprite.filters = [new ColorReplaceFilter(
 *   [1, 0, 0],
 *   [0, 0, 1],
 *   0.001
 *   )];
 *  // replaces the RGB color 220, 220, 220 with the RGB color 225, 200, 215
 *  someOtherSprite.filters = [new ColorReplaceFilter(
 *   [220/255.0, 220/255.0, 220/255.0],
 *   [225/255.0, 200/255.0, 215/255.0],
 *   0.001
 *   )];
 *  // replaces the RGB color 220, 220, 220 with the RGB color 225, 200, 215
 *  someOtherSprite.filters = [new ColorReplaceFilter(0xdcdcdc, 0xe1c8d7, 0.001)];
 *
 */
export default class ColorReplaceFilter extends PIXI.Filter {

    constructor(originalColor = 0xFF0000, newColor = 0x000000, epsilon = 0.4) {
        super(vertex, fragment);
        this.uniforms.originalColor = new Float32Array(3);
        this.uniforms.newColor = new Float32Array(3);
        this.originalColor = originalColor;
        this.newColor = newColor;
        this.epsilon = epsilon;
    }

    /**
     * The color that will be changed, as a 3 component RGB e.g. [1.0, 1.0, 1.0]
     * @member {number|Array<number>}
     * @default 0xFF0000
     */
    set originalColor(value) {
        let arr = this.uniforms.originalColor;
        if (typeof value === 'number') {
            PIXI.utils.hex2rgb(value, arr);
            this._originalColor = value;
        }
        else {
            arr[0] = value[0];
            arr[1] = value[1];
            arr[2] = value[2];
            this._originalColor = PIXI.utils.rgb2hex(arr);
        }
    }
    get originalColor() {
        return this._originalColor;
    }

    /**
     * The resulting color, as a 3 component RGB e.g. [1.0, 0.5, 1.0]
     * @member {number|Array<number>}
     * @default 0x000000
     */
    set newColor(value) {
        let arr = this.uniforms.newColor;
        if (typeof value === 'number') {
            PIXI.utils.hex2rgb(value, arr);
            this._newColor = value;
        }
        else {
            arr[0] = value[0];
            arr[1] = value[1];
            arr[2] = value[2];
            this._newColor = PIXI.utils.rgb2hex(arr);
        }
    }
    get newColor() {
        return this._newColor;
    }

    /**
     * Tolerance/sensitivity of the floating-point comparison between colors (lower = more exact, higher = more inclusive)
     * @member {number}
     * @default 0.4
     */
    set epsilon(value) {
        this.uniforms.epsilon = value;
    }
    get epsilon() {
        return this.uniforms.epsilon;
    }
}

