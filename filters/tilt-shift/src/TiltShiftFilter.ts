import {TiltShiftXFilter} from './TiltShiftXFilter';
import {TiltShiftYFilter} from './TiltShiftYFilter';
import {Filter} from '@pixi/core';
import type {Point} from '@pixi/math';

/**
 * @author Vico @vicocotea
 * original filter https://github.com/evanw/glfx.js/blob/master/src/filters/blur/tiltshift.js by Evan Wallace : http://madebyevan.com/
 */

/**
 * A TiltShift Filter. Manages the pass of both a TiltShiftXFilter and TiltShiftYFilter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/tilt-shift.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-tilt-shift|@pixi/filter-tilt-shift}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
class TiltShiftFilter extends Filter {

    private tiltShiftXFilter: TiltShiftXFilter;
    private tiltShiftYFilter: TiltShiftYFilter;

    /**
     * @param {number} [blur=100] The strength of the blur.
     * @param {number} [gradientBlur=600] The strength of the gradient blur.
     * @param {PIXI.Point} [start=null] The Y value to start the effect at.
     * @param {PIXI.Point} [end=null] The Y value to end the effect at.
     */
    constructor(blur: number = 100, gradientBlur: number = 600, start?: Point, end?: Point) {
        super();
        this.tiltShiftXFilter = new TiltShiftXFilter(blur, gradientBlur, start, end);
        this.tiltShiftYFilter = new TiltShiftYFilter(blur, gradientBlur, start, end);
    }

    apply(filterManager, input, output) {
        let renderTarget = filterManager.getFilterTexture();
        this.tiltShiftXFilter.apply(filterManager, input, renderTarget, 1);
        this.tiltShiftYFilter.apply(filterManager, renderTarget, output);
        filterManager.returnFilterTexture(renderTarget);
    }

    /**
     * The strength of the blur.
     *
     * @member {number}
     */
    get blur(): number {
        return this.tiltShiftXFilter.blur;
    }
    set blur(value: number) {
        this.tiltShiftXFilter.blur = this.tiltShiftYFilter.blur = value;
    }

    /**
     * The strength of the gradient blur.
     *
     * @member {number}
     */
    get gradientBlur(): number {
        return this.tiltShiftXFilter.gradientBlur;
    }
    set gradientBlur(value: number) {
        this.tiltShiftXFilter.gradientBlur = this.tiltShiftYFilter.gradientBlur = value;
    }

    /**
     * The Y value to start the effect at.
     *
     * @member {PIXI.Point}
     */
    get start(): Point {
        return this.tiltShiftXFilter.start;
    }
    set start(value: Point) {
        this.tiltShiftXFilter.start = this.tiltShiftYFilter.start = value;
    }

    /**
     * The Y value to end the effect at.
     *
     * @member {PIXI.Point}
     */
    get end(): Point {
        return this.tiltShiftXFilter.end;
    }
    set end(value: Point) {
        this.tiltShiftXFilter.end = this.tiltShiftYFilter.end = value;
    }
}

export { TiltShiftFilter };

