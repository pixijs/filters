import { vertex } from '@tools/fragments';
import perlin from './perlin.frag';
import fragment from './gorday.frag';
import { Filter } from '@pixi/core';
import { Point, DEG_TO_RAD } from '@pixi/math';
import type { Rectangle } from '@pixi/math';
import type { FilterSystem, RenderTexture } from '@pixi/core';
import type { CLEAR_MODES } from '@pixi/constants';

interface GodrayFilterOptions {
    angle: number;
    gain: number;
    lacunarity: number;
    parallel: boolean;
    time: number;
    center: number[] | Point;
    alpha: number;
}

/**
 * GordayFilter, {@link https://codepen.io/alaingalvan originally} by Alain Galvan
 *
 *
 *
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/godray.gif)
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-godray|@pixi/filter-godray}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 *
 * @example
 *  displayObject.filters = [new GodrayFilter()];
 */
class GodrayFilter extends Filter
{
    /** Default for constructior options. */
    public static readonly defaults: GodrayFilterOptions = {
        angle: 30,
        gain: 0.5,
        lacunarity: 2.5,
        time: 0,
        parallel: true,
        center: [0, 0],
        alpha: 1,
    };

    /**
     * `true` if light rays are parallel (uses angle),
     * `false` to use the focal `center` point
     */
    public parallel = true;

    /**
     * The position of the emitting point for light rays
     * only used if `parallel` is set to `false`.
     */
    public center: number[] | Point;

    /** The current time. */
    public time = 0;

    private _angleLight: Point;
    private _angle = 0;

    /**
     * @param {object} [options] - Filter options
     * @param {number} [options.angle=30] - Angle/Light-source of the rays.
     * @param {number} [options.gain=0.5] - General intensity of the effect.
     * @param {number} [options.lacunarity=2.5] - The density of the fractal noise.
     * @param {boolean} [options.parallel=true] - `true` to use `angle`, `false` to use `center`
     * @param {number} [options.time=0] - The current time position.
     * @param {PIXI.Point|number[]} [options.center=[0,0]] - Focal point for non-parallel rays,
     *        to use this `parallel` must be set to `false`.
 * @param {number} [options.alpha=1.0] - the alpha, defaults to 1, affects transparency of rays
     */
    constructor(options?: Partial<GodrayFilterOptions>)
    {
        super(vertex, fragment.replace('${perlin}', perlin));

        this.uniforms.dimensions = new Float32Array(2);

        const opts: GodrayFilterOptions = Object.assign(GodrayFilter.defaults, options);

        this._angleLight = new Point();
        this.angle = opts.angle;
        this.gain = opts.gain;
        this.lacunarity = opts.lacunarity;
        this.alpha = opts.alpha;
        this.parallel = opts.parallel;
        this.center = opts.center;
        this.time = opts.time;
    }

    /**
     * Applies the filter.
     * @private
     * @param {PIXI.FilterManager} filterManager - The manager.
     * @param {PIXI.RenderTarget} input - The input target.
     * @param {PIXI.RenderTarget} output - The output target.
     */
    apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clear: CLEAR_MODES): void
    {
        const { width, height } = input.filterFrame as Rectangle;

        this.uniforms.light = this.parallel ? this._angleLight : this.center;

        this.uniforms.parallel = this.parallel;
        this.uniforms.dimensions[0] = width;
        this.uniforms.dimensions[1] = height;
        this.uniforms.aspect = height / width;
        this.uniforms.time = this.time;
        this.uniforms.alpha = this.alpha;

        // draw the filter...
        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * The angle/light-source of the rays in degrees. For instance, a value of 0 is vertical rays,
     *     values of 90 or -90 produce horizontal rays.
     * @default 30
     */
    get angle(): number
    {
        return this._angle;
    }
    set angle(value: number)
    {
        this._angle = value;

        const radians = value * DEG_TO_RAD;

        this._angleLight.x = Math.cos(radians);
        this._angleLight.y = Math.sin(radians);
    }

    /**
     * General intensity of the effect. A value closer to 1 will produce a more intense effect,
     * where a value closer to 0 will produce a subtler effect.
     * @default 0.5
     */
    get gain(): number
    {
        return this.uniforms.gain;
    }
    set gain(value: number)
    {
        this.uniforms.gain = value;
    }

    /**
     * The density of the fractal noise. A higher amount produces more rays and a smaller amound
     * produces fewer waves.
     * @default 2.5
     */
    get lacunarity(): number
    {
        return this.uniforms.lacunarity;
    }
    set lacunarity(value: number)
    {
        this.uniforms.lacunarity = value;
    }

    /**
     * The alpha (opacity) of the rays.  0 is fully transparent, 1 is fully opaque.
     * @default 1
     */
    get alpha(): number
    {
        return this.uniforms.alpha;
    }
    set alpha(value: number)
    {
        this.uniforms.alpha = value;
    }
}

export { GodrayFilter };
