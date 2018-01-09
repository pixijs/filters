import TiltShiftXFilter from './TiltShiftXFilter';
import TiltShiftYFilter from './TiltShiftYFilter';
import * as PIXI from 'pixi.js';

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
 * @param {number} [blur=100] The strength of the blur.
 * @param {number} [gradientBlur=600] The strength of the gradient blur.
 * @param {PIXI.Point} [start=null] The Y value to start the effect at.
 * @param {PIXI.Point} [end=null] The Y value to end the effect at.
 */
export default class TiltShiftFilter extends PIXI.Filter {

    constructor(blur = 100, gradientBlur = 600, start = null, end = null) {
        super();
        this.tiltShiftXFilter = new TiltShiftXFilter(blur, gradientBlur, start, end);
        this.tiltShiftYFilter = new TiltShiftYFilter(blur, gradientBlur, start, end);
    }

    apply(filterManager, input, output) {
        let renderTarget = filterManager.getRenderTarget(true);
        this.tiltShiftXFilter.apply(filterManager, input, renderTarget);
        this.tiltShiftYFilter.apply(filterManager, renderTarget, output);
        filterManager.returnRenderTarget(renderTarget);
    }

    /**
     * The strength of the blur.
     *
     * @member {number}
     */
    get blur() {
        return this.tiltShiftXFilter.blur;
    }
    set blur(value) {
        this.tiltShiftXFilter.blur = this.tiltShiftYFilter.blur = value;
    }

    /**
     * The strength of the gradient blur.
     *
     * @member {number}
     */
    get gradientBlur() {
        return this.tiltShiftXFilter.gradientBlur;
    }
    set gradientBlur(value) {
        this.tiltShiftXFilter.gradientBlur = this.tiltShiftYFilter.gradientBlur = value;
    }

    /**
     * The Y value to start the effect at.
     *
     * @member {PIXI.Point}
     */
    get start() {
        return this.tiltShiftXFilter.start;
    }
    set start(value) {
        this.tiltShiftXFilter.start = this.tiltShiftYFilter.start = value;
    }

    /**
     * The Y value to end the effect at.
     *
     * @member {PIXI.Point}
     */
    get end() {
        return this.tiltShiftXFilter.end;
    }
    set end(value) {
        this.tiltShiftXFilter.end = this.tiltShiftYFilter.end = value;
    }
}
