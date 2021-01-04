import { Filter } from '@pixi/core';
import { BLEND_MODES } from '@pixi/constants';
import { AlphaFilter } from '@pixi/filter-alpha';
import { BlurFilterPass } from '@pixi/filter-blur';
import { settings } from '@pixi/settings';
import { Point } from '@pixi/math';
import type { FilterSystem, RenderTexture } from '@pixi/core';
import type { CLEAR_MODES } from '@pixi/constants';

type BlurValue = number | Point | number[];

/**
 * The BloomFilter applies a Gaussian blur to an object.
 * The strength of the blur can be set for x- and y-axis separately.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/bloom.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-bloom|@pixi/filter-bloom}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
class BloomFilter extends Filter
{
    private blurXFilter: BlurFilterPass;
    private blurYFilter: BlurFilterPass;
    private defaultFilter: AlphaFilter;

    /**
    * @param {number|PIXI.Point|number[]} [blur=2] Sets the strength of both the blurX and blurY properties simultaneously
    * @param {number} [quality=4] The quality of the blurX & blurY filter.
    * @param {number} [resolution=PIXI.settings.FILTER_RESOLUTION] The resolution of the blurX & blurY filter.
    * @param {number} [kernelSize=5] The kernelSize of the blurX & blurY filter.Options: 5, 7, 9, 11, 13, 15.
    */
    constructor(blur: BlurValue = 2, quality = 4, resolution: number = settings.FILTER_RESOLUTION, kernelSize = 5)
    {
        super();

        let blurX;
        let blurY;

        if (typeof blur === 'number')
        {
            blurX = blur;
            blurY = blur;
        }
        else if (blur instanceof Point)
        {
            blurX = blur.x;
            blurY = blur.y;
        }
        else if (Array.isArray(blur))
        {
            blurX = blur[0];
            blurY = blur[1];
        }

        this.blurXFilter = new BlurFilterPass(true, blurX, quality, resolution, kernelSize);
        this.blurYFilter = new BlurFilterPass(false, blurY, quality, resolution, kernelSize);
        this.blurYFilter.blendMode = BLEND_MODES.SCREEN;
        this.defaultFilter = new AlphaFilter();
    }

    apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clear: CLEAR_MODES): void
    {
        const renderTarget = filterManager.getFilterTexture();

        // TODO - copyTexSubImage2D could be used here?
        this.defaultFilter.apply(filterManager, input, output, clear);

        this.blurXFilter.apply(filterManager, input, renderTarget, 1);
        this.blurYFilter.apply(filterManager, renderTarget, output, 0);

        filterManager.returnFilterTexture(renderTarget);
    }

    /**
     * Sets the strength of both the blurX and blurY properties simultaneously
     *
     * @member {number}
     * @default 2
     */
    get blur(): number
    {
        return this.blurXFilter.blur;
    }
    set blur(value: number)
    {
        this.blurXFilter.blur = this.blurYFilter.blur = value;
    }

    /**
     * Sets the strength of the blurX property
     *
     * @member {number}
     * @default 2
     */
    get blurX(): number
    {
        return this.blurXFilter.blur;
    }
    set blurX(value: number)
    {
        this.blurXFilter.blur = value;
    }

    /**
     * Sets the strength of the blurY property
     *
     * @member {number}
     * @default 2
     */
    get blurY(): number
    {
        return this.blurYFilter.blur;
    }
    set blurY(value: number)
    {
        this.blurYFilter.blur = value;
    }
}

export { BloomFilter };

