import { Color, ColorSource, Filter, GlProgram, GpuProgram, UniformGroup } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './color-overlay.frag';
import source from './color-overlay.wgsl';

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
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
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

    constructor(options: ColorOverlayFilterOptions = {})
    {
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
                colorOverlayUniforms: new UniformGroup({
                    uColor: { value: new Float32Array(3), type: 'vec3<f32>' },
                    uAlpha: { value: options.alpha, type: 'f32' },
                })
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
