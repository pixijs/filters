import vertex from './multi-color-replace.vert.js';
import fragment from './multi-color-replace.frag.js';

/**
 * MultiColorReplaceFilter
 *
 * It's similar to ColorReplaceFilter , but support multi-color.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {Array<number>|Array<Array>} originalColors - The colors that will be changed
 * @param {Array<number>|Array<Array>} targetColors - The target colors
 * @param {number} [epsilon=0.05] - Tolerance/sensitivity of the floating-point comparison between colors
 *                                  (lower = more exact, higher = more inclusive)
 *
 * @example
 *  // replaces true red with true blue, and replaces true green with pure white
 *  someSprite.filters = [new MultiColorReplaceFilter(
 *   [0xFF0000, 0x00FF00],
 *   [0x0000FF, 0xFFFFFF],
 *   0.001
 *   )];
 *  You also could use [R, G, B] as the color
 *  someOtherSprite.filters = [new MultiColorReplaceFilter(
 *   [[1,0,0], [0,1,0]],
 *   [[0,0,1], [1,1,1]],
 *   0.001
 *   )];
 *
 */
export default class MultiColorReplaceFilter extends PIXI.Filter
{
    constructor(originalColors, targetColors, epsilon = 0.05)
    {
        const colorCount = Math.min(originalColors.length, targetColors.length);

        super(
            vertex,
            fragment.replace(/%colorCount%/g, colorCount)
        );

        this.epsilon = epsilon;
        this.colorCount = colorCount;

        this._originalColors = new Array(colorCount);
        this.uniforms.originalColors = new Float32Array(colorCount * 3);
        this.originalColors = originalColors;

        this._targetColors = new Array(colorCount);
        this.uniforms.targetColors = new Float32Array(colorCount * 3);
        this.targetColors = targetColors;
    }

    /**
     * The colors that will be changed
     * @param {Array<number>|Array<Array>} value - new original colors
     */
    set originalColors(value)
    {
        const arr = this.uniforms.originalColors;

        for (let i = 0; i < this.colorCount; i++)
        {
            let color = value[i];

            if (typeof color === 'number')
            {
                this._originalColors[i] = color;
                color = PIXI.utils.hex2rgb(color);
            }
            else
            {
                this._originalColors[i] = PIXI.utils.rgb2hex(color);
            }

            arr[i * 3] = color[0];
            arr[(i * 3) + 1] = color[1];
            arr[(i * 3) + 2] = color[2];
        }
    }

    get originalColor()
    {
        return this._originalColor;
    }

    /**
     * The target colors
     * @param {Array<number>|Array<Array>} value - new target colors.
     */
    set targetColors(value)
    {
        const arr = this.uniforms.targetColors;

        for (let i = 0; i < this.colorCount; i++)
        {
            let color = value[i];

            if (typeof color === 'number')
            {
                this._targetColors[i] = color;
                color = PIXI.utils.hex2rgb(color);
            }
            else
            {
                this._targetColors[i] = PIXI.utils.rgb2hex(color);
            }

            arr[i * 3] = color[0];
            arr[(i * 3) + 1] = color[1];
            arr[(i * 3) + 2] = color[2];
        }
    }
    get targetColors()
    {
        return this._targetColors;
    }

    /**
     * Tolerance/sensitivity of the floating-point comparison between colors (lower = more exact, higher = more inclusive)
     * @param {number} value - new epsilon value.
     * @default 0.05
     */
    set epsilon(value)
    {
        this.uniforms.epsilon = value;
    }
    get epsilon()
    {
        return this.uniforms.epsilon;
    }
}

// Export to PixiJS namespace
PIXI.filters.MultiColorReplaceFilter = MultiColorReplaceFilter;
