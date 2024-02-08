// eslint-disable-next-line camelcase
import { deprecation, Filter, GlProgram, GpuProgram, PointData, v8_0_0 } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './rgb-split.frag';
import source from './rgb-split.wgsl';

type DeprecatedOffset = [number, number] | PointData;

export interface RGBSplitFilterOptions
{
    /**
     * The amount of offset for the red channel.
     * @default {x:-10,y:0}
     */
    red?: PointData;
    /**
     * The amount of offset for the green channel.
     * @default {x:0,y:10}
     */
    green?: PointData;
    /**
     * The amount of offset for the blue channel.
     * @default {x:0,y:0}
     */
    blue?: PointData;
}

/**
 * An RGB Split Filter.<br>
 * ![original](../screenshots/original.png)![filter](../screenshots/rgb.png)
 *
 * @class
 * @extends Filter
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

    constructor(options?: RGBSplitFilterOptions);
    /**
     * @deprecated since 8.0.0
     *
     * @param {PIXI.PointData | number[]} [red=[-10,0]] - Red channel offset
     * @param {PIXI.PointData | number[]} [green=[0, 10]] - Green channel offset
     * @param {PIXI.PointData | number[]} [blue=[0, 0]] - Blue channel offset
     */
    constructor(red?: DeprecatedOffset, green?: DeprecatedOffset, blue?: DeprecatedOffset);
    constructor(...args: [RGBSplitFilterOptions?] | [DeprecatedOffset?, DeprecatedOffset?, DeprecatedOffset?])
    {
        let options = args[0] ?? {};

        if (Array.isArray(options) || ('x' in options && 'y' in options))
        {
            // eslint-disable-next-line max-len
            deprecation(v8_0_0, 'RGBSplitFilter constructor params are now options object. See params: { red, green, blue }');

            options = { red: convertDeprecatedOffset(options) };

            if (args[1])
            {
                options.green = convertDeprecatedOffset(args[1]);
            }
            if (args[2])
            {
                options.blue = convertDeprecatedOffset(args[2]);
            }
        }

        options = { ...RGBSplitFilter.DEFAULT_OPTIONS, ...options };

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
    set red(value: PointData | DeprecatedOffset)
    {
        if (Array.isArray(value))
        {
            deprecation(v8_0_0, 'RGBSplitFilter.red now only accepts {x,y} PointData.');
            value = convertDeprecatedOffset(value);
        }

        this.uniforms.uRed = value;
    }

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
    set green(value: PointData | DeprecatedOffset)
    {
        if (Array.isArray(value))
        {
            deprecation(v8_0_0, 'RGBSplitFilter.green now only accepts {x,y} PointData.');
            value = convertDeprecatedOffset(value);
        }

        this.uniforms.uGreen = value;
    }

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
    set blue(value: PointData | DeprecatedOffset)
    {
        if (Array.isArray(value))
        {
            deprecation(v8_0_0, 'RGBSplitFilter.blue now only accepts {x,y} PointData.');
            value = convertDeprecatedOffset(value);
        }

        this.uniforms.uBlue = value;
    }

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

function convertDeprecatedOffset(value: DeprecatedOffset): PointData
{
    if (Array.isArray(value))
    {
        return { x: value[0], y: value[1] };
    }

    return value;
}
