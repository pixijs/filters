import { Filter, GlProgram, GpuProgram, Point, UniformGroup } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './pixelate.frag';
import source from './pixelate.wgsl';

type Size = number | number[] | Point;

/**
 * This filter applies a pixelate effect making display objects appear 'blocky'.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/pixelate.png)
 *
 * @class
 * @extends Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-pixelate|@pixi/filter-pixelate}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export class PixelateFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_SIZE: Size = 10;

    /**
     * @param {Point|Array<number>|number} [size=10] - Either the width/height of the size of the pixels, or square size
     */
    constructor(size: Size)
    {
        size = size ?? PixelateFilter.DEFAULT_SIZE;

        const pixelateUniforms = new UniformGroup({
            uSize: { value: new Float32Array(2), type: 'vec2<f32>' },
        });

        const gpuProgram = new GpuProgram({
            vertex: {
                source: wgslVertex,
                entryPoint: 'mainVertex',
            },
            fragment: {
                source,
                entryPoint: 'mainFragment',
            },
        });

        const glProgram = new GlProgram({
            vertex,
            fragment,
            name: 'pixelate-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                pixelateUniforms,
            },
        });

        this.size = size;
    }

    /**
     * The size of the pixels
     * @default [10,10]
     */
    get size(): Size { return this.resources.pixelateUniforms.uniforms.uSize; }
    set size(value: Size)
    {
        if (value instanceof Point)
        {
            this.sizeX = value.x;
            this.sizeY = value.y;
        }
        else if (Array.isArray(value))
        {
            this.resources.pixelateUniforms.uniforms.uSize = value;
        }
        else
        {
            this.sizeX = this.sizeY = value;
        }
    }

    /**
    * The size of the pixels on the `x` axis
    * @default 10
    */
    get sizeX(): number { return this.resources.pixelateUniforms.uniforms.uSize[0]; }
    set sizeX(value: number) { this.resources.pixelateUniforms.uniforms.uSize[0] = value; }

    /**
    * The size of the pixels on the `y` axis
    * @default 10
    */
    get sizeY(): number { return this.resources.pixelateUniforms.uniforms.uSize[1]; }
    set sizeY(value: number) { this.resources.pixelateUniforms.uniforms.uSize[1] = value; }
}
