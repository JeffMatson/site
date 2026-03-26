import { z } from 'astro/zod';
import { themeNames } from './styles/tokens';

export const BooleanAsString = z.literal('true').or(z.literal('false'));
export type BooleanAsString = z.infer<typeof BooleanAsString>;

export const ThemeName = z.enum(themeNames);
export type ThemeName = z.infer<typeof ThemeName>;
