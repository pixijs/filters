import { Filter, GlProgram } from 'pixi.js';
import { vertex } from '@tools/fragments';
import fragment from './grayscale.frag';

/**
 * This filter applies a grayscale effect.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/grayscale.png)
 *
 * @class
 * @extends Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-grayscale|@pixi/filter-grayscale}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export class GrayscaleFilter extends Filter
{
    constructor()
    {
        const glProgram = new GlProgram({
            vertex,
            fragment,
            name: 'grayscale-filter',
        });

        super({
            glProgram,
            resources: {},
        });
    }
}
