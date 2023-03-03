import { describe, expect, test } from 'vitest';
import { generateString, getViewportSize, stripTrailingSlash } from '../src/utils';

describe('Test utility functions: utils.ts', () => {
    test('generate string with defaults', () => {
        const string = generateString();
        
        expect(string).toBeTypeOf('string');
        expect(string).toHaveLength(16);
    });

    test('generate string with custom length', () => {
        const string = generateString('', 10);

        expect(string).toBeTypeOf('string');
        expect(string).toHaveLength(10);
    });

    test('generate string with custom prefix', () => {
        const string = generateString('foo');

        expect(string).toBeTypeOf('string');
        expect(string).toHaveLength(16);
        expect(string).toEqual(expect.stringMatching(/^foo/));
    });

    test('check viewport size', () => {
        expect(getViewportSize()).toEqual({
            width: 1024,
            height: 768
        });
    });

    test('strip trailing slash', () => {
        expect(stripTrailingSlash('/foo')).toEqual('/foo');
        expect(stripTrailingSlash('/foo/bar')).toEqual('/foo/bar');
        expect(stripTrailingSlash('/foo/bar/')).toEqual('/foo/bar');
        expect(stripTrailingSlash('/foo/bar//')).toEqual('/foo/bar/');
    });
});