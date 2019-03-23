import {vertex} from '@tools/fragments';
import fragment from './extract-brightness.frag';
import {Filter} from '@pixi/core';

/**
 * Internal filter for AdvancedBloomFilter to get brightness.
 * @class
 * @private
 * @param {number} [threshold=0.5] Defines how bright a color needs to be extracted.
 */
export class ExtractBrightnessFilter extends Filter {

    constructor(threshold = 0.5) {
        super(vertex, fragment);

        this.threshold = threshold;
    }

    /**
     * Defines how bright a color needs to be extracted.
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

