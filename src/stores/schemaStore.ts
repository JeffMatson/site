import {mapTemplate} from 'nanostores';
import type {Schema} from '../meta';

export const SchemaStore = mapTemplate<Schema>((newSchema, url) => {
    newSchema.setKey('url', url);
});