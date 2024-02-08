import {
    deprecation,
    Filter,
    FilterSystem,
    GlProgram,
    GpuProgram,
    PointData,
    RenderSurface,
    Texture,
    // eslint-disable-next-line camelcase
    v8_0_0,
} from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './shockwave.frag';
import source from './shockwave.wgsl';

type DeprecatedPointLike = PointData | number[];

interface DeprecatedShockwaveFilterOptions
{
    amplitude: number;
    wavelength: number;
    speed: number;
    brightness: number;
    radius: number;
}

export interface ShockwaveFilterOptions
{
    /**
     * The `x` and `y` center coordinates to change the position of the center of the circle of effect.
     * @default {x:0,y:0}
     */
    center?: PointData;
    /**
     * The speed about the shockwave ripples out. The unit is `pixel-per-second`
     * @default 500
     */
    speed?: number;
    /**
     * The amplitude of the shockwave
     * @default 30
     */
    amplitude?: number;
    /**
     * The wavelength of the shockwave
     * @default 160
     */
    wavelength?: number;
    /**
     * The brightness of the shockwave
     * @default 1
     */
    brightness?: number;
    /**
     * The maximum radius of shockwave. less than `0` means the max is an infinite distance
     * @default -1
     */
    radius?: number;
    /**
     * Sets the elapsed time of the shockwave.
     * @default 0
     */
    time?: number;
}

/**
 * A Noise effect filter.
 *
 * original filter: https://github.com/evanw/glfx.js/blob/master/src/filters/adjust/noise.js
 * @author Vico @vicocotea
 */
export class ShockwaveFilter extends Filter
{
    /** Default shockwave filter options */
    public static readonly DEFAULT_OPTIONS: ShockwaveFilterOptions = {
        /** The `x` and `y` center coordinates to change the position of the center of the circle of effect. */
        center: { x: 0, y: 0 },
        /** The speed about the shockwave ripples out. The unit is `pixel-per-second` */
        speed: 500,
        /** The amplitude of the shockwave */
        amplitude: 30,
        /** The wavelength of the shockwave */
        wavelength: 160,
        /** The brightness of the shockwave */
        brightness: 1,
        /** The maximum radius of shockwave. less than `0` means the max is an infinite distance */
        radius: -1,
    };

    public uniforms: {
        uTime: number;
        uCenter: PointData;
        uSpeed: number;
        uWave: Float32Array;
    };

    /** Sets the elapsed time of the shockwave. It could control the current size of shockwave. */
    public time: number;

    /**
     * @param options
     */
    constructor(options?: ShockwaveFilterOptions);
    /**
     * @deprecated since 8.0.0
     *
     * @param {PIXI.PointData|number[]} [center=[0.5, 0.5]] - See `center` property.
     * @param {object} [options] - The optional parameters of shockwave filter.
     * @param {number} [options.amplitude=0.5] - See `amplitude`` property.
     * @param {number} [options.wavelength=1.0] - See `wavelength` property.
     * @param {number} [options.speed=500.0] - See `speed` property.
     * @param {number} [options.brightness=8] - See `brightness` property.
     * @param {number} [options.radius=4] - See `radius` property.
     * @param {number} [time=0] - See `time` property.
     */
    constructor(center?: DeprecatedPointLike, options?: Partial<DeprecatedShockwaveFilterOptions>, time?: number);
    // eslint-disable-next-line max-len
    constructor(...args: [ShockwaveFilterOptions?] | [DeprecatedPointLike?, Partial<DeprecatedShockwaveFilterOptions>?, number?])
    {
        let options = args[0] ?? {};

        if (Array.isArray(options) || ('x' in options && 'y' in options))
        {
            // eslint-disable-next-line max-len
            deprecation(v8_0_0, 'ShockwaveFilter constructor params are now options object. See params: { center, speed, amplitude, wavelength, brightness, radius, time }');

            const x = 'x' in options ? options.x : options[0];
            const y = 'y' in options ? options.y : options[1];

            options = { center: { x, y }, ...args[1] };

            if (args[2]) options.time = args[2];
        }

        options = { ...ShockwaveFilter.DEFAULT_OPTIONS, ...options };

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
            name: 'shockwave-filter'
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                shockwaveUniforms: {
                    uTime: { value: options.time, type: 'f32' },
                    uCenter: { value: options.center, type: 'vec2<f32>' },
                    uSpeed: { value: options.speed, type: 'f32' },
                    uWave: { value: new Float32Array(4), type: 'vec4<f32>' },
                },
            },
        });

        this.time = 0;

        this.uniforms = this.resources.shockwaveUniforms.uniforms;

        Object.assign(this, options);
    }

    public override apply(
        filterManager: FilterSystem,
        input: Texture,
        output: RenderSurface,
        clearMode: boolean
    ): void
    {
        // There is no set/get of `time`, for performance.
        // Because in the most real cases, `time` will be changed in ever game tick.
        // Use set/get will take more function-call.
        this.uniforms.uTime = this.time;
        filterManager.applyFilter(this, input, output, clearMode);
    }

    /**
     * The `x` and `y` center coordinates to change the position of the center of the circle of effect.
     * @default [0,0]
     */
    get center(): PointData { return this.uniforms.uCenter; }
    set center(value: PointData | DeprecatedPointLike)
    {
        if (Array.isArray(value))
        {
            deprecation(v8_0_0, 'ShockwaveFilter.center now only accepts {x,y} PointData.');
            value = { x: value[0], y: value[1] };
        }

        this.uniforms.uCenter = value;
    }

    /**
     * Sets the center of the effect in normalized screen coords on the `x` axis
     * @default 0
     */
    get centerX(): number { return this.uniforms.uCenter.x; }
    set centerX(value: number) { this.uniforms.uCenter.x = value; }

    /**
     * Sets the center of the effect in normalized screen coords on the `y` axis
     * @default 0
     */
    get centerY(): number { return this.uniforms.uCenter.y; }
    set centerY(value: number) { this.uniforms.uCenter.y = value; }

    /**
     * The speed about the shockwave ripples out. The unit is `pixel-per-second`
     * @default 500
     */
    get speed(): number { return this.uniforms.uSpeed; }
    set speed(value: number) { this.uniforms.uSpeed = value; }

    /**
     * The amplitude of the shockwave
     * @default 30
     */
    get amplitude(): number { return this.uniforms.uWave[0]; }
    set amplitude(value: number) { this.uniforms.uWave[0] = value; }

    /**
     * The wavelength of the shockwave
     * @default 160
     */
    get wavelength(): number { return this.uniforms.uWave[1]; }
    set wavelength(value: number) { this.uniforms.uWave[1] = value; }

    /**
     * The brightness of the shockwave
     * @default 1
     */
    get brightness(): number { return this.uniforms.uWave[2]; }
    set brightness(value: number) { this.uniforms.uWave[2] = value; }

    /**
     * The maximum radius of shockwave. less than `0` means the max is an infinite distance
     * @default -1
     */
    get radius(): number { return this.uniforms.uWave[3]; }
    set radius(value: number) { this.uniforms.uWave[3] = value; }
}
