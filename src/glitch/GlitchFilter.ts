import { DEG_TO_RAD, Filter, GlProgram, GpuProgram, ImageSource, Texture } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './glitch.frag';
import source from './glitch.wgsl';

import type { FilterSystem, PointData, RenderSurface } from 'pixi.js';

enum FILL_MODES
    {
    TRANSPARENT = 0,
    ORIGINAL = 1,
    LOOP = 2,
    CLAMP = 3,
    MIRROR = 4,
}

/** Options for the GlitchFilter constructor. */
export interface GlitchFilterOptions
{
    /**
     * The count of glitch slices.
     * @default 5
     */
    slices?: number;
    /**
     * The maximum offset amount of slices.
     * @default 100
     */
    offset?: number;
    /**
     * The angle in degree of the offset of slices.
     * @default 0
     */
    direction?: number;
    /**
     * The fill mode of the space after the offset.
     * @default FILL_MODES.TRANSPARENT
     */
    fillMode?: number;
    /**
     * A seed value for randomizing glitch effect.
     * @default 0
     */
    seed?: number;
    /**
     * `true` will divide the bands roughly based on equal amounts
     * where as setting to `false` will vary the band sizes dramatically (more random looking).
     * @default false
     */
    average?: boolean;
    /**
     * Minimum size of slices as a portion of the `sampleSize`
     * @default 8
     */
    minSize?: number;
    /**
     * Height of the displacement map canvas.
     * @default 512
     */
    sampleSize?: number;
    /**
     * Red channel offset.
     * @default {x:0,y:0}
     */
    red?: PointData | number[];
    /**
     * Green channel offset.
     * @default {x:0,y:0}
     */
    green?: PointData | number[];
    /**
     * Blue offset.
     * @default {x:0,y:0}
     */
    blue?: PointData | number[];
}

/**
 * The GlitchFilter applies a glitch effect to an object.<br>
 * ![original](../screenshots/original.png)![filter](../screenshots/glitch.png)
 *
 * @class
 * @extends Filter
 */
export class GlitchFilter extends Filter
{
    /** Default constructor options. */
    public static readonly defaults: GlitchFilterOptions = {
        slices: 5,
        offset: 100,
        direction: 0,
        fillMode: 0,
        average: false,
        seed: 0,
        red: { x: 0, y: 0 },
        green: { x: 0, y: 0 },
        blue: { x: 0, y: 0 },
        minSize: 8,
        sampleSize: 512,
    };

    public uniforms: {
        uSeed: number
        uDimensions: Float32Array,
        uAspect: number,
        uFillMode: number,
        uOffset: number,
        uDirection: number,
        uRed: PointData,
        uGreen: PointData,
        uBlue: PointData,
    };

    /**
     * `true` will divide the bands roughly based on equal amounts
     * where as setting to `false` will vary the band sizes dramatically (more random looking).
     */
    public average = false;

    /** Minimum size of slices as a portion of the `sampleSize` */
    public minSize = 8;

    /** Height of the displacement map canvas. */
    public sampleSize = 512;

    /** Internally generated canvas. */
    private _canvas: HTMLCanvasElement;

    /**
     * The displacement map is used to generate the bands.
     * If using your own texture, `slices` will be ignored.
     *
     * @member {Texture}
     * @readonly
     */
    public texture: Texture;

    /** Internal number of slices */
    private _slices = 0;

    private _sizes: Float32Array = new Float32Array(1);
    private _offsets: Float32Array = new Float32Array(1);

