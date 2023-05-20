import { Color } from '@pixi/core';
import { Color as ColorGradientFilter } from './ColorGradientFilter';
import rgba from 'color-rgba';

export function colorToNormalizedRgba(value: ColorGradientFilter): number[] | Float32Array
{
    switch (typeof value)
    {
        case 'string':
            return stringToNormalizedRgba(value);
        case 'number':
            return [new Color(value).toNumber()];
        default:
            return value;
    }
}

function stringToNormalizedRgba(value: string) : number[]
{
    const rgba_  = rgba(value);

    if (!rgba_)
    {
        throw new Error(`Unable to parse color "${value}" as RGBA.`);
    }

    return [
        rgba_[0] / 255,
        rgba_[1] / 255,
        rgba_[2] / 255,
        rgba_[3]
    ];
}
