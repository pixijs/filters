import { describe, expect, jest, test } from '@jest/globals';
import { parse } from 'gradient-parser';
import {
    angleFromDirectionalValue,
    angleFromCssOrientation,
    offsetsFromCssColorStops,
    parseCssGradient, typeFromCssType
} from '../src/CssGradientParser';
import { ColorGradientFilter, ColorStop } from '../src';

jest.mock('./../src/colorGradient.frag', () => '');
jest.mock('./../src/colorGradient.vert', () => '');

describe('CssGradientParser', () =>
{
    test('gets type', () =>
    {
        // valid types
        const testCases = {
            'linear-gradient': ColorGradientFilter.LINEAR,
            'radial-gradient': ColorGradientFilter.RADIAL,
        };

        for (const [input, expectedResult] of Object.entries(testCases))
        {
            expect(typeFromCssType(input)).toEqual(expectedResult);
        }

        // invalid/unsupported types
        expect(() =>
        {
            typeFromCssType('__INVALID__');
        }).toThrow('Unsupported gradient type "__INVALID__"');

        expect(() =>
        {
            typeFromCssType('conic-gradient');
        }).toThrow('Unsupported gradient type "conic-gradient"');
    });

    test('gets stops', () =>
    {
        const testCases: { [key: string]: ColorStop[] } = {
            'linear-gradient(red, green)': [
                { offset: 0.0, color: 'red', alpha: 1.0 },
                { offset: 1.0, color: 'green', alpha: 1.0 },
            ],
            'linear-gradient(red, green, blue)': [
                { offset: 0.0, color: 'red', alpha: 1.0 },
                { offset: 0.5, color: 'green', alpha: 1.0 },
                { offset: 1.0, color: 'blue', alpha: 1.0 },
            ]
        };

        for (const [cssGradient, expectedStops] of Object.entries(testCases))
        {
            expect(parseCssGradient(cssGradient).stops).toEqual(expectedStops);
        }
    });

    describe('gets offsets from color stops', () =>
    {
        const testCases: { [key: string]: number[] } = {
            'linear-gradient(red, green)': [0.0, 1.0],
            'linear-gradient(red, green, blue)': [0.0, 0.5, 1.0],
            'linear-gradient(red 50%, green, blue)': [0.5, 0.75, 1.0],
            'linear-gradient(red, green 50%, blue)': [0.0, 0.5, 1.0],
            'linear-gradient(red, green, blue 50%)': [0.0, 0.25, 0.5],
            'linear-gradient(red, green, blue 80%, red, green 90%, blue)': [
                0.0, 0.4, 0.8, 0.85, 0.9, 1.0
            ],
        };

        for (const [cssGradient, expectedOffsets] of Object.entries(testCases))
        {
            test(cssGradient, () =>
            {
                const colorStops = parse(cssGradient)[0].colorStops;

                expect(offsetsFromCssColorStops(colorStops)).toEqual(expectedOffsets);
            });
        }
    });

    describe('gets angle from orientation', () =>
    {
        test('angular', () =>
        {
            expect(angleFromCssOrientation({ type: 'angular', value: '5' })).toEqual(5);
            expect(angleFromCssOrientation({ type: 'angular', value: '-5' })).toEqual(-5);
        });

        test('directional', () =>
        {
            // undefined
            expect(angleFromCssOrientation(undefined)).toEqual(0);

            // directions
            const testCases = {
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

            for (const [value, expectedResult] of Object.entries(testCases))
            {
                expect(angleFromDirectionalValue(value)).toEqual(expectedResult);
            }

            // invalid
            expect(() =>
            {
                angleFromDirectionalValue('__INVALID__');
            }).toThrow('Unsupported directional value "__INVALID__"');
        });
    });
});

