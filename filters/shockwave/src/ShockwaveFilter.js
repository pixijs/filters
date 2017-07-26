import {vertex} from '@tools/fragments';
import fragment from './shockwave.frag';

/**
 * The ColorMatrixFilter class lets you apply a 4x4 matrix transformation on the RGBA
 * color and alpha values of every pixel on your displayObject to produce a result
 * with a new set of RGBA color and alpha values. It's pretty powerful!
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {PIXI.Point} [center=[0.5, 0.5]] See center property
 * @param {Array<number>} [params=[10, 0.8, 0.1]] See params property
 * @param {number} [time=0] See time property
 */
export default class ShockwaveFilter extends PIXI.Filter {

    constructor(center = [0.5, 0.5], params = [10, 0.8, 0.1], time = 0) {
        super(vertex, fragment, {
            center: { type: 'v2', value: { x: 0.5, y: 0.5 } },
            params: { type: 'v3', value: { x: 10, y: 0.8, z: 0.1 } },
            time: { type: '1f', value: 0 },
            dimensions: { type: '2f', value: [0, 0] }
        });

        this.center = center;
        this.params = params;
        this.time = time;
    }

    apply(filterManager, input, output) {
        this.uniforms.dimensions[0] = input.sourceFrame.width;
        this.uniforms.dimensions[1] = input.sourceFrame.height;
        filterManager.applyFilter(this, input, output);
    }

    /**
     * Sets the center of the shockwave in normalized screen coords. That is
     * (0,0) is the top-left and (1,1) is the bottom right.
     *
     * @member {PIXI.Point}
     */
    get center() {
        return this.uniforms.center;
    }
    set center(value) {
        this.uniforms.center = value;
    }

    /**
     * Sets the params of the shockwave. These modify the look and behavior of
     * the shockwave as it ripples out.
     *
     * @member {Array<number>}
     */
    get params() {
        return this.uniforms.params;
    }
    set params(value) {
        this.uniforms.params = value;
    }

    /**
     * Sets the elapsed time of the shockwave. This controls the speed at which
     * the shockwave ripples out.
     *
     * @member {number}
     */
    get time() {
        return this.uniforms.time;
    }
    set time(value) {
        this.uniforms.time = value;
    }
}
