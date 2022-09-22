import { vertex } from '@tools/fragments';
import fragment from './shockwave.frag';
import { Filter } from '@pixi/core';
import type { Point, CLEAR_MODES, FilterSystem, RenderTexture } from '@pixi/core';

type PointLike = Point|number[];

interface ShockwaveFilterOptions {
    amplitude: number;
    wavelength: number;
    speed: number;
    brightness: number;
    radius: number;
}

/**
 * The ShockwaveFilter class lets you apply a shockwave effect.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/shockwave.gif)
 *
 * @class
 * @extends PIXI.Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-shockwave|@pixi/filter-shockwave}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
class ShockwaveFilter extends Filter
{
    /** Default constructor options. */
    public static readonly defaults: ShockwaveFilterOptions = {
        amplitude: 30.0,
        wavelength: 160.0,
        brightness: 1.0,
        speed: 500.0,
        radius: -1.0,
    };

    /**
     * Sets the elapsed time of the shockwave.
     * It could control the current size of shockwave.
     */
    public time: number;

    /**
     * @param {PIXI.Point|number[]} [center=[0.5, 0.5]] - See `center` property.
     * @param {object} [options] - The optional parameters of shockwave filter.
     * @param {number} [options.amplitude=0.5] - See `amplitude`` property.
     * @param {number} [options.wavelength=1.0] - See `wavelength` property.
     * @param {number} [options.speed=500.0] - See `speed` property.
     * @param {number} [options.brightness=8] - See `brightness` property.
     * @param {number} [options.radius=4] - See `radius` property.
     * @param {number} [time=0] - See `time` property.
     */
    constructor(center: PointLike = [0, 0], options?: Partial<ShockwaveFilterOptions>, time = 0)
    {
        super(vertex, fragment);
        this.center = center;
        Object.assign(this, ShockwaveFilter.defaults, options);
        this.time = time;
    }

    apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clear: CLEAR_MODES): void
    {
        // There is no set/get of `time`, for performance.
        // Because in the most real cases, `time` will be changed in ever game tick.
        // Use set/get will take more function-call.
        this.uniforms.time = this.time;

        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * Sets the center of the shockwave in normalized screen coords. That is
     * (0,0) is the top-left and (1,1) is the bottom right.
     *
     * @member {PIXI.Point|number[]}
     */
    get center(): PointLike
    {
        return this.uniforms.center;
    }
    set center(value: PointLike)
    {
        this.uniforms.center = value;
    }

    /**
     * The amplitude of the shockwave.
     */
    get amplitude(): number
    {
        return this.uniforms.amplitude;
    }
    set amplitude(value: number)
    {
        this.uniforms.amplitude = value;
    }

    /**
     * The wavelength of the shockwave.
     */
    get wavelength(): number
    {
        return this.uniforms.wavelength;
    }
    set wavelength(value: number)
    {
        this.uniforms.wavelength = value;
    }

    /**
     * The brightness of the shockwave.
     */
    get brightness(): number
    {
        return this.uniforms.brightness;
    }
    set brightness(value: number)
    {
        this.uniforms.brightness = value;
    }

    /**
     * The speed about the shockwave ripples out.
     * The unit is `pixel/second`
     */
    get speed(): number
    {
        return this.uniforms.speed;
    }
    set speed(value: number)
    {
        this.uniforms.speed = value;
    }

    /**
     * The maximum radius of shockwave.
     * `< 0.0` means it's infinity.
     */
    get radius(): number
    {
        return this.uniforms.radius;
    }
    set radius(value: number)
    {
        this.uniforms.radius = value;
    }
}

export { ShockwaveFilter };
