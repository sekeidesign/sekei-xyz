import type { ReactNode } from "react";
import { EffectCard, type EffectName } from "./EffectCard";
import { Code, P, Section, Table } from "./Prose";

interface Option {
	name: string;
	type: string;
	fallback: string;
	description: ReactNode;
}

interface Effect {
	name: EffectName;
	summary: string;
	options: Option[];
}

// Types and defaults mirror the `<Name>Options` interfaces and factory
// signatures in components/dither-fx/effects. Colours default to tuples in the
// source; shown here as the equivalent hex, since either form is accepted.
const EFFECTS: Effect[] = [
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
				description: (
					<>
						Seconds between strikes at full intensity, as a{" "}
						<Code>[min, max]</Code> range.
					</>
				),
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
				description: (
					<>
						Only the <Code>x</Code> is used: where the light enters at the top
						edge.
					</>
				),
			},
			{
				name: "target",
				type: "Anchor",
				fallback: "undefined",
				description: (
					<>
						Only the <Code>x</Code> is used: where the axis meets the bottom
						edge. Unset, the beam falls straight down from <Code>origin</Code>.
						Set, it leans toward this point.
					</>
				),
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
				description: (
					<>
						Depth the snow settles to along the floor, as a fraction of the
						height. <Code>0</Code> for none.
					</>
				),
			},
		],
	},
];

const HEAD = ["Option", "Type", "Default", "Description"];
const WIDTHS = ["6rem", "11rem", "10rem", "auto"];

function Options({ effect }: { effect: Effect }) {
	return (
		<div id={effect.name} className="flex scroll-mt-8 flex-col gap-4">
			<EffectCard name={effect.name} summary={effect.summary} />
			<Table
				head={HEAD}
				widths={WIDTHS}
				rows={effect.options.map((option) => ({
					key: option.name,
					cells: [
						<Code className="wrap-break-word whitespace-normal" key="n">{option.name}</Code>,
						<Code className="wrap-break-word whitespace-normal" key="t">{option.type}</Code>,
						<Code className="wrap-break-word whitespace-normal" key="d">{option.fallback}</Code>,
						option.description,
					],
				}))}
			/>
		</div>
	);
}

export function Effects() {
	return (
		<Section title="Effects" id="effects">
			<P>
				Every effect is a factory returning a <Code>DitherEffect</Code>, and
				every option is optional. <Code>RgbInput</Code> is a hex string or an{" "}
				<Code>[r, g, b]</Code> tuple. Where a count is given at full intensity,
				it scales down as the effect eases out.
			</P>
			<div className="flex flex-col gap-10">
				{EFFECTS.map((effect) => (
					<Options key={effect.name} effect={effect} />
				))}
			</div>
			<P>
				<Code>origin</Code> and <Code>target</Code> take an <Code>Anchor</Code>:
				an <Code>[x, y]</Code> pair in 0–1 of the box, or a getter, which is
				re-read every frame — so an effect can follow something that moves
				without being rebuilt and losing what it has already simulated. Drag the
				dot in the playground above to see it.
			</P>
		</Section>
	);
}
