import { FormName } from "@components/Comments/CommentSchema";
import md5 from "md5";

export function generateString(prefix = '', length = 16) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let result = prefix;
    const charactersLength = characters.length;

    for ( let i = result.length; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export function getEnv(env: string) {
    // Since Astro env vars is weird, we have to do this instead of getting it dynamically.
    // See: https://docs.astro.build/en/guides/environment-variables/#getting-environment-variables
    switch (env) {
        case 'FORM_API_TOKEN':
            console.log(import.meta.env.FORM_API_TOKEN);
            console.log(process.env.FORM_API_TOKEN);
            
            switch (true) {
                case import.meta.env.FORM_API_TOKEN !== undefined:
                    return import.meta.env.FORM_API_TOKEN;
                case process.env.FORM_API_TOKEN !== undefined:
                    return process.env.FORM_API_TOKEN;
                default:
                    console.error('Could not find form api token. Set env variable FORM_API_TOKEN');
                    return undefined;
            }
        case 'NETLIFY_API_KEY':
            switch (true) {
                case import.meta.env.NETLIFY_API_KEY !== undefined:
                    return import.meta.env.NETLIFY_API_KEY;
                case process.env.NETLIFY_API_KEY !== undefined:
                    return process.env.NETLIFY_API_KEY;
                default:
                    console.error('Could not find netlify api key. Set env variable NETLIFY_API_KEY');
                    return undefined;
            }
        case 'NETLIFY_SITE_ID':
            switch (true) {
                case import.meta.env.NETLIFY_SITE_ID !== undefined:
                    return import.meta.env.NETLIFY_SITE_ID;
                case process.env.NETLIFY_SITE_ID !== undefined:
                    return process.env.NETLIFY_SITE_ID;
                default:
                    console.error('Could not find netlify site id. Set env variable NETLIFY_SITE_ID');
                    return undefined;
            }
        default:
            console.error(`Unknown env variable ${env}.`);
            return undefined;
    }
}

export function getViewportSize() {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

    return {
        width: vw,
        height: vh
    }
}

export function stripTrailingSlash(string: string) {
    return string.endsWith('/') ? string.slice(0, -1) : string;
}

export function pathToFormName(path: string) {
    const formNameBase64 = Buffer.from(stripTrailingSlash(path), 'binary').toString('base64');
    return FormName.parse(formNameBase64);
}

export function iso8601ToString(iso8601: string) {
    const date = new Date(iso8601);
    return date.toUTCString();
}

export function emailToGravatar(email: string) {
    const emailMd5 = md5(email);
    return {
        tiny: `http://www.gravatar.com/avatar/${emailMd5}?s=20`,
        normal: `http://www.gravatar.com/avatar/${emailMd5}`
    }
}