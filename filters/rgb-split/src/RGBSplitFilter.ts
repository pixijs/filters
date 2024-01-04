import { vertex, wgslVertex } from '@tools/fragments';
import fragment from './rgb-split.frag';
import source from './rgb-split.wgsl';
import { Filter, GlProgram, GpuProgram, PointData } from 'pixi.js';

export interface RGBSplitFilterOptions
{
    /**
     * The amount of offset for the red channel.
     * @default {x:-10,y:0}
     */
    red: PointData;
    /**
     * The amount of offset for the green channel.
     * @default {x:0,y:10}
     */
    green: PointData;
    /**
     * The amount of offset for the blue channel.
     * @default {x:0,y:0}
     */
    blue: PointData;
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
        red: { x: -10, y: 0 },
        green: { x: 0, y: 10 },
        blue: { x: 0, y: 0 },
    };

    public uniforms: {
        uRed: PointData;
        uGreen: PointData;
        uBlue: PointData;
    };

    constructor(options?: RGBSplitFilterOptions)
    {
        options = { ...RGBSplitFilter.DEFAULT_OPTIONS, ...options };

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
                rgbSplitUniforms: {
                    uRed: { value: options.red, type: 'vec2<f32>' },
                    uGreen: { value: options.green, type: 'vec2<f32>' },
                    uBlue: { value: options.blue, type: 'vec2<f32>' },
                }
            },
        });

        this.uniforms = this.resources.rgbSplitUniforms.uniforms;
    }

    /**
     * Red channel offset.
     * @default {x:-10,y:0}
     */
    get red(): PointData { return this.uniforms.uRed; }
    set red(value: PointData) { this.uniforms.uRed = value; }

    /**
     * Amount of x-axis offset for the red channel.
     * @default -10
     */
    get redX(): number { return this.red.x; }
    set redX(value: number) { this.red.x = value; }

    /**
     * Amount of y-axis offset for the red channel.
     * @default 0
     */
    get redY(): number { return this.red.y; }
    set redY(value: number) { this.red.y = value; }

    /**
     * Green channel offset.
     * @default {x:0,y:10}
     */
    get green(): PointData { return this.uniforms.uGreen; }
    set green(value: PointData) { this.uniforms.uGreen = value; }

    /**
     * Amount of x-axis offset for the green channel.
     * @default 0
     */
    get greenX(): number { return this.green.x; }
    set greenX(value: number) { this.green.x = value; }

    /**
     * Amount of y-axis offset for the green channel.
     * @default 10
     */
    get greenY(): number { return this.green.y; }
    set greenY(value: number) { this.green.y = value; }

    /**
     * Blue channel offset.
     * @default {x:0,y:0}
     */
    get blue(): PointData { return this.uniforms.uBlue; }
    set blue(value: PointData) { this.uniforms.uBlue = value; }

    /**
     * Amount of x-axis offset for the blue channel.
     * @default 0
     */
    get blueX(): number { return this.blue.x; }
    set blueX(value: number) { this.blue.x = value; }

    /**
     * Amount of y-axis offset for the blue channel.
     * @default 0
     */
    get blueY(): number { return this.blue.y; }
    set blueY(value: number) { this.blue.y = value; }
}
