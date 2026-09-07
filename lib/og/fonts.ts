import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Geist for Satori, which needs raw font bytes rather than the CSS next/font
 * hands back. Static instances, since Satori renders a variable font at its
 * default weight only.
 *
 * Read off disk rather than through `new URL(..., import.meta.url)`, which is
 * what the Next docs pair with `fetch`: in the webpack server build that
 * resolves to the asset's public path, not a file one, so the route 500s in
 * production while dev renders fine under Turbopack. A path read isn't traced
 * on its own, so next.config's `outputFileTracingIncludes` ships this
 * directory with the route.
 */

const FONT_DIR = path.join(process.cwd(), "lib", "og", "fonts");

export type OgFont = {
	name: string;
	data: ArrayBuffer;
	weight: 400 | 500 | 600;
	style: "normal";
};

let cached: Promise<OgFont[]> | undefined;

/** Mono is one weight: the cards only set IDs and dates in it. */
const FACES: { file: string; name: string; weight: OgFont["weight"] }[] = [
	{ file: "geist-400", name: "Geist", weight: 400 },
	{ file: "geist-500", name: "Geist", weight: 500 },
	{ file: "geist-600", name: "Geist", weight: 600 },
	{ file: "geist-mono-400", name: "Geist Mono", weight: 400 },
];

export function geistForOg(): Promise<OgFont[]> {
	cached ??= Promise.all(
		FACES.map(async ({ file, name, weight }) => {
			const bytes = await readFile(path.join(FONT_DIR, `${file}.ttf`));
			return {
				name,
				data: bytes.buffer.slice(
					bytes.byteOffset,
					bytes.byteOffset + bytes.byteLength,
				) as ArrayBuffer,
				weight,
				style: "normal" as const,
			};
		}),
	);
	return cached;
}
