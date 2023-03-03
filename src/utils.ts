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
    if ( import.meta.env[env]) {
        return import.meta.env[env];
    } else if (process.env[env]) {
        return process.env[env];
    }

    return undefined;
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