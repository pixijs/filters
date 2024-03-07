import {
    Color,
    ColorSource,
    deprecation,
    Filter,
    FilterSystem,
    GlProgram,
    GpuProgram,
    RenderSurface,
    Texture,
} from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './simple-lightmap.frag';
import source from './simple-lightmap.wgsl';

type DeprecatedColor = number | number[];

/** Options for the SimpleLightmapFilter constructor. */
export interface SimpleLightmapFilterOptions
{
    /** A texture where your lightmap is rendered */
    lightMap: Texture;
    /**
     * The color value of the ambient color
     * @example [1.0, 1.0, 1.0] = 0xffffff
     * @default 0x000000
     */
    color?: ColorSource;
    /**
     * Coefficient for alpha multiplication
     * @default 1
     */
    alpha?: number;
}

/**
* SimpleLightmap, originally by Oza94
* {@link http://www.html5gamedevs.com/topic/20027-pixijs-simple-lightmapping/}
* {@link http://codepen.io/Oza94/pen/EPoRxj}
*
* You have to specify filterArea, or suffer consequences.
* You may have to use it with `filter.dontFit = true`,
*  until we rewrite this using same approach as for DisplacementFilter.
*
* ![original](../screenshots/original.png)![filter](../screenshots/simple-lightmap.png)
* @class
* @extends Filter
* @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
*
* @example
*  displayObject.filters = [new SimpleLightmapFilter(texture, 0x666666)];
*/
export class SimpleLightmapFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: SimpleLightmapFilterOptions = {
        lightMap: Texture.WHITE,
        color: 0x000000,
        alpha: 1
    };

    public uniforms: {
        uColor: Float32Array;
        uAlpha: number;
        uDimensions: Float32Array;
    };

    private _color!: Color;
    private _lightMap!: Texture;

    /**
     * @param options - Options for the SimpleLightmapFilter constructor.
     */
    constructor(options: SimpleLightmapFilterOptions);
    /**
     * @deprecated since 6.0.0
     *
     * @param {PIXI.Texture} texture - a texture where your lightmap is rendered
     * @param {Array<number>|number} [color=0x000000] - An RGBA array of the ambient color
     * @param {number} [alpha=1] - Default alpha set independent of color (if it's a number, not array).
     */
    constructor(texture: Texture, color?: DeprecatedColor, alpha?: number);
    /** @ignore */
    constructor(...args: [SimpleLightmapFilterOptions] | [Texture, DeprecatedColor?, number?])
    {
        let options = args[0] ?? {};

        if (options instanceof Texture)
        {
            // eslint-disable-next-line max-len
            deprecation('6.0.0', 'SimpleLightmapFilter constructor params are now options object. See params: { lightMap, color, alpha }');

            options = { lightMap: options };

            if (args[1] !== undefined) options.color = args[1];
            if (args[2] !== undefined) options.alpha = args[2];
        }

        options = { ...SimpleLightmapFilter.DEFAULT_OPTIONS, ...options };

        if (!options.lightMap) throw Error('No light map texture source was provided to SimpleLightmapFilter');

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
            name: 'simple-lightmap-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                simpleLightmapUniforms: {
                    uColor: { value: new Float32Array(3), type: 'vec3<f32>' },
                    uAlpha: { value: options.alpha, type: 'f32' },
                    uDimensions: { value: new Float32Array(2), type: 'vec2<f32>' },
                },
                uMapTexture: options.lightMap.source,
                uMapSampler: options.lightMap.source.style,
            },
        });

        this.uniforms = this.resources.simpleLightmapUniforms.uniforms;
        this._color = new Color();
        this.color = options.color ?? 0x000000;

        Object.assign(this, options);
    }

    /**
     * Override existing apply method in `Filter`
     * @override
     * @ignore
     */
    public override apply(
        filterManager: FilterSystem,
        input: Texture,
        output: RenderSurface,
        clearMode: boolean,
    ): void
    {
        this.uniforms.uDimensions[0] = input.frame.width;
        this.uniforms.uDimensions[1] = input.frame.height;

        // draw the filter...
        filterManager.applyFilter(this, input, output, clearMode);
    }

    /** A sprite where your lightmap is rendered */
    get lightMap(): Texture { return this._lightMap; }
    set lightMap(value: Texture)
    {
        this._lightMap = value;
        this.resources.uMapTexture = value.source;
        this.resources.uMapSampler = value.source.style;
    }

    /**
     * The color value of the ambient color
     * @example [1.0, 1.0, 1.0] = 0xffffff
     * @default 0x000000
     */
    get color(): ColorSource { return this._color.value as ColorSource; }
    set color(value: ColorSource)
    {
        this._color.setValue(value);
        const [r, g, b] = this._color.toArray();

        this.uniforms.uColor[0] = r;
        this.uniforms.uColor[1] = g;
        this.uniforms.uColor[2] = b;
    }

    /**
     * Coefficient for alpha multiplication
     * @default 1
     */
    get alpha(): number { return this.uniforms.uAlpha; }
    set alpha(value: number) { this.uniforms.uAlpha = value; }
}
