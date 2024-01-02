import { vertex, wgslVertex } from '@tools/fragments';
import fragment from './color-replace.frag';
import source from './color-replace.wgsl';
import { Color, ColorSource, Filter, FilterOptions, GlProgram, GpuProgram } from 'pixi.js';

/**
 * This WebGPU filter has been ported from the WebGL renderer that was originally created by mishaa, updated by timetocode
 * http://www.html5gamedevs.com/topic/10640-outline-a-sprite-change-certain-colors/?p=69966
 */

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
    newColor?: ColorSource;
    /**
     * Tolerance/sensitivity of the floating-point comparison between colors (lower = more exact, higher = more inclusive)
     * @default 0.4
     */
    tolerance?: number;
}

/**
 * ColorReplaceFilter, originally by mishaa, updated by timetocode
 * http://www.html5gamedevs.com/topic/10640-outline-a-sprite-change-certain-colors/?p=69966<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/color-replace.png)
 *
 * @class
 * @extends Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-color-replace|@pixi/filter-color-replace}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 *
 * @example
 *  // replaces true red with true blue
 *  someSprite.filters = [new ColorReplaceFilter({
 *   originalColor: [1, 0, 0],
 *   newColor: [0, 0, 1],
 *   tolerance: 0.001
 *   })];
 *  // replaces the RGB color 220, 220, 220 with the RGB color 225, 200, 215
 *  someOtherSprite.filters = [new ColorReplaceFilter({
 *   originalColor: [220/255.0, 220/255.0, 220/255.0],
 *   newColor: [225/255.0, 200/255.0, 215/255.0],
 *   tolerance: 0.001
 *   })];
 *  // replaces the RGB color 220, 220, 220 with the RGB color 225, 200, 215
 *  someOtherSprite.filters = [new ColorReplaceFilter({ originalColor: 0xdcdcdc, newColor: 0xe1c8d7, tolerance: 0.001 })];
 *
 */
export class ColorReplaceFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: ColorReplaceFilterOptions & Partial<FilterOptions> = {
        ...Filter.defaultOptions,
        originalColor: 0xff0000,
        newColor: 0x000000,
        tolerance: 0.4
    };

    public uniforms: {
        uOriginalColor: Float32Array,
        uNewColor: Float32Array,
        uTolerance: number,
    };

    private _originalColor: Color;
    private _newColor: Color;

    constructor(options: ColorReplaceFilterOptions = {})
    {
        options = { ...ColorReplaceFilter.DEFAULT_OPTIONS, ...options };

        const gpuProgram = new GpuProgram({
            vertex: {
                source: wgslVertex,
                entryPoint: 'mainVertex',
            },
            fragment: {
                source,
                entryPoint: 'mainFragment',
            },
        });

        const glProgram = new GlProgram({
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
                    uNewColor: { value: new Float32Array(3), type: 'vec3<f32>' },
                    uTolerance: { value: options.tolerance, type: 'f32' },
                }
            },
        });

        this.uniforms = this.resources.colorReplaceUniforms.uniforms;

        this._originalColor = new Color();
        this._newColor = new Color();

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
    get newColor(): ColorSource { return this._newColor.value as ColorSource; }
    set newColor(value: ColorSource)
    {
        this._newColor.setValue(value);
        const [r, g, b] = this._newColor.toArray();

        this.uniforms.uNewColor[0] = r;
        this.uniforms.uNewColor[1] = g;
        this.uniforms.uNewColor[2] = b;
    }

    /**
      * Tolerance/sensitivity of the floating-point comparison between colors (lower = more exact, higher = more inclusive)
      * @default 0.4
      */
    get tolerance(): number { return this.uniforms.uTolerance; }
    set tolerance(value: number) { this.uniforms.uTolerance = value; }
}
