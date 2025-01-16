import { FilterSystem, TexturePool } from 'pixi.js';
import { TiltShiftAxisFilter } from './TiltShiftAxisFilter';

import type { PointData, RenderSurface, Texture } from 'pixi.js';

/** Options for the TiltShiftFilter constructor. */
export interface TiltShiftFilterOptions
{
    /** The strength of the blur. */
    blur?: number;
    /** The strength of the blur gradient */
    gradientBlur?: number;
    /** The position to start the effect at. */
    start?: PointData;
    /** The position to end the effect at. */
    end?: PointData;
}

/**
 * A TiltShift Filter. Manages the pass of both a TiltShiftXFilter and TiltShiftYFilter.<br>
 * ![original](../screenshots/original.png)![filter](../screenshots/tilt-shift.png)
 *
 * author Vico @vicocotea
 * {@link https://github.com/evanw/glfx.js/blob/master/src/filters/blur/tiltshift.js original filter }
 * by {@link http://madebyevan.com/ Evan Wallace }
 *
 * @class
 * @extends Filter
 */
export class TiltShiftFilter extends TiltShiftAxisFilter
{
    private _tiltShiftYFilter: TiltShiftAxisFilter;

    /**
     * @param options - Options for the TiltShiftFilter constructor.
     */
    constructor(options?: TiltShiftFilterOptions)
    {
        options = { ...TiltShiftAxisFilter.DEFAULT_OPTIONS, ...options };

        super({ ...options, axis: 'horizontal' });
        this._tiltShiftYFilter = new TiltShiftAxisFilter({ ...options, axis: 'vertical' });

        this.updateDelta();

        Object.assign(this, options);
    }

    /**
     * Override existing apply method in `Filter`
     * @override
     * @ignore
     */
    public override apply(
        filterManager: FilterSystem,
        input: Texture,
        output: RenderSurface,
        clearMode: boolean,
    ): void
    {
        const renderTarget = TexturePool.getSameSizeTexture(input);

        filterManager.applyFilter(this, input, renderTarget, true);
        filterManager.applyFilter(this._tiltShiftYFilter, renderTarget, output, clearMode);

        TexturePool.returnTexture(renderTarget);
    }

    /** @ignore */
    public override updateDelta(): void
    {
        super.updateDelta();
        this._tiltShiftYFilter.updateDelta();
    }

    /** The strength of the blur. */
    get blur(): number { return this.uniforms.uBlur[0]; }
    set blur(value: number) { this.uniforms.uBlur[0] = this._tiltShiftYFilter.uniforms.uBlur[0] = value; }

    /** The strength of the gradient blur. */
    get gradientBlur(): number { return this.uniforms.uBlur[1]; }
    set gradientBlur(value: number) { this.uniforms.uBlur[1] = this._tiltShiftYFilter.uniforms.uBlur[1] = value; }

    /** The position to start the effect at. */
    get start(): PointData { return this.uniforms.uStart; }
    set start(value: PointData)
    {
        this.uniforms.uStart = this._tiltShiftYFilter.uniforms.uStart = value;
        this.updateDelta();
    }

    /** The position to start the effect at on the `x` axis. */
    get startX(): number { return this.start.x; }
    set startX(value: number)
    {
        this.start.x = value;
        this.updateDelta();
    }

    /** The position to start the effect at on the `x` axis. */
    get startY(): number { return this.start.y; }
    set startY(value: number)
    {
        this.start.y = value;
        this.updateDelta();
    }

    /** The position to end the effect at. */
    get end(): PointData { return this.uniforms.uEnd; }
    set end(value: PointData)
    {
        this.uniforms.uEnd = this._tiltShiftYFilter.uniforms.uEnd = value;
        this.updateDelta();
    }

    /** The position to end the effect at on the `x` axis. */
    get endX(): number { return this.end.x; }
    set endX(value: number)
    {
        this.end.x = value;
        this.updateDelta();
    }

    /** The position to end the effect at on the `y` axis. */
    get endY(): number { return this.end.y; }
    set endY(value: number)
    {
        this.end.y = value;
        this.updateDelta();
    }
}

