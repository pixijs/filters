// utils
import { Color } from './ColorGradientFilter';
import rgba from 'color-rgba';

export function colorToNormalizedRgba(value: Color): number[] | Float32Array
{
    switch (typeof value)
    {
        case 'string':
            return stringToNormalizedRgba(value);
        case 'number':
            // TODO: Do conversion
            return [0, 0, 0, 1];
            // return hex2rgb(value);
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
