import { Color, ColorSource, deprecation, Filter, GlProgram, GpuProgram } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './color-overlay.frag';
import source from './color-overlay.wgsl';

type DeprecatedColor = number | number[] | Float32Array;

/** Options for the ColorOverlayFilter constructor. */
export interface ColorOverlayFilterOptions
{
    /**
     * The color of the overlay
     * @default 0x000000
     */
    color?: ColorSource;
    /**
     * The alpha of the overlay
     * @default 1
     */
    alpha?: number;
}

/**
 * Overlay a source graphic with a color.<br>
 *
 * @class
 * @extends Filter
 */
export class ColorOverlayFilter extends Filter
{
    /** Default shockwave filter options */
    public static readonly DEFAULT_OPTIONS: ColorOverlayFilterOptions = {
        /** The color of the overlay */
        color: 0x000000,
        /** The alpha of the overlay */
        alpha: 1,
    };

    public uniforms: {
        uColor: Float32Array;
        uAlpha: number;
    };

    private _color: Color;

    /**
     * @param options - Options for the ColorOverlayFilter constructor.
     */
    constructor(options?: ColorOverlayFilterOptions);
    /**
     * @deprecated since 6.0.0
     *
     * @param {number|Array<number>} [color=0x000000] - The resulting color, as a 3 component RGB e.g. [1.0, 0.5, 1.0]
     * @param {number} [alpha=1] - The alpha value of the color
     */
    constructor(color?: DeprecatedColor, alpha?: number);
    /** @ignore */
    constructor(...args: [ColorOverlayFilterOptions?] | [DeprecatedColor?, number?])
    {
        let options = args[0] ?? {};

        if (typeof options === 'number' || Array.isArray(options) || options instanceof Float32Array)
        {
            // eslint-disable-next-line max-len
            deprecation('6.0.0', 'ColorOverlayFilter constructor params are now options object. See params: { color, alpha }');

            options = { color: options };

            if (args[1] !== undefined) options.alpha = args[1];
        }

        options = { ...ColorOverlayFilter.DEFAULT_OPTIONS, ...options };

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
            name: 'color-overlay-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                colorOverlayUniforms: {
                    uColor: { value: new Float32Array(3), type: 'vec3<f32>' },
                    uAlpha: { value: options.alpha, type: 'f32' },
                },
            },
        });

        this.uniforms = this.resources.colorOverlayUniforms.uniforms;

        this._color = new Color();
        this.color = options.color ?? 0x000000;
    }

    /**
     * The over color source
     * @member {number|Array<number>|Float32Array}
     * @default 0x000000
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
     * The alpha value of the color
     * @default 1
     */
    get alpha(): number { return this.uniforms.uAlpha; }
    set alpha(value: number) { this.uniforms.uAlpha = value; }
}
