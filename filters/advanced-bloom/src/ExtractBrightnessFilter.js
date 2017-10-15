import vertex from './extract-brightness.vert';
import fragment from './extract-brightness.frag';

export default class ExtractBrightnessFilter extends PIXI.Filter
{
    constructor(minBright)
    {
        super(
            vertex,
            fragment
        );

        this.minBright = minBright || 0.5;
    }

    get minBright()
    {
        return this.uniforms.minBright;
    }

    set minBright(value)
    {
        this.uniforms.minBright = value;
    }
}

// Export to PixiJS namespace
// Internal filter, don't export
// PIXI.filters.ExtractBrightnessFilter = ExtractBrightnessFilter;


