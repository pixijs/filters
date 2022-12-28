import { describe, expect, test } from '@jest/globals';
import { colorToNormalizedRgba } from '../src/utils';

describe.only('utils', () =>
{
    test.concurrent('colorToNormalizedRgba', async () =>
    {
        const rgbaRed = [1, 0, 0, 1];
        const transparentRed = [1, 0, 0, 0];

        const testCases = {
            red: rgbaRed,
            '#ff0000': rgbaRed,
            '#ff000000': transparentRed,
            '#f00': rgbaRed,
            'rgb(255,0,0)': rgbaRed,
            'rgba(255,0,0)': rgbaRed,
            'rgba(255,0,0,1)': rgbaRed,
            'rgba(255,0,0,100%)': rgbaRed,
            'rgba(255,0,0,0%)': transparentRed,
            'rgba(255,0,0,0)': transparentRed,
            transparent: [0, 0, 0, 0],
        };

        for (const [value, expectedResult] of Object.entries(testCases))
        {
            expect(colorToNormalizedRgba(value)).toEqual(expectedResult);
        }
    });
});

