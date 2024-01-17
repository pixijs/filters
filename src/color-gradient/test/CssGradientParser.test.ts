import { ColorStop as CssColorStop, parse } from 'gradient-parser';
import { Color, ColorSource } from 'pixi.js';
import { ColorStop } from '../src';
import {
    angleFromCssOrientation,
    angleFromDirectionalValue,
    offsetsFromCssColorStops,
    parseCssGradient,
    trimCssGradient,
    typeFromCssType,
} from '../src/CssGradientParser';
import { describe, expect, jest, test } from '@jest/globals';

jest.mock('./../src/colorGradient.frag', () => '');
jest.mock('./../src/colorGradient.vert', () => '');

describe('CssGradientParser', () =>
{
    test.concurrent('trims CSS gradient', async () =>
    {
        const input = `
            linear-gradient(
      to   right, 
         #fffdc2   ,
      #fffdc2     15%,
      #d7f0a2   15%,
        #d7f0a2 85%,
      #fffdc2 85%   
    )  ;  `;

        const expectedOutput = `linear-gradient(to right, #fffdc2, #fffdc2 15%, #d7f0a2 15%, #d7f0a2 85%, #fffdc2 85%)`;

        expect(trimCssGradient(input)).toEqual(expectedOutput);
    });

    test.concurrent('gets type', async () =>
    {
        // valid types
        const testCases = {
            'linear-gradient': 0,
            'radial-gradient': 1,
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

    describe('gets stops', () =>
    {
        const testCases: { [key: string]: ColorStop[] } = {
            'linear-gradient(red, blue)': [
                { offset: 0.0, color: [1, 0, 0], alpha: 1.0 },
                { offset: 1.0, color: [0, 0, 1], alpha: 1.0 },
            ],
            'linear-gradient(red, yellow, blue)': [
                { offset: 0.0, color: [1, 0, 0], alpha: 1.0 },
                { offset: 0.5, color: [1, 1, 0], alpha: 1.0 },
                { offset: 1.0, color: [0, 0, 1], alpha: 1.0 },
            ],
            'linear-gradient(rgba(255,0,0,0.5), #f0f)': [
                { offset: 0.0, color: [1, 0, 0], alpha: 0.5 },
                { offset: 1.0, color: [1, 0, 1], alpha: 1.0 },
            ],
        };

        for (const [cssGradient, expectedStops] of Object.entries(testCases))
        {
            test(cssGradient, () =>
            {
                expect(parseCssGradient(cssGradient).stops).toEqual(expectedStops);
            });
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

    describe('gets color as normalized rgba from color stop', () =>
    {
    type testCaseType = { stop: CssColorStop, expectedValue: number[] };
    const testCases: testCaseType[] = [
        { stop: { type: 'literal', value: 'red' }, expectedValue: [1, 0, 0, 1] },
        { stop: { type: 'hex', value: 'ff0000' }, expectedValue: [1, 0, 0, 1] },
        { stop: { type: 'hex', value: 'f00' }, expectedValue: [1, 0, 0, 1] },
        { stop: { type: 'rgb', value: ['255', '0', '0'] }, expectedValue: [1, 0, 0, 1] },
        { stop: { type: 'rgba', value: ['255', '0', '0', '20%'] }, expectedValue: [1, 0, 0, 255 * 0.2 / 255] },
    ];

    for (let i = 0; i < testCases.length; i++)
    {
        const { stop, expectedValue } = testCases[i];
        const color = new Color();

        test(`${stop.value} = ${expectedValue}`, () =>
        {
            expect(color.setValue(stop.value as ColorSource)).toEqual(expectedValue);
        });
    }
    });

    describe('gets angle from orientation', () =>
    {
        test.concurrent('angular', async () =>
        {
            expect(angleFromCssOrientation({ type: 'angular', value: '5' })).toEqual(5);
            expect(angleFromCssOrientation({ type: 'angular', value: '-5' })).toEqual(-5);
        });

        test.concurrent('directional', async () =>
        {
            // undefined
            expect(angleFromCssOrientation(undefined)).toEqual(0);

            // directions
            const testCases = {
                left: 270,
                top: 0,
                bottom: 180,
                right: 90,
                'left top': 315,
                'top left': 315,
                'left bottom': 225,
                'bottom left': 225,
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

