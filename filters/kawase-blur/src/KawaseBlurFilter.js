import {vertex} from '@tools/fragments';
import fragment from './kawase-blur.frag';
import fragmentClamp from './kawase-blur-clamp.frag';
import * as PIXI from 'pixi.js';

/**
 * A much faster blur than Gaussian blur, but more complicated to use.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/kawase-blur.png)
 *
 * @see https://software.intel.com/en-us/blogs/2014/07/15/an-investigation-of-fast-real-time-gpu-based-image-blur-algorithms
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number|number[]} [blur=4] - The blur of the filter. Should be greater than `0`. If
 *        value is an Array, setting kernels.
 * @param {number} [quality=3] - The quality of the filter. Should be an integer greater than `1`.
 * @param {boolean} [clamp=false] - Clamp edges, useful for removing dark edges
 *        from fullscreen filters or bleeding to the edge of filterArea.
 */
export default class KawaseBlurFilter extends PIXI.Filter {
    constructor(blur = 4, quality = 3, clamp = false) {
        super(vertex, clamp ? fragmentClamp : fragment);
        this.uniforms.uOffset = new Float32Array(2);

        this._pixelSize = new PIXI.Point();
        this.pixelSize = 1;
        this._clamp = clamp;
        this._kernels = null;

        // if `blur` is array , as kernels
        if (Array.isArray(blur)) {
            this.kernels = blur;
        }
        else {
            this._blur = blur;
            this.quality = quality;
        }
    }

    /**
     * Overrides apply
     * @private
     */
    apply(filterManager, input, output, clear) {
        const uvX = this.pixelSize.x / input.size.width;
        const uvY = this.pixelSize.y / input.size.height;
        let offset;

        if (this._quality === 1 || this._blur === 0) {
            offset = this._kernels[0] + 0.5;
            this.uniforms.uOffset[0] = offset * uvX;
            this.uniforms.uOffset[1] = offset * uvY;
            filterManager.applyFilter(this, input, output, clear);
        }
        else {
            const renderTarget = filterManager.getRenderTarget(true);

            let source = input;
            let target = renderTarget;
            let tmp;

            const last = this._quality - 1;

            for (let i = 0; i < last; i++) {
                offset = this._kernels[i] + 0.5;
                this.uniforms.uOffset[0] = offset * uvX;
                this.uniforms.uOffset[1] = offset * uvY;
                filterManager.applyFilter(this, source, target, true);

                tmp = source;
                source = target;
                target = tmp;
            }
            offset = this._kernels[last] + 0.5;
            this.uniforms.uOffset[0] = offset * uvX;
            this.uniforms.uOffset[1] = offset * uvY;
            filterManager.applyFilter(this, source, output, clear);

            filterManager.returnRenderTarget(renderTarget);
        }
    }

    /**
     * Auto generate kernels by blur & quality
     * @private
     */
    _generateKernels() {
        const blur = this._blur;
        const quality = this._quality;
        const kernels = [ blur ];

        if (blur > 0) {
            let k = blur;
            const step = blur / quality;

            for (let i = 1; i < quality; i++) {
                k -= step;
                kernels.push(k);
            }
        }

        this._kernels = kernels;
    }

    /**
     * The kernel size of the blur filter, for advanced usage.
     *
     * @member {number[]}
     * @default [0]
     */
    get kernels() {
        return this._kernels;
    }
    set kernels(value) {
        if (Array.isArray(value) && value.length > 0) {
            this._kernels = value;
            this._quality = value.length;
            this._blur = Math.max.apply(Math, value);
        }
        else {
            // if value is invalid , set default value
            this._kernels = [0];
            this._quality = 1;
        }
    }

    /**
     * Get the if the filter is clampped.
     *
     * @readonly
     * @member {boolean}
     * @default false
     */
    get clamp() {
        return this._clamp;
    }

    /**
     * Sets the pixel size of the filter. Large size is blurrier. For advanced usage.
     *
     * @member {PIXI.Point|number[]}
     * @default [1, 1]
     */
    set pixelSize(value) {
        if (typeof value === 'number') {
            this._pixelSize.x = value;
            this._pixelSize.y = value;
        }
        else if (Array.isArray(value)) {
            this._pixelSize.x = value[0];
            this._pixelSize.y = value[1];
        }
        else if (value instanceof PIXI.Point) {
            this._pixelSize.x = value.x;
            this._pixelSize.y = value.y;
        }
        else {
            // if value is invalid , set default value
            this._pixelSize.x = 1;
            this._pixelSize.y = 1;
        }
    }
    get pixelSize() {
        return this._pixelSize;
    }

    /**
     * The quality of the filter, integer greater than `1`.
     *
     * @member {number}
     * @default 3
     */
    get quality() {
        return this._quality;
    }
    set quality(value) {
        this._quality = Math.max(1, Math.round(value));
        this._generateKernels();
    }

    /**
     * The amount of blur, value greater than `0`.
     *
     * @member {number}
     * @default 4
     */
    get blur() {
        return this._blur;
    }
    set blur(value) {
        this._blur = value;
        this._generateKernels();
    }
}
