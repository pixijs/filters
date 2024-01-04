import { Color, ColorSource, Filter, GlProgram, GpuProgram } from 'pixi.js';
import fragment from './multi-color-replace.frag';
import source from './multi-color-replace.wgsl';
import { vertex, wgslVertex } from '@tools/fragments';

export interface MultiColorReplaceFilterOptions
{
    /**
     * The collection of replacement items. Each item is color-pair
     * (an array length is 2). In the pair, the first value is original color , the second value is target color
     *
     * _If you wish to change individual elements on the replacement array after instantiation,
     * use the `refresh` function to update the uniforms once you've made the changes_
     */
    replacements: Array<[ColorSource, ColorSource]>;
    /**
     * Tolerance/sensitivity of the floating-point comparison between colors (lower = more exact, higher = more inclusive)
     * @default 0.05
     */
    tolerance?: number
    /**
     * The maximum number of replacements filter is able to use.
     * Because the fragment is only compiled once, this cannot be changed after construction.
     * If omitted, the default value is the length of `replacements`
     */
    maxColors?: number;
}

/**
 * Filter for replacing a color with another color. Similar to ColorReplaceFilter, but support multiple
 * colors.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/multi-color-replace.png)
 * @class
 * @extends Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-multi-color-replace|@pixi/filter-multi-color-replace}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 *
 * @example
 *  // replaces pure red with pure blue, and replaces pure green with pure white
 *  someSprite.filters = [new MultiColorReplaceFilter({
 *    replacements: [
 *      [0xFF0000, 0x0000FF],
 *      [0x00FF00, 0xFFFFFF]
 *    ],
 *    tolerance: 0.001
 *  })];
 *
 *  You also could use [R, G, B] as the color
 *  someOtherSprite.filters = [new MultiColorReplaceFilter({
 *    replacements: [
 *      [ [1,0,0], [0,0,1] ],
 *      [ [0,1,0], [1,1,1] ]
 *    ],
 *    tolerance: 0.001
 *  })];
 *
 */
export class MultiColorReplaceFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: MultiColorReplaceFilterOptions = {
        replacements: [[0xff0000, 0x0000ff]],
        tolerance: 0.05,
        maxColors: undefined,
    };

    public uniforms: {
        uOriginalColors: Float32Array;
        uTargetColors: Float32Array;
        uTolerance: number;
    };

    private _replacements: Array<[ColorSource, ColorSource]> = [];
    private _maxColors: number;

    constructor(options?: MultiColorReplaceFilterOptions)
    {
        options = { ...MultiColorReplaceFilter.DEFAULT_OPTIONS, ...options };

        const maxColors = options.maxColors ?? options.replacements.length;

        const gpuProgram = new GpuProgram({
            vertex: {
                source: wgslVertex,
                entryPoint: 'mainVertex',
            },
            fragment: {
                source: source.replace(/\$\{MAX_COLORS\}/g, (maxColors).toFixed(0)),
                entryPoint: 'mainFragment',
            },
        });

        const glProgram = new GlProgram({
            vertex,
            fragment: fragment.replace(/\$\{MAX_COLORS\}/g, (maxColors).toFixed(0)),
            name: 'multi-color-replace-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                multiColorReplaceUniforms: {
                    uOriginalColors: {
                        value: new Float32Array(3 * maxColors),
                        type: 'vec3<f32>',
                        size: maxColors
                    },
                    uTargetColors: {
                        value: new Float32Array(3 * maxColors),
                        type: 'vec3<f32>',
                        size: maxColors
                    },
                    uTolerance: { value: options.tolerance, type: 'f32' },
                }
            },
        });

        this._maxColors = maxColors;

        this.uniforms = this.resources.multiColorReplaceUniforms.uniforms;

        this.replacements = options.replacements;
    }

    /**
     * The collection of replacement items. Each item is color-pair
     * (an array length is 2). In the pair, the first value is original color , the second value is target color
     */
    set replacements(replacements: Array<[ColorSource, ColorSource]>)
    {
        const originals = this.uniforms.uOriginalColors;
        const targets = this.uniforms.uTargetColors;
        const colorCount = replacements.length;
        const color = new Color();

        if (colorCount > this._maxColors)
        {
            throw new Error(`Length of replacements (${colorCount}) exceeds the maximum colors length (${this._maxColors})`);
        }

        // Fill with negative values
        originals[colorCount * 3] = -1;

        let r;
        let g;
        let b;

        for (let i = 0; i < colorCount; i++)
        {
            const pair = replacements[i];

            // for original colors
            color.setValue(pair[0]);

            [r, g, b] = color.toArray();

            originals[i * 3] = r;
            originals[(i * 3) + 1] = g;
            originals[(i * 3) + 2] = b;

            // for target colors
            color.setValue(pair[1]);

            [r, g, b] = color.toArray();

            targets[i * 3] = r;
            targets[(i * 3) + 1] = g;
            targets[(i * 3) + 2] = b;
        }

        this._replacements = replacements;
    }

    get replacements(): Array<[ColorSource, ColorSource]>
    {
        return this._replacements;
    }

    /**
      * Should be called after changing any of the contents of the replacements.
      * This is a convenience method for resetting the `replacements`.
      * @todo implement nested proxy to remove the need for this function
      */
    refresh(): void
    {
        this.replacements = this._replacements;
    }

    /**
      * The maximum number of color replacements supported by this filter. Can be changed
      * _only_ during construction.
      * @readonly
      */
    get maxColors(): number { return this._maxColors; }

    /**
      * Tolerance of the floating-point comparison between colors (lower = more exact, higher = more inclusive)
      * @default 0.05
      */
    get tolerance(): number { return this.uniforms.uTolerance; }
    set tolerance(value: number) { this.uniforms.uTolerance = value; }
}
