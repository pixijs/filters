import { AngularNode, ColorStop as CssColorStop, DefaultRadialNode, DirectionalNode, ExtentKeywordNode, GradientNode, parse, ShapeNode } from 'gradient-parser';

import { ColorGradientFilter, ColorStop } from './ColorGradientFilter';

enum GradientType
    {
    Linear = ColorGradientFilter.LINEAR,
    Radial = ColorGradientFilter.RADIAL,
    // Conic = ColorGradientFilter.CONIC,
}

export interface ParseResult
{
    type: GradientType;
    stops: ColorStop[];
    angle: number;
}

export function parseCssGradient(cssGrradient: string): ParseResult
{
    const cssGradientNodes: GradientNode[] = parse(cssGrradient);

    if (cssGradientNodes.length !== 1)
    {
        throw new Error('Unsupported CSS gradient.');
    }

    const cssGradientNode = cssGradientNodes[0];

    const type = typeFromCssType(cssGradientNode.type);
    const stops = parseColorStops(cssGradientNode.colorStops);
    const angle = angleFromOrientation(cssGradientNode.orientation);

    return {
        type,
        stops,
        angle,
    };
}

export function typeFromCssType(type: string): GradientType
{
    const supportedTypes: { [key: string]: number } = {
        'linear-gradient': GradientType.Linear,
        'radial-gradient': GradientType.Radial,
    };

    if (!(type in supportedTypes))
    {
        throw new Error(`Unsupported gradient type "${type}"`);
    }

    return supportedTypes[type];
}

export function parseColorStops(stops: CssColorStop[]): ColorStop[]
{
    // const defaultStepSize = 1 / (stops.length - 1);
    const offsets: number[] = offsetsFromCssColorStops(stops);

    const result: ColorStop[] = [];

    for (let i = 0; i < offsets.length; i++)
    {
        result.push({
            offset: offsets[i],
            color: stops[i].value.toString(),
            alpha: 1.0,
        });
    }

    return result;
}

export function offsetsFromCssColorStops(stops: CssColorStop[]): number[]
{
    const offsets: number[] = [];
    const dynamicOffset = -1;

    for (let i = 0; i < stops.length; i++)
    {
        const cssStop = stops[i];
        let stopOffset = dynamicOffset;

        if (cssStop.type === 'literal')
        {
            if (cssStop.length && 'type' in cssStop.length && cssStop.length.type === '%' && 'value' in cssStop.length)
            {
                stopOffset = parseFloat(cssStop.length.value) / 100;
            }
        }

        offsets.push(stopOffset);
    }

    const findNextFixedStop = (fromIndex: number): { indexDelta: number; offset: number; } =>
    {
        for (let k = fromIndex; k < offsets.length; k++)
        {
            if (offsets[k] !== dynamicOffset)
            {
                return {
                    indexDelta: k - fromIndex,
                    offset: offsets[k]
                };
            }
        }

        return {
            indexDelta: (offsets.length - 1) - fromIndex,
            offset: 1.0
        };
    };

    let prevFixedOffset = 0;

    for (let i = 0; i < offsets.length; i++)
    {
        const offset = offsets[i];

        if (offset !== dynamicOffset)
        {
            prevFixedOffset = offset;
            continue;
        }
        else if (i === 0)
        {
            offsets[i] = 0;
        }
        else if (i + 1 === offsets.length)
        {
            offsets[i] = 1.0;
        }
        else
        {
            const nextFixed = findNextFixedStop(i);
            const offsetDelta = nextFixed.offset - prevFixedOffset;
            const stepSize = offsetDelta / (1 + nextFixed.indexDelta);

            for (let s = 0; s <= nextFixed.indexDelta; s++)
            {
                offsets[i + s] = prevFixedOffset + ((s + 1) * stepSize);
            }

            i += nextFixed.indexDelta;
            prevFixedOffset = offsets[i];
        }
    }

    return offsets.map(fixFloatRounding);
}

// fixes issues like 0.3 - 0.1 = 0.19999999999999998
function fixFloatRounding(value: number): number
{
    const maxLength = 6;

    if (value.toString().length > maxLength)
    {
        return parseFloat(value.toString().substring(0, maxLength));
    }

    return value;
}

type CssOrientation = DirectionalNode | AngularNode | (ShapeNode | DefaultRadialNode | ExtentKeywordNode)[] | undefined;

export function angleFromOrientation(orientation: CssOrientation): number
{
    if (typeof orientation === 'undefined')
    {
        return 0;
    }

    if ('type' in orientation && 'value' in orientation)
    {
        switch (orientation.type)
        {
            case 'angular':
                return parseFloat(orientation.value);
            case 'directional':
                return angleFromDirectionalValue(orientation.value);
        }
    }

    return 0;
}

export function angleFromDirectionalValue(value: string): number
{
    const supportedValues: { [key: string]: number } = {
        left: -90,
        top: 0,
        bottom: 180,
        right: 90,
        'left top': -45,
        'top left': -45,
        'left bottom': -135,
        'bottom left': -135,
        'right top': 45,
        'top right': 45,
        'right bottom': 135,
        'bottom right': 135,
    };

    if (!(value in supportedValues))
    {
        throw new Error(`Unsupported directional value "${value}"`);
    }

    return supportedValues[value];
}

