import { vertex } from '@tools/fragments';
import fragment from './tilt-shift.frag';
import { Filter } from '@pixi/core';
import { Point } from '@pixi/math';

// @author Vico @vicocotea
// original filter https://github.com/evanw/glfx.js/blob/master/src/filters/blur/tiltshift.js
// by Evan Wallace : http://madebyevan.com/

/**
 * A TiltShiftAxisFilter.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @private
 */
class TiltShiftAxisFilter extends Filter
{
    constructor(blur = 100, gradientBlur = 600, start?: Point, end?: Point)
    {
        super(vertex, fragment);
        this.uniforms.blur = blur;
        this.uniforms.gradientBlur = gradientBlur;
        this.uniforms.start = start || new Point(0, window.innerHeight / 2);
        this.uniforms.end = end || new Point(600, window.innerHeight / 2);
        this.uniforms.delta = new Point(30, 30);
        this.uniforms.texSize = new Point(window.innerWidth, window.innerHeight);
        this.updateDelta();
    }

    /**
     * Updates the filter delta values.
     * This is overridden in the X and Y filters, does nothing for this class.
     *
     */
    protected updateDelta(): void
    {
        this.uniforms.delta.x = 0;
        this.uniforms.delta.y = 0;
    }

    /**
     * The strength of the blur.
     *
     * @memberof PIXI.filters.TiltShiftAxisFilter#
     */
    get blur(): number
    {
        return this.uniforms.blur;
    }
    set blur(value: number)
    {
        this.uniforms.blur = value;
    }

    /**
     * The strength of the gradient blur.
     *
     * @memberof PIXI.filters.TiltShiftAxisFilter#
     */
    get gradientBlur(): number
    {
        return this.uniforms.gradientBlur;
    }
    set gradientBlur(value: number)
    {
        this.uniforms.gradientBlur = value;
    }

    /**
     * The X value to start the effect at.
     *
     * @member {PIXI.Point}
     * @memberof PIXI.filters.TiltShiftAxisFilter#
     */
    get start(): Point
    {
        return this.uniforms.start;
    }
    set start(value: Point)
    {
        this.uniforms.start = value;
        this.updateDelta();
    }

    /**
     * The X value to end the effect at.
     *
     * @member {PIXI.Point}
     * @memberof PIXI.filters.TiltShiftAxisFilter#
     */
    get end(): Point
    {
        return this.uniforms.end;
    }
    set end(value: Point)
    {
        this.uniforms.end = value;
        this.updateDelta();
    }
}

export { TiltShiftAxisFilter };
