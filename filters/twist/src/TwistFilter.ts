import { Filter, GlProgram, GpuProgram, PointData } from 'pixi.js';
import fragment from './twist.frag';
import source from './twist.wgsl';
import { vertex, wgslVertex } from '@tools/fragments';

export interface TwistFilterOptions
{
    /**
     * Padding for the filter area
     * @default 20
     */
    padding?: number;
    /**
     * The radius of the twist
     * @default 200
     */
    radius?: number;
    /**
     * The angle of the twist
     * @default 4
     */
    angle?: number;
    /**
     * The `x` and `y` offset coordinates to change the position of the center of the circle of effect.
     * This should be a size 2 array or an object containing `x` and `y` values, you cannot change types
     * once defined in the constructor
     * @default {x:0,y:0}
     */
    offset?: PointData;
}

/**
 * This filter applies a twist effect making display objects appear twisted in the given direction.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/twist.png)
 *
 * @class
 * @extends Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-twist|@pixi/filter-twist}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export class TwistFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: TwistFilterOptions = {
        padding: 20,
        radius: 200,
        angle: 4,
        offset: { x: 0, y: 0 },
    };

    public uniforms: {
        uTwist: Float32Array;
        uOffset: PointData;
    };

    constructor(options?: Partial<TwistFilterOptions>)
    {
        options = { ...TwistFilter.DEFAULT_OPTIONS, ...options };

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
            name: 'twist-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                twistUniforms: {
                    uTwist: {
                        value: [options.radius ?? 0, options.angle ?? 0],
                        type: 'vec2<f32>'
                    },
                    uOffset: {
                        value: options.offset,
                        type: 'vec2<f32>'
                    },
                }
            },
            ...options,
        });

        this.uniforms = this.resources.twistUniforms.uniforms;
    }

    /**
     * The radius of the twist
     * @default 200
     */
    get radius(): number { return this.uniforms.uTwist[0]; }
    set radius(value: number) { this.uniforms.uTwist[0] = value; }

    /**
     * The angle of the twist
     * @default 4
     */
    get angle(): number { return this.uniforms.uTwist[1]; }
    set angle(value: number) { this.uniforms.uTwist[1] = value; }

    /**
     * The `x` offset coordinate to change the position of the center of the circle of effect
     * @default 0
     */
    get offset(): PointData { return this.uniforms.uOffset; }
    set offset(value: PointData) { this.uniforms.uOffset = value; }

    /**
     * The `x` offset coordinate to change the position of the center of the circle of effect
     * @default 0
     */
    get offsetX(): number { return this.offset.x; }
    set offsetX(value: number) { this.offset.x = value; }

    /**
     * The `y` offset coordinate to change the position of the center of the circle of effect
     * @default 0
     */
    get offsetY(): number { return this.offset.y; }
    set offsetY(value: number) { this.offset.y = value; }
}
