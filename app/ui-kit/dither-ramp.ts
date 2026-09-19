import type { CSSProperties } from "react";
import { BAYER4 } from "@/components/dither-fx/engine";

const CELL = 3;
const CELLS = 24;

/**
 * Solid run to the left of the ramp, wide enough to cover any element this
 * masks. A single mask layer can then hold both the revealed part and the
 * fading edge, so the animation is one `mask-position` and nothing composites.
 */
const TAIL = 1020;

const HEIGHT = 4 * CELL;

/** The engine's two alpha tiers, so a masked edge matches a painted one. */
const alphaFor = (density: number, lit: boolean) =>
	lit ? 0.35 + 0.65 * density : 0.12 * density;

/**
 * Only what would close the CSS url() or an SVG attribute. encodeURIComponent
 * escapes every space and slash too and lands a third longer.
 */
const encode = (svg: string) =>
	svg.replace(
		/[%#<>]/g,
		(c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
	);

function build() {
	const parts = [`<rect width='${TAIL}' height='${HEIGHT}'/>`];

	for (let i = 0; i < CELLS; i++) {
		const density = 1 - i / (CELLS - 1);
		const x = TAIL + i * CELL;

		for (const lit of [true, false]) {
			const alpha = alphaFor(density, lit);
			if (alpha < 0.005) continue;

			let d = "";
			for (let y = 0; y < 4; y++) {
				if ((density > BAYER4[(y << 2) | (i & 3)]) !== lit) continue;
				d += `M${x} ${y * CELL}h${CELL}v${CELL}h-${CELL}z`;
			}
			if (d) parts.push(`<path fill-opacity='${+alpha.toFixed(2)}' d='${d}'/>`);
		}
	}

	const svg =
		`<svg xmlns='http://www.w3.org/2000/svg' width='${TAIL + CELLS * CELL}'` +
		` height='${HEIGHT}' fill='#000'>${parts.join("")}</svg>`;

	return `url("data:image/svg+xml,${encode(svg)}")`;
}

/**
 * Set on an ancestor carrying `@container`; the `dither-reveal` class on any
 * descendant inherits it and wipes across that container's width.
 */
export const ditherRamp = {
	"--dither-ramp": build(),
	"--dither-ramp-tail": `${TAIL}px`,
	"--dither-ramp-width": `${TAIL + CELLS * CELL}px`,
	"--dither-ramp-height": `${HEIGHT}px`,
} as CSSProperties;
