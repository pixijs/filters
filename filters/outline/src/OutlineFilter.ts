import { vertex } from '@tools/fragments';
import fragment from './outline.frag';
import { Filter, utils } from '@pixi/core';
import type { FilterSystem, RenderTexture, CLEAR_MODES } from '@pixi/core';

/**
 * OutlineFilter, originally by mishaa
 * http://www.html5gamedevs.com/topic/10640-outline-a-sprite-change-certain-colors/?p=69966
 * http://codepen.io/mishaa/pen/emGNRB<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/outline.png)
 *
 * @class
 * @extends PIXI.Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-outline|@pixi/filter-outline}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters} *
 * @example
 *  someSprite.filters = [new OutlineFilter(2, 0x99ff99)];
 */
class OutlineFilter extends Filter
{
    /** The minimum number of samples for rendering outline. */
    public static MIN_SAMPLES = 1;

    /** The maximum number of samples for rendering outline. */
    public static MAX_SAMPLES = 100;

    private _thickness = 1;

    /**
     * @param {number} [thickness=1] - The tickness of the outline. Make it 2 times more for resolution 2
     * @param {number} [color=0x000000] - The color of the outline.
     * @param {number} [quality=0.1] - The quality of the outline from `0` to `1`, using a higher quality
     *        setting will result in slower performance and more accuracy.
     */
    constructor(thickness = 1, color = 0x000000, quality = 0.1)
    {
        super(vertex, fragment.replace(/\$\{angleStep\}/, OutlineFilter.getAngleStep(quality)));

        this.uniforms.thickness = new Float32Array([0, 0]);
        this.uniforms.outlineColor = new Float32Array([0, 0, 0, 1]);

        Object.assign(this, { thickness, color, quality });
    }

    /**
     * Get the angleStep by quality
     * @private
     */
    private static getAngleStep(quality: number): string
    {
        const samples =  Math.max(
            quality * OutlineFilter.MAX_SAMPLES,
            OutlineFilter.MIN_SAMPLES,
        );

        return (Math.PI * 2 / samples).toFixed(7);
    }

    apply(filterManager: FilterSystem, input: RenderTexture, output: RenderTexture, clear: CLEAR_MODES): void
    {
        this.uniforms.thickness[0] = this._thickness / input._frame.width;
        this.uniforms.thickness[1] = this._thickness / input._frame.height;

        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * The color of the glow.
     * @default 0x000000
     */
    get color(): number
    {
        return utils.rgb2hex(this.uniforms.outlineColor);
    }
    set color(value: number)
    {
        utils.hex2rgb(value, this.uniforms.outlineColor);
    }

    /**
     * The thickness of the outline.
     * @default 1
     */
    get thickness(): number
    {
        return this._thickness;
    }
    set thickness(value: number)
    {
        this._thickness = value;
        this.padding = value;
    }
}

export { OutlineFilter };
