import { deprecation, Filter, GlProgram, GpuProgram, PointData } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './convolution.frag';
import source from './convolution.wgsl';

type FixedArray<T, L extends number> = [ T, ...Array<T> ] & { length: L };

export type ConvolutionMatrix = Float32Array | FixedArray<number, 9>;

/** Options for the ConvolutionFilter constructor. */
export interface ConvolutionFilterOptions
{
    /**
     * An array of values used for matrix transformation, specified as a 9 point Array
     * @example
     * const matrix = new Float32Array(9); // 9 elements of value 0
     * const matrix = [0,0.5,0,0.5,1,0.5,0,0.5,0];
     * @default [0,0,0,0,0,0,0,0,0]
     */
    matrix?: ConvolutionMatrix;
    /**
     * Width of the object you are transforming
     * @default 200
     */
    width?: number;
    /**
     * Height of the object you are transforming
     * @default 200
     */
    height?: number;
}

/**
 * The ConvolutionFilter class applies a matrix convolution filter effect.
 * A convolution combines pixels in the input image with neighboring pixels to produce a new image.
 * A wide variety of image effects can be achieved through convolutions, including blurring, edge
 * detection, sharpening, embossing, and beveling. The matrix should be specified as a 9 point Array.
 * See https://docs.gimp.org/2.10/en/gimp-filter-convolution-matrix.html for more info.<br>
 * ![original](../screenshots/original.png)![filter](../screenshots/convolution.png)
 *
 * @class
 * @extends Filter
 */
export class ConvolutionFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: ConvolutionFilterOptions = {
        matrix: new Float32Array(9),
        width: 200,
        height: 200,
    };

    public uniforms: {
        uMatrix: ConvolutionMatrix;
        uTexelSize: PointData;
    };

    /**
     * @param options - Options for the ConvolutionFilter constructor.
     */
    constructor(options?: ConvolutionFilterOptions);
    /**
     * @deprecated since 6.0.0
     *
     * @param {number[]} [matrix=[0,0,0,0,0,0,0,0,0]] - An array of values used for matrix transformation.
     *        Specified as a 9 point Array.
     * @param {number} [width=200] - Width of the object you are transforming
     * @param {number} [height=200] - Height of the object you are transforming
     */
    constructor(matrix: number[], width?: number, height?: number);
    /** @ignore */
    constructor(...args: [ConvolutionFilterOptions?] | [number[], number?, number?])
    {
        let options = args[0] ?? {};

        if (Array.isArray(options))
        {
            // eslint-disable-next-line max-len
            deprecation('6.0.0', 'ConvolutionFilter constructor params are now options object. See params: { matrix, width, height }');

            options = { matrix: options as ConvolutionMatrix };

            if (args[1] !== undefined) options.width = args[1];
            if (args[2] !== undefined) options.height = args[2];
        }

        options = { ...ConvolutionFilter.DEFAULT_OPTIONS, ...options };

        const width = options.width ?? 200;
        const height = options.height ?? 200;

        const gpuProgram = GpuProgram.from({
            vertex: {
                source: wgslVertex,
                entryPoint: 'mainVertex',
            },
            fragment: {
                source,
                entryPoint: 'mainFragment',
            },
        });

        const glProgram = GlProgram.from({
            vertex,
            fragment,
            name: 'convolution-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                convolutionUniforms: {
                    uMatrix: { value: options.matrix, type: 'mat3x3<f32>' },
                    uTexelSize: { value: { x: 1 / width, y: 1 / height }, type: 'vec2<f32>' },
                },
            },
        });

        this.uniforms = this.resources.convolutionUniforms.uniforms;

        this.width = width;
        this.height = height;
    }

    /**
     * An array of values used for matrix transformation, specified as a 9 point Array
     * @example
     * const matrix = new Float32Array(9); // 9 elements of value 0
     * const matrix = [0,0.5,0,0.5,1,0.5,0,0.5,0];
     * @default [0,0,0,0,0,0,0,0,0]
     */
    get matrix(): ConvolutionMatrix { return this.uniforms.uMatrix; }
    set matrix(matrix: ConvolutionMatrix)
    {
        matrix.forEach((v, i) =>
        {
            this.uniforms.uMatrix[i] = v;
        });
    }

    /**
     * Width of the object you are transforming
     * @default 200
     */
    get width(): number { return 1 / this.uniforms.uTexelSize.x; }
    set width(value: number) { this.uniforms.uTexelSize.x = 1 / value; }

    /**
     * Height of the object you are transforming
     * @default 200
     */
    get height(): number { return 1 / this.uniforms.uTexelSize.y; }
    set height(value: number) { this.uniforms.uTexelSize.y = 1 / value; }
}
