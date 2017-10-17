import vertex from './extract-brightness.vert';
import fragment from './extract-brightness.frag';

/**
 * Internal filter for AdvancedBloomFilter to get brightness.
 * @class
 * @private
 * @param {number} [threshold=0.5] The minimum amount of brightness considered.
 */
export default class ExtractBrightnessFilter extends PIXI.Filter {

    constructor(threshold = 0.5) {
        super(vertex, fragment);

        this.threshold = threshold;
    }

    /**
     * The minimum amount of brightness considered.
     *
     * @member {number}
     * @default 0.5
     */
    get threshold() {
        return this.uniforms.threshold;
    }
    set threshold(value) {
        this.uniforms.threshold = value;
    }
}

