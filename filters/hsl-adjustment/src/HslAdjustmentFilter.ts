import { Filter, GlProgram, GpuProgram, UniformGroup } from 'pixi.js';
import { vertex, wgslVertex } from '@tools/fragments';
import fragment from './hsladjustment.frag';
import source from './hsladjustment.wgsl';

// This WebGPU filter has been ported from the WebGL renderer that was originally created by Viktor Persson (@vikpe)

export interface HslAdjustmentFilterOptions
{
    /**
     * The amount of hue in degrees (-180 to 180)
     * @default 0
     */
    hue: number;
    /**
     * The amount of color saturation (-1 to 1)
     * @default 0
     */
    saturation: number;
    /**
     * The amount of lightness (-1 to 1)
     * @default 0
     */
    lightness: number;
    /**
     * Whether to colorize the image
     * @default false
     */
    colorize: boolean;
    /**
     * The amount of alpha (0 to 1)
     * @default 1
     */
    alpha: number;
}

/**
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/hsl-adjustment.png)
 *
 * @class
 * @extends Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-hsl-adjustment|@pixi/filter-hsl-adjustment}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export class HslAdjustmentFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: HslAdjustmentFilterOptions = {
        hue: 0,
        saturation: 0,
        lightness: 0,
        colorize: false,
        alpha: 1,
    };

    private _hue: number;

    constructor(options?: HslAdjustmentFilterOptions)
    {
        options = { ...HslAdjustmentFilter.DEFAULT_OPTIONS, ...options };

        const hslUniforms = new UniformGroup({
            uHsl: { value: new Float32Array(3), type: 'vec3<f32>' },
            uColorize: { value: options.colorize ? 1 : 0, type: 'f32' },
            uAlpha: { value: options.alpha, type: 'f32' },
        });

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
            name: 'hsl-adjustment-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                hslUniforms,
            },
        });

        this._hue = options.hue;
    }

    /**
     * The amount of hue in degrees (-180 to 180)
     * @default 0
     */
    get hue(): number { return this._hue; }
    set hue(value: number)
    {
        this._hue = value;
        this.resources.hslUniforms.uniforms.uHsl[0] = value * (Math.PI / 180);
    }

    /**
     * The amount of lightness (-1 to 1)
     * @default 0
     */
    get saturation(): number { return this.resources.hslUniforms.uniforms.uHsl[1]; }
    set saturation(value: number) { this.resources.hslUniforms.uniforms.uHsl[1] = value; }

    /**
     * The amount of lightness (-1 to 1)
     * @default 0
     */
    get lightness(): number { return this.resources.hslUniforms.uniforms.uHsl[2]; }
    set lightness(value: number) { this.resources.hslUniforms.uniforms.uHsl[2] = value; }

    /**
     * Whether to colorize the image
     * @default false
     */
    get colorize(): boolean { return this.resources.hslUniforms.uniforms.uColorize === 1; }
    set colorize(value: boolean) { this.resources.hslUniforms.uniforms.uColorize = value ? 1 : 0; }

    /**
     * The amount of alpha (0 to 1)
     * @default 1
     */
    get alpha(): number { return this.resources.hslUniforms.uniforms.uAlpha; }
    set alpha(value: number) { this.resources.hslUniforms.uniforms.uAlpha = value; }
}
