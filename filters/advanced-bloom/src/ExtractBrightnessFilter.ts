import { vertex } from '@tools/fragments';
import fragment from './extract-brightness.frag';
import { Filter, GlProgram } from 'pixi.js';

/**
 * Internal filter for AdvancedBloomFilter to get brightness.
 * @class
 * @private
 */
export class ExtractBrightnessFilter extends Filter
{
    /**
     * @param {number} [threshold] - Defines how bright a color needs to be extracted.
     */
    constructor(threshold = 0.5)
    {
        const glProgram = new GlProgram({
            vertex,
            fragment,
            name: 'extract-brightness-filter',
        });

        super({
            glProgram,
            resources: {},
        });

        // this.threshold = threshold;
    }

    /**
     * Defines how bright a color needs to be extracted.
     *
     * @default 0.5
     */
    // get threshold(): number
    // {
    //     return this.uniforms.threshold;
    // }
    // set threshold(value: number)
    // {
    //     this.uniforms.threshold = value;
    // }
}
