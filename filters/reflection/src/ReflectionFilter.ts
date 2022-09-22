import { vertex } from '@tools/fragments';
import fragment from './reflection.frag';
import { Filter } from '@pixi/core';
import type { FilterSystem, RenderTexture, CLEAR_MODES } from '@pixi/core';

type Range = number[] | Float32Array;

interface ReflectionFilterOptions {
    mirror: boolean;
    boundary: number;
    amplitude: Range;
    waveLength: Range;
    alpha: Range;
    time: number;
}

/**
 * Applies a reflection effect to simulate the reflection on water with waves.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/reflection.png)
 *
 * @class
 * @extends PIXI.Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-reflection|@pixi/filter-reflection}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
class ReflectionFilter extends Filter
{
    /** Default constructor options */
    public static readonly defaults: ReflectionFilterOptions = {
        mirror: true,
        boundary: 0.5,
        amplitude: [0, 20],
        waveLength: [30, 100],
        alpha: [1, 1],
        time: 0,
    };

    /** Time for animating position of waves */
    public time = 0;

    /**
     * @param {object} [options] - The optional parameters of Reflection effect.
     * @param {number} [options.mirror=true] - `true` to reflect the image, `false` for waves-only
     * @param {number} [options.boundary=0.5] - Vertical position of the reflection point, default is 50% (middle)
     *                 smaller numbers produce a larger reflection, larger numbers produce a smaller reflection.
     * @param {number} [options.amplitude=[0, 20]] - Starting and ending amplitude of waves
     * @param {number} [options.waveLength=[30, 100]] - Starting and ending length of waves
     * @param {number} [options.alpha=[1, 1]] - Starting and ending alpha values
     * @param {number} [options.time=0] - Time for animating position of waves
     */
    constructor(options?: Partial<ReflectionFilterOptions>)
    {
        super(vertex, fragment);
        this.uniforms.amplitude = new Float32Array(2);
        this.uniforms.waveLength = new Float32Array(2);
        this.uniforms.alpha = new Float32Array(2);
        this.uniforms.dimensions = new Float32Array(2);

        Object.assign(this, ReflectionFilter.defaults, options);
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clear: CLEAR_MODES): void
    {
        this.uniforms.dimensions[0] = input.filterFrame?.width;
        this.uniforms.dimensions[1] = input.filterFrame?.height;

        this.uniforms.time = this.time;

        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * `true` to reflect the image, `false` for waves-only
     * @default true
     */
    set mirror(value: boolean)
    {
        this.uniforms.mirror = value;
    }
    get mirror(): boolean
    {
        return this.uniforms.mirror;
    }

    /**
     * Vertical position of the reflection point, default is 50% (middle)
     * smaller numbers produce a larger reflection, larger numbers produce a smaller reflection.
     * @default 0.5
     */
    set boundary(value: number)
    {
        this.uniforms.boundary = value;
    }
    get boundary(): number
    {
        return this.uniforms.boundary;
    }

    /**
     * Starting and ending amplitude of waves
     * @member {number[]}
     * @default [0, 20]
     */
    set amplitude(value: Range)
    {
        this.uniforms.amplitude[0] = value[0];
        this.uniforms.amplitude[1] = value[1];
    }
    get amplitude(): Range
    {
        return this.uniforms.amplitude;
    }

    /**
     * Starting and ending length of waves
     * @member {number[]}
     * @default [30, 100]
     */
    set waveLength(value: Range)
    {
        this.uniforms.waveLength[0] = value[0];
        this.uniforms.waveLength[1] = value[1];
    }
    get waveLength(): Range
    {
        return this.uniforms.waveLength;
    }

    /**
     * Starting and ending alpha values
     * @member {number[]}
     * @default [1, 1]
     */
    set alpha(value: Range)
    {
        this.uniforms.alpha[0] = value[0];
        this.uniforms.alpha[1] = value[1];
    }
    get alpha(): Range
    {
        return this.uniforms.alpha;
    }
}

export { ReflectionFilter };
export type { ReflectionFilterOptions };
