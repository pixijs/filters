import { Color, ColorSource, Filter, FilterSystem, GlProgram, GpuProgram, RenderSurface, Texture } from 'pixi.js';
import fragment from './simple-lightmap.frag';
import source from './simple-lightmap.wgsl';
import { vertex, wgslVertex } from '@tools/fragments';

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
* http://www.html5gamedevs.com/topic/20027-pixijs-simple-lightmapping/
* http://codepen.io/Oza94/pen/EPoRxj
*
* You have to specify filterArea, or suffer consequences.
* You may have to use it with `filter.dontFit = true`,
*  until we rewrite this using same approach as for DisplacementFilter.
*
* ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/simple-lightmap.png)
* @class
* @extends Filter
* @see {@link https://www.npmjs.com/package/@pixi/filter-simple-lightmap|@pixi/filter-simple-lightmap}
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
        uColor: Color;
        uAlpha: number;
        uDimensions: Float32Array;
    };

    private _lightMap!: Texture;

    constructor(options: SimpleLightmapFilterOptions)
    {
        options = { ...SimpleLightmapFilter.DEFAULT_OPTIONS, ...options };

        if (!options.lightMap) throw Error('No light map texture source was provided to SimpleLightmapFilter');

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
            name: 'simple-lightmap-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                simpleLightmapUniforms: {
                    uColor: { value: new Color(options.color), type: 'vec3<f32>' },
                    uAlpha: { value: options.alpha, type: 'f32' },
                    uDimensions: { value: new Float32Array(2), type: 'vec2<f32>' },
                },
                uMapTexture: options.lightMap.source,
                uMapSampler: options.lightMap.source.style,
            },
        });

        this.uniforms = this.resources.simpleLightmapUniforms.uniforms;

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
    get color(): ColorSource { return this.uniforms.uColor.value as ColorSource; }
    set color(value: ColorSource) { this.uniforms.uColor.setValue(value); }

    /**
     * Coefficient for alpha multiplication
     * @default 1
     */
    get alpha(): number { return this.uniforms.uAlpha; }
    set alpha(value: number) { this.uniforms.uAlpha = value; }
}
