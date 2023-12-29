import { vertex } from '@tools/fragments';
import fragment from './tilt-shift.frag';
import { Filter, GlProgram, Point } from 'pixi.js';

// @author Vico @vicocotea
// original filter https://github.com/evanw/glfx.js/blob/master/src/filters/blur/tiltshift.js
// by Evan Wallace : http://madebyevan.com/

/**
 * Options for creating filter.
 */
export interface TiltShiftFilterOptions
{
    /** The strength of the blur. */
    blur: number;
    /** The strength of the blur gradient */
    gradientBlur: number;
    /** The position to start the effect at. */
    start?: Point | undefined;
    /** The position to end the effect at. */
    end?: Point | undefined;
}

/**
 * A TiltShiftAxisFilter.
 *
 * @class
 * @extends Filter
 * @private
 */
export class TiltShiftAxisFilter extends Filter
{
    constructor(options: TiltShiftFilterOptions)
    {
        const glProgram = new GlProgram({
            vertex,
            fragment,
            name: 'tilt-shift-axis-filter',
        });

        super({
            glProgram,
            resources: {},
        });

        // this.uniforms.blur = options.blur;
        // this.uniforms.gradientBlur = options.gradientBlur;
        // this.uniforms.start = options.start ?? new Point(0, window.innerHeight / 2);
        // this.uniforms.end = options.end ?? new Point(600, window.innerHeight / 2);
        // this.uniforms.delta = new Point(30, 30);
        // this.uniforms.texSize = new Point(window.innerWidth, window.innerHeight);
        this.updateDelta();
    }

    /**
     * Updates the filter delta values.
     * This is overridden in the X and Y filters, does nothing for this class.
     *
     */
    protected updateDelta(): void
    {
        // this.uniforms.delta.x = 0;
        // this.uniforms.delta.y = 0;
    }

    /**
     * The strength of the blur.
     *
     * @memberof TiltShiftAxisFilter#
     */
    // get blur(): number
    // {
    //     return this.uniforms.blur;
    // }
    // set blur(value: number)
    // {
    //     this.uniforms.blur = value;
    // }

    /**
     * The strength of the gradient blur.
     *
     * @memberof TiltShiftAxisFilter#
     */
    // get gradientBlur(): number
    // {
    //     return this.uniforms.gradientBlur;
    // }
    // set gradientBlur(value: number)
    // {
    //     this.uniforms.gradientBlur = value;
    // }

    /**
     * The X value to start the effect at.
     *
     * @member {Point}
     * @memberof TiltShiftAxisFilter#
     */
    // get start(): Point
    // {
    //     return this.uniforms.start;
    // }
    // set start(value: Point)
    // {
    //     this.uniforms.start = value;
    //     this.updateDelta();
    // }

    /**
     * The X value to end the effect at.
     *
     * @member {Point}
     * @memberof TiltShiftAxisFilter#
     */
    // get end(): Point
    // {
    //     return this.uniforms.end;
    // }
    // set end(value: Point)
    // {
    //     this.uniforms.end = value;
    //     this.updateDelta();
    // }
}
