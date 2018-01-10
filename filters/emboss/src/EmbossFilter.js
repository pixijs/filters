import {vertex} from '@tools/fragments';
import fragment from './emboss.frag';
import * as PIXI from 'pixi.js';

/**
 * An RGB Split Filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/emboss.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [strength=5] Strength of the emboss.
 */
export default class EmbossFilter extends PIXI.Filter {
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
