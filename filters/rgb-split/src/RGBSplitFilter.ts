import { vertex, wgslVertex } from '@tools/fragments';
import fragment from './rgb-split.frag';
import source from './rgb-split.wgsl';
import { Filter, GlProgram, GpuProgram, UniformGroup, Point } from 'pixi.js';

type Offset = [number, number] | Point;

export interface RGBSplitFilterOptions
{
    /**
     * The amount of offset for the red channel.
     * @default [-10,0]
     */
    red: Offset;
    /**
     * The amount of offset for the green channel.
     * @default [0,10]
     */
    green: Offset;
    /**
     * The amount of offset for the blue channel.
     * @default [0,0]
     */
    blue: Offset;
}

/**
 * An RGB Split Filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/rgb.png)
 *
 * @class
 * @extends Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-rgb-split|@pixi/filter-rgb-split}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export class RGBSplitFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: RGBSplitFilterOptions = {
        red: [-10, 0],
        green: [0, 10],
        blue: [0, 0],
    };

    /**
     * @param {Point | number[]} [red=[-10,0]] - Red channel offset
     * @param {Point | number[]} [green=[0, 10]] - Green channel offset
     * @param {Point | number[]} [blue=[0, 0]] - Blue channel offset
     */
    constructor(options?: RGBSplitFilterOptions)
    {
        options = { ...RGBSplitFilter.DEFAULT_OPTIONS, ...options };

        const rgbSplitUniforms = new UniformGroup({
            uRed: { value: new Float32Array(2), type: 'vec2<f32>' },
            uGreen: { value: new Float32Array(2), type: 'vec2<f32>' },
            uBlue: { value: new Float32Array(2), type: 'vec2<f32>' },
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
            name: 'rgb-split-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                rgbSplitUniforms
            },
        });

        this.red = options.red ?? [-10, 0];
        this.green = options.green ?? [0, 10];
        this.blue = options.blue ?? [0, 0];
    }

    /**
     * Red channel offset.
     * @default [-10,0]
     */
    get red(): Offset { return this.resources.rgbSplitUniforms.uniforms.uRed; }
    set red(value: Offset)
    {
        if (value instanceof Point)
        {
            this.redX = value.x;
            this.redY = value.y;

            return;
        }

        this.resources.rgbSplitUniforms.uniforms.uRed = value;
    }

    /**
     * Amount of x-axis offset for the red channel.
     * @default -10
     */
    get redX(): number { return this.resources.rgbSplitUniforms.uniforms.uRed[0]; }
    set redX(value: number) { this.resources.rgbSplitUniforms.uniforms.uRed[0] = value; }

    /**
     * Amount of y-axis offset for the red channel.
     * @default 0
     */
    get redY(): number { return this.resources.rgbSplitUniforms.uniforms.uRed[1]; }
    set redY(value: number) { this.resources.rgbSplitUniforms.uniforms.uRed[1] = value; }

    /**
     * Green channel offset.
     * @default [0,10]
     */
    get green(): Offset { return this.resources.rgbSplitUniforms.uniforms.uGreen; }
    set green(value: Offset)
    {
        if (value instanceof Point)
        {
            this.greenX = value.x;
            this.greenY = value.y;

            return;
        }

        this.resources.rgbSplitUniforms.uniforms.uGreen = value;
    }

    /**
     * Amount of x-axis offset for the green channel.
     * @default 0
     */
    get greenX(): number { return this.resources.rgbSplitUniforms.uniforms.uGreen[0]; }
    set greenX(value: number) { this.resources.rgbSplitUniforms.uniforms.uGreen[0] = value; }

    /**
     * Amount of y-axis offset for the green channel.
     * @default 10
     */
    get greenY(): number { return this.resources.rgbSplitUniforms.uniforms.uGreen[1]; }
    set greenY(value: number) { this.resources.rgbSplitUniforms.uniforms.uGreen[1] = value; }

    /**
     * Blue channel offset.
     * @default [0,0]
     */
    get blue(): Offset { return this.resources.rgbSplitUniforms.uniforms.uBlue; }
    set blue(value: Offset)
    {
        if (value instanceof Point)
        {
            this.blueX = value.x;
            this.blueY = value.y;

            return;
        }

        this.resources.rgbSplitUniforms.uniforms.uBlue = value;
    }

    /**
     * Amount of x-axis offset for the blue channel.
     * @default 0
     */
    get blueX(): number { return this.resources.rgbSplitUniforms.uniforms.uBlue[0]; }
    set blueX(value: number) { this.resources.rgbSplitUniforms.uniforms.uBlue[0] = value; }

    /**
     * Amount of y-axis offset for the blue channel.
     * @default 0
     */
    get blueY(): number { return this.resources.rgbSplitUniforms.uniforms.uBlue[1]; }
    set blueY(value: number) { this.resources.rgbSplitUniforms.uniforms.uBlue[1] = value; }
}
