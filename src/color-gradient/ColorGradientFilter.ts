import { Color, ColorSource, Filter, GlProgram, GpuProgram } from 'pixi.js';
import fragment from './color-gradient.frag';
import vertex from './color-gradient.vert';
import source from './color-gradient.wgsl';
import { parseCssGradient } from './CssGradientParser';

/** Color stop object. */
export interface ColorStop
{
    offset: number;
    color: ColorSource;
    alpha: number;
}

/** Options for ColorGradientFilter constructor. */
export interface ColorGradientFilterOptions
{
    /**
     * Linear = 0, Radial = 1, Conic = 2
     * @default ColorGradientFilter.LINEAR
     */
    type: number;
    /** Collection of stops, must be 2+ */
    stops: ColorStop[];
    /**
     * Angle for linear gradients, in degrees.
     * @default 90
     */
    angle?: number;
    /**
     * Alpha value for the gradient.
     * @default 1
     */
    alpha?: number;
    /**
     * Maximum number of colors to render (0 = no limit)
     * @default 0
     */
    maxColors?: number;
    /**
     * If true, the gradient will replace the existing color, otherwise it will be multiplied with it
     * @default false
     */
    replace?: boolean;
}

/** Options for CSS-style gradient for use with constructor. */
export interface ColorGradientFilterCSSOptions
{
    /** CSS-style gradient string */
    css: string;
    /**
     * Alpha value for the gradient.
     * @default 1
     */
    alpha?: number;
    /**
     * Maximum number of colors to render (0 = no limit)
     * @default 0
     */
    maxColors?: number;
}

const ANGLE_OFFSET = 90; // align degrees with CSS

function sortColorStops(stops: ColorStop[]): ColorStop[]
{
    return [...stops].sort((a, b) => a.offset - b.offset);
}

/**
 * Render a colored gradient.<br>
 * ![original](../screenshots/original.png)![filter](../screenshots/color-gradient.png)
 *
 * @class
 * @extends Filter
 */
export class ColorGradientFilter extends Filter
{
    /** Gradient types */
    static readonly LINEAR = 0;
    static readonly RADIAL = 1;
    static readonly CONIC = 2;

    /** Default constructor options */
    public static readonly defaults: ColorGradientFilterOptions = {
        type: ColorGradientFilter.LINEAR,
        stops: [
            { offset: 0.0, color: 0xff0000, alpha: 1.0 },
            { offset: 1.0, color: 0x0000ff, alpha: 1.0 },
        ],
        alpha: 1.0,
        angle: 90.0,
        maxColors: 0,
        replace: false,
    };

    public baseUniforms: {
        uOptions: Float32Array;
        uCounts: Float32Array;
    };

    public stopsUniforms: {
        uColors: Float32Array;
        uStops: Float32Array;
    };

    private _stops: ColorStop[] = [];

    /**
     * @param options - Options for the ColorGradientFilter constructor.
     */
    constructor(options?: ColorGradientFilterOptions | ColorGradientFilterCSSOptions)
    {
        if (options && 'css' in options)
        {
            options = {
                ...parseCssGradient(options.css || ''),
                alpha: options.alpha ?? ColorGradientFilter.defaults.alpha,
                maxColors: options.maxColors ?? ColorGradientFilter.defaults.maxColors,
            };
        }
        else
        {
            options = { ...ColorGradientFilter.defaults, ...options };
        }

        if (!options.stops || options.stops.length < 2)
        {
            throw new Error('ColorGradientFilter requires at least 2 color stops.');
        }

        const gpuProgram = GpuProgram.from({
            vertex: {
                source,
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
            name: 'color-gradient-filter',
        });

        const maxStops = 32;

        super({
            gpuProgram,
            glProgram,
            resources: {
                baseUniforms: {
                    uOptions: {
                        value: [
                            // Gradient Type
                            options.type,
                            // Gradient Angle
                            options.angle ?? ANGLE_OFFSET,
                            // Master Alpha
                            options.alpha,
                            // Replace Base Color
                            options.replace ? 1 : 0,
                        ],
                        type: 'vec4<f32>',
                    },
                    uCounts: {
                        value: [
                            // Number of Stops
                            options.stops.length,
                            // Max Gradient Colors
                            options.maxColors,
                        ],
                        type: 'vec2<f32>',
                    },
                },
                stopsUniforms: {
                    uColors: { value: new Float32Array(maxStops * 3), type: 'vec3<f32>', size: maxStops },

                    // We only need vec2, but we need to pad to eliminate the WGSL warning, TODO: @Mat ?
                    uStops: { value: new Float32Array(maxStops * 4), type: 'vec4<f32>', size: maxStops },
                }
            },
        });

        this.baseUniforms = this.resources.baseUniforms.uniforms;
        this.stopsUniforms = this.resources.stopsUniforms.uniforms;

        Object.assign(this, options);
    }

    get stops(): ColorStop[]
    {
        return this._stops;
    }

    set stops(stops: ColorStop[])
    {
        const sortedStops = sortColorStops(stops);
        const color = new Color();
        let r;
        let g;
        let b;

        for (let i = 0; i < sortedStops.length; i++)
        {
            color.setValue(sortedStops[i].color);
            const indexStart = i * 3;

            [r, g, b] = color.toArray();
            this.stopsUniforms.uColors[indexStart] = r;
            this.stopsUniforms.uColors[indexStart + 1] = g;
            this.stopsUniforms.uColors[indexStart + 2] = b;

            this.stopsUniforms.uStops[i * 4] = sortedStops[i].offset;
            this.stopsUniforms.uStops[(i * 4) + 1] = sortedStops[i].alpha;
        }

        this.baseUniforms.uCounts[0] = sortedStops.length;
        this._stops = sortedStops;
    }

    /**
   * The type of gradient
   * @default ColorGradientFilter.LINEAR
   */
    get type(): number { return this.baseUniforms.uOptions[0]; }
    set type(value: number) { this.baseUniforms.uOptions[0] = value; }

    /**
   * The angle of the gradient in degrees
   * @default 90
   */
    get angle(): number { return this.baseUniforms.uOptions[1] + ANGLE_OFFSET; }
    set angle(value: number) { this.baseUniforms.uOptions[1] = value - ANGLE_OFFSET; }

    /**
   * The alpha value of the gradient (0-1)
   * @default 1
   */
    get alpha(): number { return this.baseUniforms.uOptions[2]; }
    set alpha(value: number) { this.baseUniforms.uOptions[2] = value; }

    /**
   * The maximum number of colors to render (0 = no limit)
   * @default 0
   */
    get maxColors(): number { return this.baseUniforms.uCounts[1]; }
    set maxColors(value: number) { this.baseUniforms.uCounts[1] = value; }

    /**
     * If true, the gradient will replace the existing color, otherwise it
     * will be multiplied with it
     * @default false
     */
    get replace(): boolean { return this.baseUniforms.uOptions[3] > 0.5; }
    set replace(value: boolean) { this.baseUniforms.uOptions[3] = value ? 1 : 0; }
}

