import {vertex} from '@tools/fragments';
import fragment from './rgb-split.frag';
import {Filter} from '@pixi/core';

/**
 * An RGB Split Filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/rgb.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-rgb-split|@pixi/filter-rgb-split}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 * @param {PIXI.Point} [red=[-10,0]] Red channel offset
 * @param {PIXI.Point} [green=[0, 10]] Green channel offset
 * @param {PIXI.Point} [blue=[0, 0]] Blue channel offset
 */
class RGBSplitFilter extends Filter {
    constructor(red = [-10, 0], green = [0, 10], blue = [0, 0]) {
        super(vertex, fragment);
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    /**
     * Red channel offset.
     *
     * @member {PIXI.Point}
     */
    get red() {
        return this.uniforms.red;
    }
    set red(value) {
        this.uniforms.red = value;
    }

    /**
     * Green channel offset.
     *
     * @member {PIXI.Point}
     */
    get green() {
        return this.uniforms.green;
    }
    set green(value) {
        this.uniforms.green = value;
    }

    /**
     * Blue offset.
     *
     * @member {PIXI.Point}
     */
    get blue() {
        return this.uniforms.blue;
    }
    set blue(value) {
        this.uniforms.blue = value;
    }
}

export { RGBSplitFilter };

