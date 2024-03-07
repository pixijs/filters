import { Color, ColorSource, deprecation, Filter, GlProgram, GpuProgram } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './ascii.frag';
import source from './ascii.wgsl';

// This WebGPU filter has been ported from the WebGL renderer that was originally created by Vico (@vicocotea)

/** Options for AsciiFilter constructor. */
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
 * ![original](../screenshots/original.png)![filter](../screenshots/ascii.png)
 *
 * @class
 * @extends Filter
 */
export class AsciiFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: AsciiFilterOptions = {
        size: 8,
        color: 0xffffff,
        replaceColor: false,
    };

    public uniforms: {
        uSize: number;
        uColor: Float32Array;
        uReplaceColor: number;
    };

    private _color!: Color;

    /**
     * Constructor.
     * @param {AsciiFilterOptions} options - The options of the ASCII filter.
     */
    constructor(options?: AsciiFilterOptions);
    /**
     * @deprecated since 6.0.0
     *
     * @param {number} [size=8] - Size of the font
     */
    constructor(size: number);
    /** @ignore */
    constructor(...args: [AsciiFilterOptions?] | [number])
    {
        let options = args[0] ?? {};

        if (typeof options === 'number')
        {
            // eslint-disable-next-line max-len
            deprecation('6.0.0', 'AsciiFilter constructor params are now options object. See params: { size, color, replaceColor }');

            options = { size: options };
        }

        const replaceColor = options?.color && options.replaceColor !== false;

        options = { ...AsciiFilter.DEFAULT_OPTIONS, ...options } as AsciiFilterOptions;

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
            name: 'ascii-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                asciiUniforms: {
                    uSize: { value: options.size, type: 'f32' },
                    uColor: { value: new Float32Array(3), type: 'vec3<f32>' },
                    uReplaceColor: { value: Number(replaceColor), type: 'f32' },
                },
            },
        });

        this.uniforms = this.resources.asciiUniforms.uniforms;
        this._color = new Color();
        this.color = options.color ?? 0xffffff;
    }

    /**
     * The pixel size used by the filter.
     * @default 8
     */
    get size(): number { return this.uniforms.uSize; }
    set size(value: number) { this.uniforms.uSize = value; }

    /**
     * The resulting color of the ascii characters, as a 3 component RGB or numerical hex
     * @example [1.0, 1.0, 1.0] = 0xffffff
     * @default 0xffffff
     */
    get color(): ColorSource { return this._color.value as ColorSource; }
    set color(value: ColorSource)
    {
        this._color.setValue(value);
        const [r, g, b] = this._color.toArray();

        this.uniforms.uColor[0] = r;
        this.uniforms.uColor[1] = g;
        this.uniforms.uColor[2] = b;
    }

    /**
     * Determine whether or not to replace the source colors with the provided.
     */
    get replaceColor(): boolean { return this.uniforms.uReplaceColor > 0.5; }
    set replaceColor(value: boolean) { this.uniforms.uReplaceColor = value ? 1 : 0; }
}
