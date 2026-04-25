import { Filter, GlProgram, GpuProgram } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './dropShadow.frag';
import source from './dropShadow.wgsl';

/** Options for the DropShadowFilter constructor */
export interface DropShadowFilterOptions
{
    /**
     * The color of the shadow
     * @default 0x000000
     */
    color?: number;
    /**
     * The blur amount of the shadow
     * @default 2
     */
    blur?: number;
    /**
     * The quality of the shadow
     * @default 2
     */
    quality?: number;
    /**
     * The distance of the shadow
     * @default 5
     */
    distance?: number;
    /**
     * The alpha of the shadow
     * @default 0.5
     */
    alpha?: number;
    /**
     * The knockout of the shadow
     * @default false
     */
    knockout?: boolean;
}

/**
 * A Drop Shadow Filter
 *
 * @example
 * const filter = new DropShadowFilter();
 * container.filters = [filter];
 */
export class DropShadowFilter extends Filter
{
    private _color: number;
    private _blur: number;
    private _quality: number;
    private _distance: number;
    private _alpha: number;
    private _knockout: boolean;

    constructor(options?: DropShadowFilterOptions)
    {
        super(vertex, fragment);
        this._color = options?.color ?? 0x000000;
        this._blur = options?.blur ?? 2;
        this._quality = options?.quality ?? 2;
        this._distance = options?.distance ?? 5;
        this._alpha = options?.alpha ?? 0.5;
        this._knockout = options?.knockout ?? false;
    }

    apply(filterManager: FilterManager, input: WebGLTexture, output: WebGLTexture): void
    {
        const program = this.getProgram(filterManager);
        filterManager.applyFilter(program, input, output);
    }

    getProgram(filterManager: FilterManager): GlProgram
    {
        if (!this._program)
        {
            const uniforms = {
                uSampler: { type: 'sampler2D', value: { texture: filterManager.inputTexture } },
                uColor: { type: 'float4', value: [this._color >> 16 & 0xff, this._color >> 8 & 0xff, this._color & 0xff, this._alpha] },
                uBlur: { type: 'float', value: this._blur },
                uQuality: { type: 'float', value: this._quality },
                uDistance: { type: 'float', value: this._distance },
                uKnockout: { type: 'bool', value: this._knockout },
            };

            this._program = filterManager.getProgram(this.vertexSrc, this.fragmentSrc, uniforms);
        }

        return this._program;
    }

    get vertexSrc(): string
    {
        return vertex;
    }

    get fragmentSrc(): string
    {
        return fragment;
    }
}