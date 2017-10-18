import vertex from './multi-color-replace.vert';
import fragment from './multi-color-replace.frag';

/**
 * MultiColorReplaceFilter
 *
 * It's similar to ColorReplaceFilter , but support multi-color.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {Array<Array>} replacements - The colors that will be changed.
 *                       The item of `replacements` is color-pair (an array length is 2).
 *                       In the pair, the first one is original color , the second one is target color.
 * @param {number} [epsilon=0.05] - Tolerance/sensitivity of the floating-point comparison between colors
 *                                  (lower = more exact, higher = more inclusive)
 * @param {number} [maxColorCount] - TODO
 *
 * Notice: If arguments.length == 2 , the 2nd one will be dynamic.
 *         If it is [0, 1], it's `epsilon`, If `>1` ,it's `maxColorCount`.
 *
 * @example
 *  // replaces pure red with pure blue, and replaces pure green with pure white
 *  someSprite.filters = [new MultiColorReplaceFilter(
 *   [
 *     [0xFF0000, 0x0000FF],
 *     [0x00FF00, 0xFFFFFF]
 *   ],
 *   0.001
 *   )];
 *
 *  You also could use [R, G, B] as the color
 *  someOtherSprite.filters = [new MultiColorReplaceFilter(
 *   [
 *     [ [1,0,0], [0,0,1] ],
 *     [ [0,1,0], [1,1,1] ],
 *   ],
 *   0.001
 *   )];
 *
 */
export default class MultiColorReplaceFilter extends PIXI.Filter
{
    constructor(replacements, epsilon = 0.05, maxColorCount)
    {
        const colorCount = replacements.length;

        if (!maxColorCount)
        {
            if (epsilon > 1.0)
            {
                maxColorCount = epsilon;
                epsilon = 0.05;
            }
            else
            {
                maxColorCount = colorCount;
            }
        }

        super(
            vertex,
            fragment.replace(/%maxColorCount%/g, maxColorCount)
        );

        this.epsilon = epsilon;
        this.maxColorCount = maxColorCount;

        this._replacements = null;
        this.uniforms.originalColors = new Float32Array(maxColorCount * 3);
        this.uniforms.targetColors = new Float32Array(maxColorCount * 3);

        this.replacements = replacements;
    }

    /**
     * The colors that will be changed
     * @param {Array<Array>} value - new original colors
     */
    set replacements(value)
    {
        const arr = this.uniforms.originalColors;
        const targetArr = this.uniforms.targetColors;

        let colorCount = value.length;

        if (colorCount > this.maxColorCount)
        {
            colorCount = this.maxColorCount;
            // TODO: Give a warning if value.length > this.maxColorCount ???
        }
        else
        {
            arr[colorCount * 3] = -0.1;
        }

        for (let i = 0; i < colorCount; i++)
        {
            const pair = value[i];

            // for original colors
            let color = pair[0];
            if (typeof color === 'number')
            {
                color = PIXI.utils.hex2rgb(color);
            }
            else
            {
                pair[0] = PIXI.utils.rgb2hex(color);
            }

            arr[i * 3] = color[0];
            arr[(i * 3) + 1] = color[1];
            arr[(i * 3) + 2] = color[2];

            // for target colors
            let targetColor = pair[1];
            if (typeof targetColor === 'number')
            {
                targetColor = PIXI.utils.hex2rgb(targetColor);
            }
            else
            {
                pair[1] = PIXI.utils.rgb2hex(targetColor);
            }

            targetArr[i * 3] = targetColor[0];
            targetArr[(i * 3) + 1] = targetColor[1];
            targetArr[(i * 3) + 2] = targetColor[2];
        }

        this._replacements = value;
        this.uniforms.colorCount = colorCount;
    }

    get replacements()
    {
        return this._replacements;
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
