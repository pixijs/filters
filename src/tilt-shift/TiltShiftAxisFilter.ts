import { Filter, GlProgram, GpuProgram, PointData, ViewSystem } from 'pixi.js';
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
    };

    public uniforms: {
        uBlur: Float32Array;
        uStart: PointData
        uEnd: PointData;
        uDelta: Float32Array;
    };

    private _tiltAxis: TiltShiftAxisFilterOptions['axis'];

    constructor(options?: TiltShiftAxisFilterOptions)
    {
        const { width, height } = ViewSystem.defaultOptions as { width: number, height: number };

        options = {
            ...TiltShiftAxisFilter.DEFAULT_OPTIONS,
            /** The position to start the effect at. */
            start: { x: 0, y: height / 2 },
            /** The position to end the effect at. */
            end: { x: width, y: height / 2 },
            ...options,
        } as TiltShiftAxisFilterOptions;

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
            name: 'tilt-shift-axis-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                tiltShiftUniforms: {
                    uBlur: {
                        value: new Float32Array([
                            options.blur as number,
                            options.gradientBlur as number,
                        ]), type: 'vec2<f32>'
                    },
                    uStart: { value: options.start, type: 'vec2<f32>' },
                    uEnd: { value: options.end, type: 'vec2<f32>' },
                    uDelta: { value: new Float32Array([0, 0]), type: 'vec2<f32>' },
                },
            },
        });

        this.uniforms = this.resources.tiltShiftUniforms.uniforms;
        this._tiltAxis = options.axis;
    }

    /**
     * Updates the filter delta values.
     * @ignore
     */
    public updateDelta(): void
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
}
