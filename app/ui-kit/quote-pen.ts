import type { HighlightOptions } from "@highlighters/react";

export const QUOTATION = /["“][^"“”]+["”]/g;

export const PEN: HighlightOptions = {
	// Tailwind amber-500 as hex: the pen paints to canvas, which reads no CSS vars.
	color: "#fe9a00",
	opacity: 0.8,
	tip: { type: "chisel", angle: 1, angleJitter: 6 },
	edge: { waviness: 1, frequency: 32 },
	ink: { streakiness: 1, startEndBuildup: 1, flow: 1 },
	// The library observes one overlay that spans the whole prose root, so the
	// threshold is a ratio of the entire article, not of a single mark. A phone
	// column runs several viewports tall, capping the ratio below any real
	// threshold, and the marks would stay undrawn.
	animation: { trigger: "in-view", threshold: 0 },
};

export const PEN_STILL: HighlightOptions = {
	...PEN,
	animation: { draw: false },
};
