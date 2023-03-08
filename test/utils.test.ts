import { describe, expect, test } from 'vitest';
import { emailToGravatar, generateString, getEnv, getViewportSize, iso8601ToString, pathToFormName, stripTrailingSlash } from '../src/utils';

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

    test('check getting env vars', () => {
        expect(getEnv('NETLIFY_SITE_ID')).toEqual(import.meta.env.NETLIFY_SITE_ID);
    });

    test('email to gravatar', () => {
        expect(emailToGravatar('foo@bar.com')).toEqual({
            tiny: 'http://www.gravatar.com/avatar/f3ada405ce890b6f8204094deb12d8a8?s=20',
            normal: 'http://www.gravatar.com/avatar/f3ada405ce890b6f8204094deb12d8a8',
        });
    });

    test('iso8601 to string', () => {
        const date = '2020-01-01';
        expect(iso8601ToString(date)).toEqual('Wed, 01 Jan 2020 00:00:00 GMT');
    });

    test('convert path to form name', () => {
        expect(pathToFormName('/blog/anything')).toEqual('L2Jsb2cvYW55dGhpbmc=');
        expect(pathToFormName('/blog/anything/')).toEqual('L2Jsb2cvYW55dGhpbmc=');
    });
});