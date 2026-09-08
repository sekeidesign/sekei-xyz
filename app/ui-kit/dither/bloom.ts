import type { CSSProperties } from "react";

export interface BloomConfig {
	blur: number;
	brightness: number;
	saturate: number;
	opacity: number;
	blend: CSSProperties["mixBlendMode"];
}

/**
 * `soft` is the light-theme glow: a blurred copy of the frame sitting under the
 * crisp one. Additive blends wash to white over a pale background, so those
 * are kept for dark surfaces.
 */
export const BLOOM: Record<"soft" | "glow" | "aura", BloomConfig> = {
	soft: {
		blur: 4,
		brightness: 1,
		saturate: 1.6,
		opacity: 0.55,
		blend: "normal",
	},
	glow: {
		blur: 5,
		brightness: 1.5,
		saturate: 1.5,
		opacity: 0.78,
		blend: "plus-lighter",
	},
	aura: {
		blur: 15,
		brightness: 2.9,
		saturate: 3,
		opacity: 0.1,
		blend: "plus-lighter",
	},
};

export type BloomInput = keyof typeof BLOOM | BloomConfig | "off";

export function bloomStyle(input: BloomInput): CSSProperties | null {
	if (input === "off") return null;
	const cfg = typeof input === "string" ? BLOOM[input] : input;
	return {
		filter: `blur(${cfg.blur}px) brightness(${cfg.brightness}) saturate(${cfg.saturate})`,
		opacity: cfg.opacity,
		mixBlendMode: cfg.blend,
	};
}
