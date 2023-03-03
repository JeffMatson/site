import {mapTemplate} from 'nanostores';
import type {Schema} from '../meta';

export const OpenGraphStore = mapTemplate<Schema>((newOpenGraph, url) => {
    newOpenGraph.setKey('url', url);
});