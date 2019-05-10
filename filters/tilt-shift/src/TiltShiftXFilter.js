import {TiltShiftAxisFilter} from './TiltShiftAxisFilter';

/**
 * @author Vico @vicocotea
 * original filter https://github.com/evanw/glfx.js/blob/master/src/filters/blur/tiltshift.js by Evan Wallace : http://madebyevan.com/
 */

/**
 * A TiltShiftXFilter.
 *
 * @class
 * @extends PIXI.TiltShiftAxisFilter
 * @memberof PIXI.filters
 * @private
 */
class TiltShiftXFilter extends TiltShiftAxisFilter {
    /**
     * Updates the filter delta values.
     */
    updateDelta() {
        const dx = this.uniforms.end.x - this.uniforms.start.x;
        const dy = this.uniforms.end.y - this.uniforms.start.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        this.uniforms.delta.x = dx / d;
        this.uniforms.delta.y = dy / d;
    }
}

export { TiltShiftXFilter };
