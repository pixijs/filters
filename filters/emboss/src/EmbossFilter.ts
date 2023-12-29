import { vertex } from '@tools/fragments';
import fragment from './emboss.frag';
import { Filter, GlProgram } from 'pixi.js';

/**
 * An RGB Split Filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/emboss.png)
 *
 * @class
 * @extends Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-emboss|@pixi/filter-emboss}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export class EmbossFilter extends Filter
{
    /**
     * @param {number} [strength=5] - Strength of the emboss.
     */
    constructor(strength = 5)
    {
        const glProgram = new GlProgram({
            vertex,
            fragment,
            name: 'emboss-filter',
        });

        super({
            glProgram,
            resources: {},
        });

        // this.strength = strength;
    }

    /**
     * Strength of emboss.
     */
    // get strength(): number
    // {
    //     return this.uniforms.strength;
    // }
    // set strength(value: number)
    // {
    //     this.uniforms.strength = value;
    // }
}
