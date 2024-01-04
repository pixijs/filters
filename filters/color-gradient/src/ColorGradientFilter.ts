import { Color, ColorSource, Filter, GlProgram, GpuProgram } from 'pixi.js';
import fragment from './color-gradient.frag';
import vertex from './color-gradient.vert';
import source from './color-gradient.wgsl';
import { parseCssGradient } from './CssGradientParser';

export type ColorStop = {
    offset: number;
    color: ColorSource;
    alpha: number;
};

export type DefaultOptions = {
    type: number;
    stops: ColorStop[];
    angle?: number;
    alpha?: number;
    maxColors?: number;
    replace?: boolean;
};

export type CssOptions = {
    css: string;
    alpha?: number;
    maxColors?: number;
};

const ANGLE_OFFSET = 90; // align degrees with CSS

function sortColorStops(stops: ColorStop[]): ColorStop[]
{
    return [...stops].sort((a, b) => a.offset - b.offset);
}

/**
 * Render a colored gradient.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/color-gradient.png)
 *
 * @class
 * @extends Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-color-gradient|@pixi/filter-color-gradient}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export class ColorGradientFilter extends Filter
{
    /** Gradient types */
    static readonly LINEAR = 0;
    static readonly RADIAL = 1;
    static readonly CONIC = 2;

    /** Default constructor options */
    public static readonly defaults: DefaultOptions = {
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

    public uniforms: {
        uType: number;
        uAngle: number;
        uAlpha: number;
        uColors: Float32Array;
        uOffsets: Float32Array;
        uAlphas: Float32Array;
        uNumStops: number;
        uMaxColors: number;
        uReplace: number;
    };

    private _stops: ColorStop[] = [];

    /**
   * @param {DefaultOptions | CssOptions} [options]
   * @param {number} [options.alpha=1.0] - Alpha value
   * @param {number} [options.maxColors=0] - Maximum number of colors to render (0 = disabled)
   */
    constructor(options?: DefaultOptions | CssOptions)
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

        const gpuProgram = new GpuProgram({
            vertex: {
                source,
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
            name: 'color-gradient-filter',
        });

        const maxStops = 32;

        super({
            gpuProgram,
            glProgram,
            resources: {
                colorGradientUniforms: {
                    uType: { value: options.type, type: 'i32' },
                    uAngle: { value: options.angle ?? ANGLE_OFFSET, type: 'f32' },
                    uAlpha: { value: options.alpha, type: 'f32' },
                    uReplace: { value: options.replace ? 1 : 0, type: 'f32' },

                    uColors: { value: new Float32Array(maxStops * 3), type: 'vec3<f32>', size: maxStops },
                    uOffsets: { value: new Float32Array(maxStops), type: 'f32', size: maxStops },
                    uAlphas: { value: new Float32Array(maxStops * 3), type: 'f32', size: maxStops * 3 },
                    uNumStops: { value: options.stops.length, type: 'f32' },

                    uMaxColors: { value: options.maxColors, type: 'f32' },
                },
            },
        });

        this.uniforms = this.resources.colorGradientUniforms.uniforms;

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
        const colors = new Float32Array(sortedStops.length * 3);
        let r;
        let g;
        let b;

        for (let i = 0; i < sortedStops.length; i++)
        {
            color.setValue(sortedStops[i].color);
            const indexStart = i * 3;

            [r, g, b] = color.toArray();
            colors[indexStart] = r;
            colors[indexStart + 1] = g;
            colors[indexStart + 2] = b;
        }

        this.uniforms.uColors = colors;
        this.uniforms.uOffsets.set(sortedStops.map((s) => s.offset));
        this.uniforms.uAlphas.set(sortedStops.map((s) => s.alpha));
        this.uniforms.uNumStops = sortedStops.length;
        this._stops = sortedStops;
    }

    /**
   * The type of gradient
   * @default ColorGradientFilter.LINEAR
   */
    get type(): number { return this.uniforms.uType; }
    set type(value: number) { this.uniforms.uType = value; }

    /**
   * The angle of the gradient in degrees
   * @default 90
   */
    get angle(): number { return this.uniforms.uAngle + ANGLE_OFFSET; }
    set angle(value: number) { this.uniforms.uAngle = value - ANGLE_OFFSET; }

    /**
   * The alpha value of the gradient (0-1)
   * @default 1
   */
    get alpha(): number { return this.uniforms.uAlpha; }
    set alpha(value: number) { this.uniforms.uAlpha = value; }

    /**
   * The maximum number of colors to render (0 = no limit)
   * @default 0
   */
    get maxColors(): number { return this.uniforms.uMaxColors; }
    set maxColors(value: number) { this.uniforms.uMaxColors = value; }

    /**
     * If true, the gradient will replace the existing color, otherwise it
     * will be multiplied with it
     * @default false
     */
    get replace(): boolean { return this.uniforms.uReplace > 0.5; }
    set replace(value: boolean) { this.uniforms.uReplace = value ? 1 : 0; }
}

