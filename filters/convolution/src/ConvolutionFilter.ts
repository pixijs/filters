import { vertex } from '@tools/fragments';
import fragment from './convolution.frag';
import { Filter } from '@pixi/core';

/**
 * The ConvolutionFilter class applies a matrix convolution filter effect.
 * A convolution combines pixels in the input image with neighboring pixels to produce a new image.
 * A wide variety of image effects can be achieved through convolutions, including blurring, edge
 * detection, sharpening, embossing, and beveling. The matrix should be specified as a 9 point Array.
 * See https://docs.gimp.org/2.10/en/gimp-filter-convolution-matrix.html for more info.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/convolution.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-convolution|@pixi/filter-convolution}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
class ConvolutionFilter extends Filter
{
    /**
     * @param {number[]} [matrix=[0,0,0,0,0,0,0,0,0]] An array of values used for matrix transformation. Specified as a 9 point Array.
     * @param {number} [width=200] Width of the object you are transforming
     * @param {number} [height=200] Height of the object you are transforming
     */
    constructor(matrix: number[], width = 200, height = 200)
    {
        super(vertex, fragment);
        this.uniforms.texelSize = new Float32Array(2);
        this.uniforms.matrix = new Float32Array(9);
        if (matrix !== undefined)
        {
            this.matrix = matrix;
        }
        this.width = width;
        this.height = height;
    }

    /**
     * An array of values used for matrix transformation. Specified as a 9 point Array.
     *
     * @member {Array<number>}
     */
    get matrix(): number[]
    {
        return this.uniforms.matrix;
    }
    set matrix(matrix: number[])
    {
        matrix.forEach((v, i) => this.uniforms.matrix[i] = v);
    }

    /**
     * Width of the object you are transforming
     *
     * @member {number}
     */
    get width(): number
    {
        return 1 / this.uniforms.texelSize[0];
    }
    set width(value: number)
    {
        this.uniforms.texelSize[0] = 1 / value;
    }

    /**
     * Height of the object you are transforming
     *
     * @member {number}
     */
    get height(): number
    {
        return 1 / this.uniforms.texelSize[1];
    }
    set height(value: number)
    {
        this.uniforms.texelSize[1] = 1 / value;
    }
}

export { ConvolutionFilter };
