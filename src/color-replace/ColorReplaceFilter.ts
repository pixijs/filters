import { Color, ColorSource, deprecation, Filter, GlProgram, GpuProgram } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './color-replace.frag';
import source from './color-replace.wgsl';

/**
 * This WebGPU filter has been ported from the WebGL renderer that was originally created by mishaa, updated by timetocode
 * http://www.html5gamedevs.com/topic/10640-outline-a-sprite-change-certain-colors/?p=69966
 */

type DeprecatedColor = number | number[] | Float32Array;

/** Options for the ColorReplaceFilter constructor. */
export interface ColorReplaceFilterOptions
{
    /**
     * The color that will be changed.
     * @example [1.0, 1.0, 1.0] = 0xffffff
     * @default 0xff0000
     */
    originalColor?: ColorSource;
    /**
     * The resulting color.
     * @example [1.0, 1.0, 1.0] = 0xffffff
     * @default 0x000000
     */
    targetColor?: ColorSource;
    /**
     * Tolerance/sensitivity of the floating-point comparison between colors (lower = more exact, higher = more inclusive)
     * @default 0.4
     */
    tolerance?: number;
}

/**
 * ColorReplaceFilter, originally by mishaa, updated by timetocode
 * http://www.html5gamedevs.com/topic/10640-outline-a-sprite-change-certain-colors/?p=69966<br>
 * ![original](../screenshots/original.png)![filter](../screenshots/color-replace.png)
 *
 * @class
 * @extends Filter
 *
 * @example
 *  // replaces true red with true blue
 *  someSprite.filters = [new ColorReplaceFilter({
 *   originalColor: [1, 0, 0],
 *   targetColor: [0, 0, 1],
 *   tolerance: 0.001
 *   })];
 *  // replaces the RGB color 220, 220, 220 with the RGB color 225, 200, 215
 *  someOtherSprite.filters = [new ColorReplaceFilter({
 *   originalColor: [220/255.0, 220/255.0, 220/255.0],
 *   targetColor: [225/255.0, 200/255.0, 215/255.0],
 *   tolerance: 0.001
 *   })];
 *  // replaces the RGB color 220, 220, 220 with the RGB color 225, 200, 215
 *  someOtherSprite.filters = [new ColorReplaceFilter({ originalColor: 0xdcdcdc, targetColor: 0xe1c8d7, tolerance: 0.001 })];
 *
 */
