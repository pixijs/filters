import {vertex} from '@tools/fragments';
import fragment from './emboss.frag';
import {Filter} from '@pixi/core';

/**
 * An RGB Split Filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/emboss.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-emboss|@pixi/filter-emboss}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 * @param {number} [strength=5] Strength of the emboss.
 */
class EmbossFilter extends Filter {
    constructor(strength = 5){
        super(vertex, fragment);
        this.strength = strength;
    }

    /**
     * Strength of emboss.
     *
     * @member {number}
     */
    get strength() {
        return this.uniforms.strength;
    }
    set strength(value) {
        this.uniforms.strength = value;
    }
}

export { EmbossFilter };
