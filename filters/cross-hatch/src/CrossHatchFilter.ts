import { vertex } from '@tools/fragments';
import fragment from './crosshatch.frag';
import { Filter, GlProgram } from 'pixi.js';

/**
 * A Cross Hatch effect filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/cross-hatch.png)
 *
 * @class
 * @extends Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-cross-hatch|@pixi/filter-cross-hatch}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export class CrossHatchFilter extends Filter
{
    constructor()
    {
        const glProgram = new GlProgram({
            vertex,
            fragment,
            name: 'cross-hatch-filter',
        });

        super({
            glProgram,
            resources: {},
        });
    }
}
