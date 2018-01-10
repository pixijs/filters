import {vertex} from '@tools/fragments';
import fragment from './extract-brightness.frag';
import * as PIXI from 'pixi.js';

/**
 * Internal filter for AdvancedBloomFilter to get brightness.
 * @class
 * @private
 * @param {number} [threshold=0.5] Defines how bright a color needs to be extracted.
 */
export default class ExtractBrightnessFilter extends PIXI.Filter {

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

