import { vertex } from '@tools/fragments';
import fragment from './bevel.frag';
import { Filter } from '@pixi/core';
import { DEG_TO_RAD } from '@pixi/math';
import { rgb2hex, hex2rgb } from '@pixi/utils';

interface BevelFilterOptions {
    rotation: number,
    thickness: number,
    lightColor: number,
    lightAlpha: number,
    shadowColor: number,
    shadowAlpha: number,
}

/**
 * Bevel Filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/bevel.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-bevel|@pixi/filter-bevel}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
class BevelFilter extends Filter
{
    private _thickness = 2;
    private _angle = 0;

    /**
     * @param {object} [options] - The optional parameters of the filter.
     * @param {number} [options.rotation = 45] - The angle of the light in degrees.
     * @param {number} [options.thickness = 2] - The tickness of the bevel.
     * @param {number} [options.lightColor = 0xffffff] - Color of the light.
     * @param {number} [options.lightAlpha = 0.7] - Alpha of the light.
     * @param {number} [options.shadowColor = 0x000000] - Color of the shadow.
     * @param {number} [options.shadowAlpha = 0.7] - Alpha of the shadow.
     */
    constructor(options?: Partial<BevelFilterOptions>)
    {
        super(vertex, fragment);

        this.uniforms.lightColor = new Float32Array(3);
        this.uniforms.shadowColor = new Float32Array(3);

        Object.assign(this, {
            rotation: 45,
            thickness: 2,
            lightColor: 0xffffff,
            lightAlpha: 0.7,
            shadowColor: 0x000000,
            shadowAlpha: 0.7,
        }, options);

        // Workaround: https://github.com/pixijs/pixi-filters/issues/230
        // applies correctly only if there is at least a single-pixel padding with alpha=0 around an image
        // To solve this problem, a padding of 1 put on the filter should suffice
        this.padding = 1;
    }

    /**
     * Update the transform matrix of offset angle.
     * @private
     */
    private _updateTransform()
    {
        this.uniforms.transformX = this._thickness * Math.cos(this._angle);
        this.uniforms.transformY = this._thickness * Math.sin(this._angle);
    }

    /**
     * The angle of the light in degrees.
     * @member {number}
     * @default 45
     */
    get rotation(): number
    {
        return this._angle / DEG_TO_RAD;
    }
    set rotation(value: number)
    {
        this._angle = value * DEG_TO_RAD;
        this._updateTransform();
    }

    /**
     * The tickness of the bevel.
     * @member {number}
     * @default 2
     */
    get thickness(): number
    {
        return this._thickness;
    }
    set thickness(value: number)
    {
        this._thickness = value;
        this._updateTransform();
    }

    /**
     * Color of the light.
     * @member {number}
     * @default 0xffffff
     */
    get lightColor(): number
    {
        return rgb2hex(this.uniforms.lightColor);
    }
    set lightColor(value: number)
    {
        hex2rgb(value, this.uniforms.lightColor);
    }

    /**
     * Alpha of the light.
     * @member {number}
     * @default 0.7
     */
    get lightAlpha(): number
    {
        return this.uniforms.lightAlpha;
    }
    set lightAlpha(value: number)
    {
        this.uniforms.lightAlpha = value;
    }

    /**
     * Color of the shadow.
     * @member {number}
     * @default 0x000000
     */
    get shadowColor(): number
    {
        return rgb2hex(this.uniforms.shadowColor);
    }
    set shadowColor(value: number)
    {
        hex2rgb(value, this.uniforms.shadowColor);
    }

    /**
     * Alpha of the shadow.
     * @member {number}
     * @default 0.7
     */
    get shadowAlpha(): number
    {
        return this.uniforms.shadowAlpha;
    }
    set shadowAlpha(value: number)
    {
        this.uniforms.shadowAlpha = value;
    }
}

export { BevelFilter };
export type { BevelFilterOptions };
