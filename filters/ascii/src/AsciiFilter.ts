import { vertex, wgslVertex } from '@tools/fragments';
import fragment from './ascii.frag';
import source from './ascii.wgsl';
import { Color, ColorSource, Filter, GlProgram, GpuProgram } from 'pixi.js';

// This WebGPU filter has been ported from the WebGL renderer that was originally created by Vico (@vicocotea)

export interface AsciiFilterOptions
{
    /**
     * The pixel size used by the filter
     * @default 8
     */
    size?: number;
    /**
     * A color to set the ascii characters to. If not set, the color will be taken from the source.
     * @example [1.0, 1.0, 1.0] = 0xffffff
     * @default 0x000000
     */
    color?: ColorSource;
    /**
     * Determine whether or not to replace the source colors with the provided.
     *
     * Will automatically be assigned to `true` if `color` is provided.
     * Set `replaceColor` to `false` to prevent that.
     * @default false
     */
    replaceColor?: boolean;
}

/**
 * An ASCII filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/ascii.png)
 *
 * @class
 * @extends Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-ascii|@pixi/filter-ascii}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export class AsciiFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: AsciiFilterOptions = {
        size: 8,
        color: 0xffffff,
        replaceColor: false,
    };

    private _color: Color;

    constructor(options?: AsciiFilterOptions)
    {
        const replaceColor = options?.color && options.replaceColor !== false;

        options = { ...AsciiFilter.DEFAULT_OPTIONS, ...options } as AsciiFilterOptions;

        const asciiUniforms = {
            uSize: { value: options.size, type: 'f32' },
            uColor: { value: new Float32Array(3), type: 'vec3<f32>' },
            uReplaceColor: { value: Number(replaceColor), type: 'f32' },
        };

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
            name: 'ascii-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                asciiUniforms,
            },
        });

        this._color = new Color();
        this.color = options.color ?? 0xffffff;
    }

    /**
     * The pixel size used by the filter.
     * @default 8
     */
    get size(): number { return this.resources.asciiUniforms.uniforms.uSize; }
    set size(value: number) { this.resources.asciiUniforms.uniforms.uSize = value; }

    /**
     * The resulting color of the ascii characters, as a 3 component RGB or numerical hex
     * @example [1.0, 1.0, 1.0] = 0xffffff
     * @default 0xffffff
     */
    get color(): ColorSource { return this._color.value as ColorSource; }
    set color(value: ColorSource)
    {
        this._color.setValue(value);
        this.resources.asciiUniforms.uniforms.uColor = this._color.toArray().slice(0, 3);
    }

    /**
     * Determine whether or not to replace the source colors with the provided.
     */
    get replaceColor(): boolean { return this.resources.asciiUniforms.uniforms.uReplaceColor > 0.5; }
    set replaceColor(value: boolean) { this.resources.asciiUniforms.uniforms.uReplaceColor = value ? 1 : 0; }
}
