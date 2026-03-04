/**
 * Font optimization script
 *
 * Generates optimized WOFF2 font files for web delivery:
 * - Comic Neue & Tinos: copies pre-optimized latin-subset WOFF2 from @fontsource packages
 * - W95FA: copies pre-optimized latin-subset WOFF2 from @fontsource/win95fa (replaces Windows Regular)
 * - Papyrus: converts TTF to WOFF2 with ttf2woff2 (already small enough that subsetting isn't needed)
 *
 * Original TTF files in public/fonts/ are preserved — WOFF2 files are written alongside them.
 *
 * Usage: pnpm optimize-fonts
 */

import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ttf2woff2 from 'ttf2woff2';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fontsDir = resolve(__dirname, '../public/fonts');
const fontsourceDir = (pkg: string) => resolve(__dirname, `../node_modules/@fontsource/${pkg}/files`);

// ---------------------------------------------------------------------------
// Convert a TTF file to WOFF2
// ---------------------------------------------------------------------------
function convertToWoff2(inputPath: string): Buffer {
	const ttfBuffer = readFileSync(inputPath);
	const convert = typeof ttf2woff2 === 'function' ? ttf2woff2 : (ttf2woff2 as { default: typeof ttf2woff2 }).default;
	const woff2Buffer = convert(ttfBuffer);

	console.log(
		`  ${fmtSize(ttfBuffer.length)} → ${fmtSize(woff2Buffer.length)} (${savings(ttfBuffer.length, woff2Buffer.length)})`,
	);

	return woff2Buffer;
}

// ---------------------------------------------------------------------------
// Copy a fontsource WOFF2 file to public/fonts/ with a new name
// ---------------------------------------------------------------------------
function copyFontsource(pkg: string, srcFile: string, destFile: string): void {
	const src = resolve(fontsourceDir(pkg), srcFile);
	const dest = resolve(fontsDir, destFile);
	copyFileSync(src, dest);
	const size = readFileSync(dest).length;
	console.log(`  ${srcFile} → ${destFile} (${fmtSize(size)})`);
}

function fmtSize(bytes: number): string {
	return `${(bytes / 1024).toFixed(1)} KB`;
}

function savings(before: number, after: number): string {
	return `${((1 - after / before) * 100).toFixed(0)}% smaller`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
mkdirSync(fontsDir, { recursive: true });

console.log('\nOptimizing fonts...\n');

// Comic Neue — fontsource pre-optimized latin WOFF2
console.log('Comic Neue (from @fontsource/comic-neue):');
const comicNeueMap: [string, string][] = [
	['comic-neue-latin-300-normal.woff2', 'ComicNeue-Light.woff2'],
	['comic-neue-latin-300-italic.woff2', 'ComicNeue-LightItalic.woff2'],
	['comic-neue-latin-400-normal.woff2', 'ComicNeue-Regular.woff2'],
	['comic-neue-latin-400-italic.woff2', 'ComicNeue-Italic.woff2'],
	['comic-neue-latin-700-normal.woff2', 'ComicNeue-Bold.woff2'],
	['comic-neue-latin-700-italic.woff2', 'ComicNeue-BoldItalic.woff2'],
];
for (const [src, dest] of comicNeueMap) {
	copyFontsource('comic-neue', src, dest);
}

// Tinos — fontsource pre-optimized latin WOFF2
console.log('\nTinos (from @fontsource/tinos):');
const tinosMap: [string, string][] = [
	['tinos-latin-400-normal.woff2', 'Tinos-Regular.woff2'],
	['tinos-latin-400-italic.woff2', 'Tinos-Italic.woff2'],
	['tinos-latin-700-normal.woff2', 'Tinos-Bold.woff2'],
	['tinos-latin-700-italic.woff2', 'Tinos-BoldItalic.woff2'],
];
for (const [src, dest] of tinosMap) {
	copyFontsource('tinos', src, dest);
}

// W95FA — fontsource pre-optimized latin WOFF2 (replaces Windows Regular)
console.log('\nW95FA (from @fontsource/win95fa):');
copyFontsource('win95fa', 'win95fa-latin-400-normal.woff2', 'w95fa.woff2');

// Papyrus — direct TTF→WOFF2 conversion (only 255 glyphs, subsetting not needed)
console.log('\nPapyrus (ttf2woff2):');
const papyrusWoff2 = convertToWoff2(resolve(fontsDir, 'papyrus.ttf'));
writeFileSync(resolve(fontsDir, 'papyrus.woff2'), papyrusWoff2);

console.log('\nDone!\n');
