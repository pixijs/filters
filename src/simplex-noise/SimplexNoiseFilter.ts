import { Filter, GlProgram, GpuProgram } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './simplex.frag';
import source from './simplex.wgsl';

/** Options for the SimplexNoiseFilter constructor. */
export interface SimplexNoiseFilterOptions
{
    /**
     * Noise map strength.
     * @default 0.5
     */
    strength?: number;
    /**
     * Noise map scale.
     * @default 10.0
     */
    noiseScale?: number;
    /**
     * Horizontal offset for the noise map.
     * @default 0
     */
    offsetX?: number;
    /**
     * Vertical offset for the noise map.
     * @default 0
     */
    offsetY?: number;
    /**
     * Depth offset for the noise map.
     * @default 0
     */
    offsetZ?: number;
    /**
     * The threshold used with the step function to create a blocky effect in the noise pattern.
     * When this is greater than 0, the step function is used to compare the noise value to this threshold.
     * @default -1
     */
    step?: number;
}

/**
 * The SimplexNoiseFilter multiplies simplex noise with the current texture data. <br>
 * ![original](../screenshots/original.png)![filter](../screenshots/simplex-noise.png)
 * @class
 * @extends Filter
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export class SimplexNoiseFilter extends Filter
{
    /** Default constructor options. */
    public static readonly defaults: SimplexNoiseFilterOptions = {
        strength: 0.5,
        noiseScale: 10.0,
        offsetX: 0,
        offsetY: 0,
        offsetZ: 0,
        step: -1,
    };

    /**
     * @param options - Options for the SimplexNoise constructor.
     */
    constructor(options?: SimplexNoiseFilterOptions)
    {
        options = { ...SimplexNoiseFilter.defaults, ...options };

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
            name: 'simplex-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                simplexUniforms: {
                    uStrength: { value: options?.strength ?? 0, type: 'f32' },
                    uNoiseScale: { value: options?.noiseScale ?? 0, type: 'f32' },
                    uOffsetX: { value: options?.offsetX ?? 0, type: 'f32' },
                    uOffsetY: { value: options?.offsetY ?? 0, type: 'f32' },
                    uOffsetZ: { value: options?.offsetZ ?? 0, type: 'f32' },
                    uStep: { value: options?.step ?? 0, type: 'f32' },
                }
            }
        });
    }

    /**
     * Strength of the noise (color = (noiseMap + strength) * texture)
     * @default 0.5
     */
    get strength(): number { return this.resources.simplexUniforms.uniforms.uStrength; }
    set strength(value: number) { this.resources.simplexUniforms.uniforms.uStrength = value; }

    /**
     * Noise map scale.
     * @default 10
     */
    get noiseScale(): number { return this.resources.simplexUniforms.uniforms.uNoiseScale; }
    set noiseScale(value: number) { this.resources.simplexUniforms.uniforms.uNoiseScale = value; }

    /**
     * Horizontal offset for the noise map.
     * @default 0
     */
    get offsetX(): number { return this.resources.simplexUniforms.uniforms.uOffsetX; }
    set offsetX(value: number) { this.resources.simplexUniforms.uniforms.uOffsetX = value; }

    /**
     * Vertical offset for the noise map.
     * @default 0
     */
    get offsetY(): number { return this.resources.simplexUniforms.uniforms.uOffsetY; }
    set offsetY(value: number) { this.resources.simplexUniforms.uniforms.uOffsetY = value; }

    /**
     * Depth offset for the noise map.
     * @default 0
     */
    get offsetZ(): number { return this.resources.simplexUniforms.uniforms.uOffsetZ; }
    set offsetZ(value: number) { this.resources.simplexUniforms.uniforms.uOffsetZ = value; }

    /**
     * The threshold used with the step function to create a blocky effect in the noise pattern.
     * When this is greater than 0, the step function is used to compare the noise value to this threshold.
     * @default -1
     */
    get step(): number { return this.resources.simplexUniforms.uniforms.uStep; }
    set step(value: number) { this.resources.simplexUniforms.uniforms.uStep = value; }
}
