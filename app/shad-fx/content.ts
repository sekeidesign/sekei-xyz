import type { EffectName } from "./EffectCard";

// Shared by the page and agents.md, so the two can't drift. Backticks mark
// inline code: <Inline> renders them as <Code>, markdown keeps them as-is.

export const REPO = "https://github.com/sekeidesign/shad-fx";

export const SUMMARY =
	"Canvas effects for React, installed with the shadcn CLI. Effects (fire, lightning, sonar rings, a light beam, a sloshing fluid, rain and snow) are separate from the renderer that draws them; the first renderer is ordered dither.";

export const INSTALL = `npx shadcn@latest add @sekei/shad-fx
npx shadcn@latest add @sekei/shad-fx-dither @sekei/shad-fx-fire`;

export const SKILLS = "npx skills add sekeidesign/shad-fx";

export const REGISTRY_CONFIG = `{
  "registries": {
    "@sekei": "https://www.sekei.xyz/registry/{name}.json"
  }
}`;

export const USAGE = `import { DitherCanvas, fire } from "@/components/shad-fx";
import { useMemo } from "react";

export function Card() {
  const effect = useMemo(() => fire({ colors: ["#e5343a", "#f05100", "#fcbb00"] }), []);

  return (
    <div className="relative overflow-hidden rounded-lg">
      <DitherCanvas effect={effect} />
      <p className="relative">Burning</p>
    </div>
  );
}`;

export interface Item {
	name: string;
	pullsIn: string;
}

export const ITEMS: Item[] = [
	{ name: "shad-fx", pullsIn: "Every renderer and effect, plus an index.ts barrel" },
	{
		name: "shad-fx-dither",
		pullsIn: "The dither renderer, DitherCanvas. Engine, the reduced-motion hook, utils",
	},
	...(["fire", "rings", "beam", "bolt", "fluid", "rain", "snow"] as const).map(
		(effect) => ({ name: `shad-fx-${effect}`, pullsIn: "Engine" }),
	),
	{
		name: "shad-fx-engine",
		pullsIn: "Nothing — frame loop, the effect contract, seeded RNG, colour helpers",
	},
	{ name: "use-prefers-reduced-motion", pullsIn: "Nothing" },
];

export interface Prop {
	name: string;
	fallback: string;
	notes: string;
}

export const PROPS: Prop[] = [
	{ name: "effect", fallback: "—", notes: "The effect to run. Keep the reference stable." },
	{ name: "active", fallback: "true", notes: "Eases in and out. Drive it from hover for a reveal." },
	{ name: "cell", fallback: "2", notes: "CSS px per dither cell. Lower is finer and costlier." },
	{ name: "seed", fallback: "1", notes: "Seeds the RNG, so a given seed replays identically." },
	{ name: "maxCols / maxRows", fallback: "640 / 400", notes: "Ceiling on the backing grid." },
	{ name: "className", fallback: "—", notes: "Merged onto the wrapper." },
];

export interface Option {
	name: string;
	type: string;
	fallback: string;
	description: string;
}

export interface Effect {
	name: EffectName;
	summary: string;
	options: Option[];
}

