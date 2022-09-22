import { vertex } from '@tools/fragments';
import fragment from './crt.frag';
import { Filter } from '@pixi/core';
import type { Rectangle, CLEAR_MODES, FilterSystem, RenderTexture } from '@pixi/core';

interface CRTFilterOptions {
    curvature: number;
    lineWidth: number;
    lineContrast: number;
    verticalLine: boolean;
    noise: number;
    noiseSize: number;
    seed: number;
    vignetting: number;
    vignettingAlpha: number;
    vignettingBlur: number;
    time: number;
}

/**
 * The CRTFilter applies a CRT effect to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/crt.gif)
 *
 * @class
 * @extends PIXI.Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-crt|@pixi/filter-crt}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
class CRTFilter extends Filter
{
    /** Default constructor options */
    public static readonly defaults: CRTFilterOptions = {
        curvature: 1.0,
        lineWidth: 1.0,
        lineContrast: 0.25,
        verticalLine: false,
        noise: 0.0,
        noiseSize: 1.0,
        seed: 0.0,
        vignetting: 0.3,
        vignettingAlpha: 1.0,
        vignettingBlur: 0.3,
        time: 0.0,
    };

    /** For animating interlaced lines */
    public time = 0;

    /** A seed value to apply to the random noise generation */
    public seed = 0;

    /**
     * @param {object} [options] - The optional parameters of CRT effect
     * @param {number} [options.curvature=1.0] - Bent of interlaced lines, higher value means more bend
     * @param {number} [options.lineWidth=1.0] - Width of the interlaced lines
     * @param {number} [options.lineContrast=0.25] - Contrast of interlaced lines
     * @param {number} [options.verticalLine=false] - `true` is vertical lines, `false` is horizontal
     * @param {number} [options.noise=0.3] - Opacity/intensity of the noise effect between `0` and `1`
     * @param {number} [options.noiseSize=1.0] - The size of the noise particles
     * @param {number} [options.seed=0] - A seed value to apply to the random noise generation
     * @param {number} [options.vignetting=0.3] - The radius of the vignette effect, smaller
     *        values produces a smaller vignette
     * @param {number} [options.vignettingAlpha=1.0] - Amount of opacity of vignette
     * @param {number} [options.vignettingBlur=0.3] - Blur intensity of the vignette
     * @param {number} [options.time=0] - For animating interlaced lines
     */
    constructor(options?: Partial<CRTFilterOptions>)
    {
        super(vertex, fragment);
        this.uniforms.dimensions = new Float32Array(2);

        Object.assign(this, CRTFilter.defaults, options);
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clear: CLEAR_MODES): void
    {
        const { width, height } = input.filterFrame as Rectangle;

        this.uniforms.dimensions[0] = width;
        this.uniforms.dimensions[1] = height;

        this.uniforms.seed = this.seed;
        this.uniforms.time = this.time;

        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * Bent of interlaced lines, higher value means more bend
     * @default 1
     */
    set curvature(value: number)
    {
        this.uniforms.curvature = value;
    }
    get curvature(): number
    {
        return this.uniforms.curvature;
    }

    /**
     * Width of interlaced lines
     * @default 1
     */
    set lineWidth(value: number)
    {
        this.uniforms.lineWidth = value;
    }
    get lineWidth(): number
    {
        return this.uniforms.lineWidth;
    }

    /**
     * Contrast of interlaced lines
     * @default 0.25
     */
    set lineContrast(value: number)
    {
        this.uniforms.lineContrast = value;
    }
    get lineContrast(): number
    {
        return this.uniforms.lineContrast;
    }

    /**
     * `true` for vertical lines, `false` for horizontal lines
     * @default false
     */
    set verticalLine(value: boolean)
    {
        this.uniforms.verticalLine = value;
    }
    get verticalLine(): boolean
    {
        return this.uniforms.verticalLine;
    }

    /**
     * Opacity/intensity of the noise effect between `0` and `1`
     * @default 0
     */
    set noise(value: number)
    {
        this.uniforms.noise = value;
    }
    get noise(): number
    {
        return this.uniforms.noise;
    }

    /**
     * The size of the noise particles
     * @default 0
     */
    set noiseSize(value: number)
    {
        this.uniforms.noiseSize = value;
    }
    get noiseSize(): number
    {
        return this.uniforms.noiseSize;
    }

    /**
     * The radius of the vignette effect, smaller
     * values produces a smaller vignette
     * @default 0
     */
    set vignetting(value: number)
    {
        this.uniforms.vignetting = value;
    }
    get vignetting(): number
    {
        return this.uniforms.vignetting;
    }

    /**
     * Amount of opacity of vignette
     * @default 0
     */
    set vignettingAlpha(value: number)
    {
        this.uniforms.vignettingAlpha = value;
    }
    get vignettingAlpha(): number
    {
        return this.uniforms.vignettingAlpha;
    }

    /**
     * Blur intensity of the vignette
     * @default 0
     */
    set vignettingBlur(value: number)
    {
        this.uniforms.vignettingBlur = value;
    }
    get vignettingBlur(): number
    {
        return this.uniforms.vignettingBlur;
    }
}

export { CRTFilter };
export type { CRTFilterOptions };
