import { describe, expect, test } from '@jest/globals';
import { colorToNormalizedRgba } from '../src/utils';

describe.only('utils', () =>
{
    test.concurrent('colorToNormalizedRgba', async () =>
    {
        const rgbaRed = [1, 0, 0, 1];
        const semiTransparentRed = [1, 0, 0, 0.5];

        const testCases = {
            transparent: [0, 0, 0, 0],
            red: rgbaRed,
            '#ff000000': [1, 0, 0, 0],
            '#ff0000': rgbaRed,
            '#f00': rgbaRed,
            'rgb(255, 0, 0)': rgbaRed,
            'rgba(255, 0, 0)': rgbaRed,
            'rgba(255, 0, 0, 0.5)': semiTransparentRed,
            'rgba(255, 0, 0 / 0.5)': semiTransparentRed,
            'rgba(255, 0, 0, 50%)': semiTransparentRed,
            'rgba(255, 0, 0 / 50%)': semiTransparentRed,
            'hsl(0, 100%, 50%)': rgbaRed,
            'hsla(0, 100%, 50%, 0.5)': semiTransparentRed,
            'hsla(0, 100%, 50% / 0.5)': semiTransparentRed,
            'hsla(0, 100%, 50%, 50%)': semiTransparentRed,
            'hsla(0, 100%, 50% / 50%)': semiTransparentRed,
        };

        for (const [value, expectedResult] of Object.entries(testCases))
        {
            expect(colorToNormalizedRgba(value)).toEqual(expectedResult);
        }
    });
});

