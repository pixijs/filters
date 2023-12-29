import { vertex } from '@tools/fragments';
import fragment from './rgb-split.frag';
import { Filter, GlProgram } from 'pixi.js';
import type { Point } from 'pixi.js';

type Offset = [number, number] | Point;

/**
 * An RGB Split Filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/rgb.png)
 *
 * @class
 * @extends Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-rgb-split|@pixi/filter-rgb-split}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export class RGBSplitFilter extends Filter
{
    /**
     * @param {Point | number[]} [red=[-10,0]] - Red channel offset
     * @param {Point | number[]} [green=[0, 10]] - Green channel offset
     * @param {Point | number[]} [blue=[0, 0]] - Blue channel offset
     */
    constructor(red: Offset = [-10, 0], green: Offset = [0, 10], blue: Offset = [0, 0])
    {
        const glProgram = new GlProgram({
            vertex,
            fragment,
            name: 'rgb-split-filter',
        });

        super({
            glProgram,
            resources: {},
        });
        // this.red = red;
        // this.green = green;
        // this.blue = blue;
    }

    /**
     * Red channel offset.
     *
     * @member {Point | number[]}
     */
    // get red(): Offset
    // {
    //     return this.uniforms.red;
    // }
    // set red(value: Offset)
    // {
    //     this.uniforms.red = value;
    // }

    /**
     * Green channel offset.
     *
     * @member {Point | number[]}
     */
    // get green(): Offset
    // {
    //     return this.uniforms.green;
    // }
    // set green(value: Offset)
    // {
    //     this.uniforms.green = value;
    // }

    /**
     * Blue offset.
     *
     * @member {Point | number[]}
     */
    // get blue(): Offset
    // {
    //     return this.uniforms.blue;
    // }
    // set blue(value: Offset)
    // {
    //     this.uniforms.blue = value;
    // }
}