    /**
     * @param options - Options for the GlitchFilter constructor.
     */
    constructor(options?: GlitchFilterOptions)
    {
        options = { ...GlitchFilter.defaults, ...options };

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
            name: 'glitch-filter',
        });

        const canvas = document.createElement('canvas');

        canvas.width = 4;
        canvas.height = options.sampleSize ?? 512;

        const texture = new Texture({
            source: new ImageSource({ resource: canvas })
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                glitchUniforms: {
                    uSeed: { value: options?.seed ?? 0, type: 'f32' },
                    uDimensions: { value: new Float32Array(2), type: 'vec2<f32>' },
                    uAspect: { value: 1, type: 'f32' },
                    uFillMode: { value: options?.fillMode ?? 0, type: 'f32' },
                    uOffset: { value: options?.offset ?? 100, type: 'f32' },
                    uDirection: { value: options?.direction ?? 0, type: 'f32' },
                    uRed: { value: { x: 0, y: 0 }, type: 'vec2<f32>' },
                    uGreen: { value: { x: 0, y: 0 }, type: 'vec2<f32>' },
                    uBlue: { value: { x: 0, y: 0 }, type: 'vec2<f32>' },
                },
                uDisplacementMap: texture.source,
                uDisplacementSampler: texture.source.style,
            },
        });

        this.uniforms = this.resources.glitchUniforms.uniforms;

        this._canvas = canvas;
        this.texture = texture;

        Object.assign(this, options);
    }

    /**
     * Override existing apply method in Filter
     * @private
     */
    apply(
        filterManager: FilterSystem,
        input: Texture,
        output: RenderSurface,
        clearMode: boolean
    ): void
    {
        const { width, height } = input.frame;

        this.uniforms.uDimensions[0] = width;
        this.uniforms.uDimensions[1] = height;
        this.uniforms.uAspect = height / width;

        filterManager.applyFilter(this, input, output, clearMode);
    }

    /**
     * Randomize the slices size (heights).
     *
     * @private
     */
    private _randomizeSizes()
    {
        const arr = this._sizes;
        const last = this._slices - 1;
        const size = this.sampleSize;
        const min = Math.min(this.minSize / size, 0.9 / this._slices);

        if (this.average)
        {
            const count = this._slices;
            let rest = 1;

            for (let i = 0; i < last; i++)
            {
                const averageWidth = rest / (count - i);
                const w = Math.max(averageWidth * (1 - (Math.random() * 0.6)), min);

                arr[i] = w;
                rest -= w;
            }
            arr[last] = rest;
        }
        else
        {
            let rest = 1;
            const ratio = Math.sqrt(1 / this._slices);

            for (let i = 0; i < last; i++)
            {
                const w = Math.max(ratio * rest * Math.random(), min);

                arr[i] = w;
                rest -= w;
            }
            arr[last] = rest;
        }

        this.shuffle();
    }

    /**
     * Shuffle the sizes of the slices, advanced usage.
     */
    shuffle(): void
    {
        const arr = this._sizes;
        const last = this._slices - 1;

        // shuffle
        for (let i = last; i > 0; i--)
        {
            const rand = (Math.random() * i) >> 0;
            const temp = arr[i];

            arr[i] = arr[rand];
            arr[rand] = temp;
        }
    }

    /**
     * Randomize the values for offset from -1 to 1
     *
     * @private
     */
    private _randomizeOffsets(): void
    {
        for (let i = 0; i < this._slices; i++)
        {
            this._offsets[i] = Math.random() * (Math.random() < 0.5 ? -1 : 1);
        }
    }

    /**
     * Regenerating random size, offsets for slices.
     */
    refresh(): void
    {
        this._randomizeSizes();
        this._randomizeOffsets();
        this.redraw();
    }

    /**
     * Redraw displacement bitmap texture, advanced usage.
     */
    redraw(): void
    {
        const size = this.sampleSize;
        const texture = this.texture;
        const ctx = this._canvas.getContext('2d') as CanvasRenderingContext2D;

        ctx.clearRect(0, 0, 8, size);

        let offset;
        let y = 0;

        for (let i = 0; i < this._slices; i++)
        {
            offset = Math.floor(this._offsets[i] * 256);
            const height = this._sizes[i] * size;
            const red = offset > 0 ? offset : 0;
            const green = offset < 0 ? -offset : 0;

            ctx.fillStyle = `rgba(${red}, ${green}, 0, 1)`;
            ctx.fillRect(0, y >> 0, size, height + 1 >> 0);
            y += height;
        }

        texture.source.update();
    }

    /**
     * Manually custom slices size (height) of displacement bitmap
     *
     * @member {number[]|Float32Array}
     */
    set sizes(sizes: Float32Array)
    {
        const len = Math.min(this._slices, sizes.length);

        for (let i = 0; i < len; i++)
        {
            this._sizes[i] = sizes[i];
        }
    }
    get sizes(): Float32Array
    {
        return this._sizes;
    }

    /**
     * Manually set custom slices offset of displacement bitmap, this is
     * a collection of values from -1 to 1. To change the max offset value
     * set `offset`.
     *
     * @member {number[]|Float32Array}
     */
    set offsets(offsets: Float32Array)
    {
        const len = Math.min(this._slices, offsets.length);

        for (let i = 0; i < len; i++)
        {
            this._offsets[i] = offsets[i];
        }
    }
    get offsets(): Float32Array { return this._offsets; }

    /**
     * The count of slices.
     * @default 5
     */
    get slices(): number { return this._slices; }
    set slices(value: number)
    {
        if (this._slices === value) return;
        this._slices = value;
        this._sizes = new Float32Array(value);
        this._offsets = new Float32Array(value);
        this.refresh();
    }

    /**
     * The maximum offset amount of slices.
     * @default 100
     */
    get offset(): number { return this.uniforms.uOffset; }
    set offset(value: number) { this.uniforms.uOffset = value; }

    /**
     * A seed value for randomizing glitch effect.
     * @default 0
     */
    get seed(): number { return this.uniforms.uSeed; }
    set seed(value: number) { this.uniforms.uSeed = value; }

    /**
     * The fill mode of the space after the offset.
     * @default FILL_MODES.TRANSPARENT
     */
    get fillMode(): FILL_MODES { return this.uniforms.uFillMode; }
    set fillMode(value: FILL_MODES) { this.uniforms.uFillMode = value; }

    /**
     * The angle in degree of the offset of slices.
     * @default 0
     */
    get direction(): number { return this.uniforms.uDirection / DEG_TO_RAD; }
    set direction(value: number) { this.uniforms.uDirection = value * DEG_TO_RAD; }

    /**
     * Red channel offset.
     * @default {x:0,y:0}
     */
    get red(): PointData { return this.uniforms.uRed; }
    set red(value: PointData | number[])
    {
        if (Array.isArray(value))
        {
            value = { x: value[0], y: value[1] };
        }

        this.uniforms.uRed = value;
    }

    /**
     * Green channel offset.
     * @default {x:0,y:0}
     */
    get green(): PointData { return this.uniforms.uGreen; }
    set green(value: PointData | number[])
    {
        if (Array.isArray(value))
        {
            value = { x: value[0], y: value[1] };
        }

        this.uniforms.uGreen = value;
    }

    /**
     * Blue offset.
     * @default {x:0,y:0}
     */
    get blue(): PointData { return this.uniforms.uBlue; }
    set blue(value: PointData | number[])
    {
        if (Array.isArray(value))
        {
            value = { x: value[0], y: value[1] };
        }

        this.uniforms.uBlue = value;
    }

    /**
     * Removes all references
     */
    destroy(): void
    {
        this.texture?.destroy(true);
        this.texture
        = this._canvas
        = this.red
        = this.green
        = this.blue
        = this._sizes
        = this._offsets = null as any;
    }
}
