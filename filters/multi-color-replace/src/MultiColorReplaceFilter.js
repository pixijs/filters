import {vertex} from '@tools/fragments';
import fragment from './multi-color-replace.frag';
import * as PIXI from 'pixi.js';

/**
 * Filter for replacing a color with another color. Similar to ColorReplaceFilter, but support multiple
 * colors.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/multi-color-replace.png)
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {Array<Array>} replacements - The collection of replacement items. Each item is color-pair (an array length is 2).
 *                       In the pair, the first value is original color , the second value is target color.
 * @param {number} [epsilon=0.05] - Tolerance of the floating-point comparison between colors
 *                                  (lower = more exact, higher = more inclusive)
 * @param {number} [maxColors] - The maximum number of replacements filter is able to use. Because the
 *                               fragment is only compiled once, this cannot be changed after construction.
 *                               If omitted, the default value is the length of `replacements`.
 *
 * @example
 *  // replaces pure red with pure blue, and replaces pure green with pure white
 *  someSprite.filters = [new MultiColorReplaceFilter(
 *    [
 *      [0xFF0000, 0x0000FF],
 *      [0x00FF00, 0xFFFFFF]
 *    ],
 *    0.001
 *  )];
 *
 *  You also could use [R, G, B] as the color
 *  someOtherSprite.filters = [new MultiColorReplaceFilter(
 *    [
 *      [ [1,0,0], [0,0,1] ],
 *      [ [0,1,0], [1,1,1] ]
 *    ],
 *    0.001
 *  )];
 *
 */
export default class MultiColorReplaceFilter extends PIXI.Filter {
    constructor(replacements, epsilon = 0.05, maxColors = null) {
        maxColors = maxColors || replacements.length;

        super(vertex, fragment.replace(/%maxColors%/g, maxColors));

        this.epsilon = epsilon;
        this._maxColors = maxColors;
        this._replacements = null;
        this.uniforms.originalColors = new Float32Array(maxColors * 3);
        this.uniforms.targetColors = new Float32Array(maxColors * 3);
        this.replacements = replacements;
    }

    /**
     * The source and target colors for replacement. See constructor for information on the format.
     *
     * @member {Array<Array>}
     */
    set replacements(replacements) {
        const originals = this.uniforms.originalColors;
        const targets = this.uniforms.targetColors;
        const colorCount = replacements.length;

        if (colorCount > this._maxColors) {
            throw `Length of replacements (${colorCount}) exceeds the maximum colors length (${this._maxColors})`;
        }

        // Fill with negative values
        originals[colorCount * 3] = -1;

        for (let i = 0; i < colorCount; i++) {
            const pair = replacements[i];

            // for original colors
            let color = pair[0];
            if (typeof color === 'number') {
                color = PIXI.utils.hex2rgb(color);
            }
            else {
                pair[0] = PIXI.utils.rgb2hex(color);
            }

            originals[i * 3] = color[0];
            originals[(i * 3) + 1] = color[1];
            originals[(i * 3) + 2] = color[2];

            // for target colors
            let targetColor = pair[1];
            if (typeof targetColor === 'number') {
                targetColor = PIXI.utils.hex2rgb(targetColor);
            }
            else {
                pair[1] = PIXI.utils.rgb2hex(targetColor);
            }

            targets[i * 3] = targetColor[0];
            targets[(i * 3) + 1] = targetColor[1];
            targets[(i * 3) + 2] = targetColor[2];
        }

        this._replacements = replacements;
    }
    get replacements() {
        return this._replacements;
    }

    /**
     * Should be called after changing any of the contents of the replacements.
     * This is a convenience method for resetting the `replacements`.
     */
    refresh() {
        this.replacements = this._replacements;
    }

    /**
     * The maximum number of color replacements supported by this filter. Can be changed
     * _only_ during construction.
     *
     * @member {number}
     * @readonly
     */
    get maxColors() {
        return this._maxColors;
    }

    /**
     * Tolerance of the floating-point comparison between colors (lower = more exact, higher = more inclusive)
     *
     * @member {number}
     * @default 0.05
     */
    set epsilon(value) {
        this.uniforms.epsilon = value;
    }
    get epsilon() {
        return this.uniforms.epsilon;
    }
}
