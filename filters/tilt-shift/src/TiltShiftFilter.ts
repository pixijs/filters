import { TiltShiftXFilter } from './TiltShiftXFilter';
import { TiltShiftYFilter } from './TiltShiftYFilter';
import { Filter, FilterSystem, RenderTexture } from 'pixi.js';
import type { Point, RenderSurface, Texture } from 'pixi.js';
import type { TiltShiftFilterOptions } from './TiltShiftAxisFilter';

// @author Vico @vicocotea
// original filter https://github.com/evanw/glfx.js/blob/master/src/filters/blur/tiltshift.js
// by Evan Wallace : http://madebyevan.com/

/**
 * A TiltShift Filter. Manages the pass of both a TiltShiftXFilter and TiltShiftYFilter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/tilt-shift.png)
 *
 * @class
 * @extends Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-tilt-shift|@pixi/filter-tilt-shift}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export class TiltShiftFilter extends Filter
{
    /** Default options */
    static readonly defaults: TiltShiftFilterOptions = {
        /** The strength of the blur. */
        blur: 100,
        /** The strength of the blur gradient */
        gradientBlur: 600,
        /** The position to start the effect at. */
        start: undefined,
        /** The position to end the effect at. */
        end: undefined,
    };

    private tiltShiftXFilter: TiltShiftXFilter;
    private tiltShiftYFilter: TiltShiftYFilter;

    /**
     * @param {TiltShiftFilterOptions} [options] - The optional parameters of the tilt shift filter.
     */
    constructor(options?: Partial<TiltShiftFilterOptions>);

    /**
     * @deprecated since 5.3.0
     * @param {number} [blur=100] - The strength of the blur.
     * @param {number} [gradientBlur=600] - The strength of the gradient blur.
     * @param {Point} [start=null] - The position to start the effect at.
     * @param {Point} [end=null] - The position to end the effect at.
     */
    constructor(blur?: number, gradientBlur?: number, start?: Point, end?: Point);

    /** @ignore */
    constructor(options?: Partial<TiltShiftFilterOptions> | number, gradientBlur?: number, start?: Point, end?: Point)
    {
        super();

        if (typeof options === 'number')
        {
            utils.deprecation('5.3.0', 'TiltShiftFilter constructor arguments is deprecated, use options.');
            options = { blur: options, gradientBlur, start, end };
        }

        options = Object.assign({}, TiltShiftFilter.defaults, options);

        this.tiltShiftXFilter = new TiltShiftXFilter(options as TiltShiftFilterOptions);
        this.tiltShiftYFilter = new TiltShiftYFilter(options as TiltShiftFilterOptions);
    }

    apply(filterManager: FilterSystem, input: Texture, output: RenderSurface, clear: boolean): void
    {
        const renderTarget = filterManager.getFilterTexture();

        this.tiltShiftXFilter.apply(filterManager, input, renderTarget, 1);
        this.tiltShiftYFilter.apply(filterManager, renderTarget, output, clearMode);
        filterManager.returnFilterTexture(renderTarget);
    }

    /** The strength of the blur. */
    get blur(): number
    {
        return this.tiltShiftXFilter.blur;
    }
    set blur(value: number)
    {
        this.tiltShiftXFilter.blur = this.tiltShiftYFilter.blur = value;
    }

    /** The strength of the gradient blur. */
    get gradientBlur(): number
    {
        return this.tiltShiftXFilter.gradientBlur;
    }
    set gradientBlur(value: number)
    {
        this.tiltShiftXFilter.gradientBlur = this.tiltShiftYFilter.gradientBlur = value;
    }

    /**
     * The position to start the effect at.
     *
     * @member {Point}
     */
    get start(): Point
    {
        return this.tiltShiftXFilter.start;
    }
    set start(value: Point)
    {
        this.tiltShiftXFilter.start = this.tiltShiftYFilter.start = value;
    }

    /**
     * The position to end the effect at.
     *
     * @member {Point}
     */
    get end(): Point
    {
        return this.tiltShiftXFilter.end;
    }
    set end(value: Point)
    {
        this.tiltShiftXFilter.end = this.tiltShiftYFilter.end = value;
    }
}