// Types and defaults mirror the `<Name>Options` interfaces and factory
// signatures in components/shad-fx/effects. Colours default to tuples in the
// source; shown here as the equivalent hex, since either form is accepted.
export const EFFECTS: Effect[] = [
	{
		name: "fire",
		summary: "Rising flame front with embers.",
		options: [
			{
				name: "colors",
				type: "[RgbInput, RgbInput, RgbInput]",
				fallback: '["#e5343a", "#f05100", "#fcbb00"]',
				description: "Cold to hot: the tips, the body, the base.",
			},
			{
				name: "height",
				type: "number | (() => number)",
				fallback: "0.5",
				description:
					"Fraction of the height the flames reach at full intensity. A getter is re-read every frame.",
			},
			{
				name: "rate",
				type: "number",
				fallback: "36",
				description: "Simulation steps per second. Lower reads chunkier.",
			},
			{
				name: "embers",
				type: "number",
				fallback: "8",
				description: "Embers aloft at once, at full intensity.",
			},
		],
	},
	{
		name: "bolt",
		summary: "Lightning on a randomised interval.",
		options: [
			{
				name: "color",
				type: "RgbInput",
				fallback: '"#fcbb00"',
				description: "Colour of the strike and its afterglow.",
			},
			{
				name: "interval",
				type: "[number, number]",
				fallback: "[0.6, 1.4]",
				description:
					"Seconds between strikes at full intensity, as a `[min, max]` range.",
			},
			{
				name: "target",
				type: "Anchor",
				fallback: "[0.5, 0.43]",
				description:
					"What the strikes aim for. They land just short of it or on it.",
			},
			{
				name: "rate",
				type: "number",
				fallback: "30",
				description: "Simulation steps per second. Lower reads chunkier.",
			},
		],
	},
	{
		name: "rings",
		summary: "Sonar rings pulsing from an anchor.",
		options: [
			{
				name: "color",
				type: "RgbInput",
				fallback: '"#ac4bff"',
				description: "Colour of the rings.",
			},
			{
				name: "origin",
				type: "Anchor",
				fallback: "[0.5, 0.42]",
				description: "The point every ring expands from.",
			},
			{
				name: "interval",
				type: "number",
				fallback: "1.15",
				description: "Seconds between rings.",
			},
			{
				name: "speed",
				type: "number",
				fallback: "0.45",
				description:
					"Expansion speed as a fraction of the height per second.",
			},
			{
				name: "width",
				type: "number",
				fallback: "2.6",
				description: "Ring thickness in cells.",
			},
		],
	},
	{
		name: "fluid",
		summary: "A sloshing level with rising bubbles.",
		options: [
			{
				name: "color",
				type: "RgbInput",
				fallback: '"#3080ff"',
				description: "Colour of the liquid and its bubbles.",
			},
			{
				name: "level",
				type: "number | (() => number)",
				fallback: "0.2",
				description:
					"Resting depth as a fraction of the height, at full intensity. A getter is re-read every frame.",
			},
			{
				name: "slosh",
				type: "number",
				fallback: "0.09",
				description:
					"How far the surface tilts at either edge, as a fraction of the height.",
			},
			{
				name: "tempo",
				type: "number",
				fallback: "0.15",
				description: "Slosh cycles per second.",
			},
			{
				name: "bubbles",
				type: "number",
				fallback: "12",
				description: "Bubbles rising at once, at full intensity.",
			},
		],
	},
	{
		name: "beam",
		summary: "A cone of light with drifting motes.",
		options: [
			{
				name: "color",
				type: "RgbInput",
				fallback: '"#3080ff"',
				description: "Colour of the light and its motes.",
			},
			{
				name: "origin",
				type: "Anchor",
				fallback: "[0.5, 0.5]",
				description:
					"Only the `x` is used: where the light enters at the top edge.",
			},
			{
				name: "target",
				type: "Anchor",
				fallback: "undefined",
				description:
					"Only the `x` is used: where the axis meets the bottom edge. Unset, the beam falls straight down from `origin`. Set, it leans toward this point.",
			},
			{
				name: "spread",
				type: "number",
				fallback: "0.5",
				description:
					"Half-width of the cone at the bottom edge, as a fraction of the width.",
			},
			{
				name: "motes",
				type: "number",
				fallback: "16",
				description: "Dust motes drifting in the light.",
			},
		],
	},
	{
		name: "rain",
		summary: "Slanted streaks, splashing on the floor.",
		options: [
			{
				name: "color",
				type: "RgbInput",
				fallback: '"#bedbff"',
				description: "Colour of the drops and splashes.",
			},
			{
				name: "drops",
				type: "number",
				fallback: "64",
				description: "Drops in flight at once, at full intensity.",
			},
			{
				name: "speed",
				type: "number",
				fallback: "1.4",
				description:
					"Fall speed of the nearest drops as a fraction of the height per second.",
			},
			{
				name: "slant",
				type: "number | (() => number)",
				fallback: "0.25",
				description:
					"Cells drifted sideways per cell fallen. Negative blows left. A getter is re-read every frame.",
			},
			{
				name: "length",
				type: "number",
				fallback: "6",
				description: "Streak length of the nearest drops, in cells.",
			},
		],
	},
	{
		name: "snow",
		summary: "Drifting flakes that settle into a drift.",
		options: [
			{
				name: "color",
				type: "RgbInput",
				fallback: '"#d1d5dc"',
				description: "Colour of the flakes and the drift.",
			},
			{
				name: "flakes",
				type: "number",
				fallback: "40",
				description: "Flakes aloft at once.",
			},
			{
				name: "speed",
				type: "number",
				fallback: "0.12",
				description:
					"Fall speed of the nearest flakes as a fraction of the height per second.",
			},
			{
				name: "sway",
				type: "number",
				fallback: "0.6",
				description: "Sideways wander as a fraction of the fall speed.",
			},
			{
				name: "settle",
				type: "number",
				fallback: "0.12",
				description:
					"Depth the snow settles to along the floor, as a fraction of the height. `0` for none.",
			},
		],
	},
];
