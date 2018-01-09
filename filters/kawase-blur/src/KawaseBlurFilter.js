import {vertex} from '@tools/fragments';
import fragment from './kawase-blur.frag';

/**
 * A much faster blur than Gaussian blur, but more complicated to use.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/kawase-blur.png)
 *
 * @see https://software.intel.com/en-us/blogs/2014/07/15/an-investigation-of-fast-real-time-gpu-based-image-blur-algorithms
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number[]} [kernels=[0]] - The kernel size of the blur filter
 * @param {number|number[]|PIXI.Point} [pixelSize=1] - The offset of the blur filter.
 */
export default class KawaseBlurFilter extends PIXI.Filter {
    constructor(kernels = [0], pixelSize = 1) {
        super(vertex, fragment);

        this._passes = 0;
        this._kernels = null;
        this.kernels = kernels;

        this._pixelSize = new PIXI.Point();
        this.pixelSize = pixelSize;
    }

    /**
     * Overrides apply
     * @private
     */
    apply(filterManager, input, output, clear) {
        const uvX = this.pixelSize.x / input.size.width;
        const uvY = this.pixelSize.y / input.size.height;
        let offset;

        if (this._passes === 1) {
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

            const last = this._passes - 1;

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
     * The kernel size of the blur filter
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
            this._passes = value.length;
        }
        else {
            // if value is invalid , set default value
            this._kernels = [0];
            this._passes = 1;
        }
    }

    /**
     * Sets the pixel size of the filter. Large size is blurrier
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
}

// Export to PixiJS namespace
PIXI.filters.KawaseBlurFilter = KawaseBlurFilter;
