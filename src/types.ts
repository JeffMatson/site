import z from 'zod';

export const BooleanAsString = z.literal('true').or(z.literal('false'));
export type BooleanAsString = z.infer<typeof BooleanAsString>;

export const ThemeName = z.literal('light')
    .or(z.literal('dark'))
    .or(z.literal('sanity'))
    .or(z.literal('hotdog'))
    .optional();
export type ThemeName = z.infer<typeof ThemeName>;