export class ColorReplaceFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: ColorReplaceFilterOptions = {
        originalColor: 0xff0000,
        targetColor: 0x000000,
        tolerance: 0.4
    };

    public uniforms: {
        uOriginalColor: Float32Array,
        uTargetColor: Float32Array,
        uTolerance: number,
    };

    private _originalColor: Color;
    private _targetColor: Color;

    /**
     * @param options - Options for the ColorReplaceFilter constructor.
     */
    constructor(options?: ColorReplaceFilterOptions);
    /**
     * @deprecated since 6.0.0
     *
     * @param {number|Array<number>|Float32Array} [originalColor=0xFF0000] - The color that will be changed,
     *        as a 3 component RGB e.g. `[1.0, 1.0, 1.0]`
     * @param {number|Array<number>|Float32Array} [newColor=0x000000] - The resulting color, as a 3 component
     *        RGB e.g. `[1.0, 0.5, 1.0]`
     * @param {number} [epsilon=0.4] - Tolerance/sensitivity of the floating-point comparison between colors
     *        (lower = more exact, higher = more inclusive)
     */
    constructor(originalColor?: number, newColor?: number, epsilon?: number);
    /** @ignore */
    constructor(...args: [ColorReplaceFilterOptions?] | [DeprecatedColor?, DeprecatedColor?, number?])
    {
        let options = args[0] ?? {};

        if (typeof options === 'number' || Array.isArray(options) || options instanceof Float32Array)
        {
            // eslint-disable-next-line max-len
            deprecation('6.0.0', 'ColorReplaceFilter constructor params are now options object. See params: { originalColor, targetColor, tolerance }');

            options = { originalColor: options };

            if (args[1] !== undefined) options.targetColor = args[1];
            if (args[2] !== undefined) options.tolerance = args[2];
        }

        options = { ...ColorReplaceFilter.DEFAULT_OPTIONS, ...options };

        const gpuProgram = GpuProgram.from({
            vertex: {
                source: wgslVertex,
                entryPoint: 'mainVertex',
            },
            fragment: {
                source,
                entryPoint: 'mainFragment',
            },
        });

        const glProgram = GlProgram.from({
            vertex,
            fragment,
            name: 'color-replace-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                colorReplaceUniforms: {
                    uOriginalColor: { value: new Float32Array(3), type: 'vec3<f32>' },
                    uTargetColor: { value: new Float32Array(3), type: 'vec3<f32>' },
                    uTolerance: { value: options.tolerance, type: 'f32' },
                }
            },
        });

        this.uniforms = this.resources.colorReplaceUniforms.uniforms;

        this._originalColor = new Color();
        this._targetColor = new Color();
        this.originalColor = options.originalColor ?? 0xff0000;
        this.targetColor = options.targetColor ?? 0x000000;

        Object.assign(this, options);
    }

    /**
     * The color that will be changed.
     * @example [1.0, 1.0, 1.0] = 0xffffff
     * @default 0xff0000
     */
    get originalColor(): ColorSource { return this._originalColor.value as ColorSource; }
    set originalColor(value: ColorSource)
    {
        this._originalColor.setValue(value);
        const [r, g, b] = this._originalColor.toArray();

        this.uniforms.uOriginalColor[0] = r;
        this.uniforms.uOriginalColor[1] = g;
        this.uniforms.uOriginalColor[2] = b;
    }

    /**
      * The resulting color.
      * @example [1.0, 1.0, 1.0] = 0xffffff
      * @default 0x000000
      */
    get targetColor(): ColorSource { return this._targetColor.value as ColorSource; }
    set targetColor(value: ColorSource)
    {
        this._targetColor.setValue(value);
        const [r, g, b] = this._targetColor.toArray();

        this.uniforms.uTargetColor[0] = r;
        this.uniforms.uTargetColor[1] = g;
        this.uniforms.uTargetColor[2] = b;
    }

    /**
      * Tolerance/sensitivity of the floating-point comparison between colors (lower = more exact, higher = more inclusive)
      * @default 0.4
      */
    get tolerance(): number { return this.uniforms.uTolerance; }
    set tolerance(value: number) { this.uniforms.uTolerance = value; }

    /**
     * @deprecated since 6.0.0
     *
     * The resulting color, as a 3 component RGB e.g. [1.0, 0.5, 1.0]
     * @member {number|Array<number>|Float32Array}
     * @default 0x000000
     * @see ColorReplaceFilter#targetColor
     */
    set newColor(value: DeprecatedColor)
    {
        deprecation('6.0.0', 'ColorReplaceFilter.newColor is deprecated, please use ColorReplaceFilter.targetColor instead');

        this.targetColor = value;
    }
    get newColor(): DeprecatedColor
    {
        deprecation('6.0.0', 'ColorReplaceFilter.newColor is deprecated, please use ColorReplaceFilter.targetColor instead');

        return this.targetColor as DeprecatedColor;
    }

    /**
     * @deprecated since 6.0.0
     *
     * Tolerance/sensitivity of the floating-point comparison between colors (lower = more exact, higher = more inclusive)
     * @default 0.4
     * @see ColorReplaceFilter#tolerance
     */
    set epsilon(value: number)
    {
        deprecation('6.0.0', 'ColorReplaceFilter.epsilon is deprecated, please use ColorReplaceFilter.tolerance instead');

        this.tolerance = value;
    }
    get epsilon(): number
    {
        deprecation('6.0.0', 'ColorReplaceFilter.epsilon is deprecated, please use ColorReplaceFilter.tolerance instead');

        return this.tolerance;
    }
}
