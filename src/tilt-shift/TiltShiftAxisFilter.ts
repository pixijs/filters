import { Filter, GlProgram, GpuProgram, PointData } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './tilt-shift.frag';
import source from './tilt-shift.wgsl';

// @author Vico @vicocotea
// original filter https://github.com/evanw/glfx.js/blob/master/src/filters/blur/tiltshift.js
// by Evan Wallace : http://madebyevan.com/

/**
 * Options for creating filter.
 */
interface TiltShiftAxisFilterOptions
{
    /** The strength of the blur. */
    blur?: number;
    /** The strength of the blur gradient */
    gradientBlur?: number;
    /** The position to start the effect at. */
    start?: PointData;
    /** The position to end the effect at. */
    end?: PointData;
    /** The axis that the filter is calculating for. */
    axis?: 'vertical' | 'horizontal';
}

/**
 * A TiltShiftAxisFilter.
 *
 * @class
 * @extends Filter
 * @private
 */
export class TiltShiftAxisFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: TiltShiftAxisFilterOptions = {
        /** The strength of the blur. */
        blur: 100,
        /** The strength of the blur gradient */
        gradientBlur: 600,
        /** The position to start the effect at. */
        start: { x: 0, y: window.innerHeight / 2 },
        /** The position to end the effect at. */
        end: { x: 600, y: window.innerHeight / 2 },
    };

    public uniforms: {
        uBlur: Float32Array;
        uStart: PointData
        uEnd: PointData;
        uDelta: Float32Array;
        uTexSize: Float32Array;
    };

    private _tiltAxis: TiltShiftAxisFilterOptions['axis'];

    constructor(options?: TiltShiftAxisFilterOptions)
    {
        options = { ...TiltShiftAxisFilter.DEFAULT_OPTIONS, ...options } as TiltShiftAxisFilterOptions;

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
            name: 'tilt-shift-axis-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                tiltShiftUniforms: {
                    uBlur: {
                        value: new Float32Array([
                            options.blur ?? 100,
                            options.gradientBlur ?? 600
                        ]), type: 'vec2<f32>'
                    },
                    uStart: { value: options.start, type: 'vec2<f32>' },
                    uEnd: { value: options.end, type: 'vec2<f32>' },
                    uDelta: { value: new Float32Array([30, 30]), type: 'vec2<f32>' },
                    uTexSize: { value: new Float32Array([window.innerWidth, window.innerHeight]), type: 'vec2<f32>' },
                },
            },
        });

        this.uniforms = this.resources.tiltShiftUniforms.uniforms;
        this._tiltAxis = options.axis;
        this.updateDelta();
    }

    /** Updates the filter delta values. */
    protected updateDelta(): void
    {
        this.uniforms.uDelta[0] = 0;
        this.uniforms.uDelta[1] = 0;

        if (this._tiltAxis === undefined) return;

        const end = this.uniforms.uEnd;
        const start = this.uniforms.uStart;

        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const d = Math.sqrt((dx * dx) + (dy * dy));

        const isVert = this._tiltAxis === 'vertical';

        this.uniforms.uDelta[0] = !isVert ? dx / d : -dy / d;
        this.uniforms.uDelta[1] = !isVert ? dy / d : dx / d;
    }

    // /** The strength of the blur. */
    // get blur(): number { return this.uniforms.uBlur[0]; }
    // set blur(value: number) { this.uniforms.uBlur[0] = value; }

    // /** The strength of the gradient blur. */
    // get gradientBlur(): number { return this.uniforms.uBlur[1]; }
    // set gradientBlur(value: number) { this.uniforms.uBlur[1] = value; }

    // /** The start position of the effect. */
    // get start(): PointData { return this.uniforms.uStart; }
    // set start(value: PointData)
    // {
    //     this.uniforms.uStart = value;
    //     this.updateDelta();
    // }

    // /** The start position of the effect on the `x` axis. */
    // get startX(): number { return this.start.x; }
    // set startX(value: number)
    // {
    //     this.start.x = value;
    //     this.updateDelta();
    // }

    // /** The start position of the effect on the `y` axis. */
    // get startY(): number { return this.startY; }
    // set startY(value: number)
    // {
    //     this.start.y = value;
    //     this.updateDelta();
    // }

    // /** The end position of the effect. */
    // get end(): PointData { return this.uniforms.uEnd; }
    // set end(value: PointData)
    // {
    //     this.uniforms.uEnd = value;
    //     this.updateDelta();
    // }

    // /** The end position of the effect on the `x` axis. */
    // get endX(): number { return this.end.x; }
    // set endX(value: number)
    // {
    //     this.end.x = value;
    //     this.updateDelta();
    // }

    // /** The end position of the effect on the `y` axis. */
    // get endY(): number { return this.end.y; }
    // set endY(value: number)
    // {
    //     this.end.y = value;
    //     this.updateDelta();
    // }
}
