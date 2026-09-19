import {
	beam,
	bolt,
	type DitherEffect,
	fire,
	fluid,
	rain,
	rings,
	snow,
} from "@/components/dither-fx";

export type Kind = "fire" | "bolt" | "rings" | "fluid" | "beam" | "rain" | "snow";

export const KINDS: Kind[] = [
	"fire",
	"bolt",
	"rings",
	"fluid",
	"beam",
	"rain",
	"snow",
];

export interface NumberSpec {
	key: string;
	label: string;
	min: number;
	max: number;
	step: number;
}

export interface KindSpec {
	/** Sliders, in the order the effect's own options are documented. */
	numbers: NumberSpec[];
	/** One per colour the factory takes; fire takes three, cold to hot. */
	colors: string[];
	colorLabel: string;
	/** The option name for the anchor, when the effect has one. */
	anchor?: { key: "origin" | "target"; at: [number, number]; axis: "x" | "xy" };
}

export const SPECS: Record<Kind, KindSpec> = {
	fire: {
		numbers: [
			{ key: "height", label: "height", min: 0.1, max: 1, step: 0.05 },
			{ key: "rate", label: "rate", min: 8, max: 60, step: 1 },
			{ key: "embers", label: "embers", min: 0, max: 24, step: 1 },
		],
		colors: ["#e5343a", "#f05100", "#fcbb00"],
		colorLabel: "colors",
	},
	bolt: {
		numbers: [
			{ key: "every", label: "every", min: 0.2, max: 3, step: 0.1 },
			{ key: "upTo", label: "up to", min: 0.2, max: 3, step: 0.1 },
			{ key: "rate", label: "rate", min: 10, max: 60, step: 1 },
		],
		colors: ["#fcbb00"],
		colorLabel: "color",
		anchor: { key: "target", at: [0.5, 0.43], axis: "xy" },
	},
	rings: {
		numbers: [
			{ key: "interval", label: "interval", min: 0.3, max: 3, step: 0.05 },
			{ key: "speed", label: "speed", min: 0.15, max: 1.2, step: 0.05 },
			{ key: "width", label: "width", min: 1, max: 6, step: 0.1 },
		],
		colors: ["#ac4bff"],
		colorLabel: "color",
		anchor: { key: "origin", at: [0.5, 0.42], axis: "xy" },
	},
	fluid: {
		numbers: [
			{ key: "level", label: "level", min: 0.05, max: 0.6, step: 0.01 },
			{ key: "slosh", label: "slosh", min: 0, max: 0.3, step: 0.01 },
			{ key: "tempo", label: "tempo", min: 0.05, max: 0.6, step: 0.01 },
			{ key: "bubbles", label: "bubbles", min: 0, max: 30, step: 1 },
		],
		colors: ["#3080ff"],
		colorLabel: "color",
	},
	beam: {
		numbers: [
			{ key: "spread", label: "spread", min: 0.1, max: 1.2, step: 0.05 },
			{ key: "motes", label: "motes", min: 0, max: 40, step: 1 },
		],
		colors: ["#3080ff"],
		colorLabel: "color",
		anchor: { key: "origin", at: [0.5, 0.5], axis: "x" },
	},
	rain: {
		numbers: [
			{ key: "drops", label: "drops", min: 0, max: 120, step: 1 },
			{ key: "speed", label: "speed", min: 0.4, max: 3, step: 0.1 },
			{ key: "slant", label: "slant", min: -0.8, max: 0.8, step: 0.05 },
			{ key: "length", label: "length", min: 1, max: 12, step: 1 },
		],
		colors: ["#bedbff"],
		colorLabel: "color",
	},
	snow: {
		numbers: [
			{ key: "flakes", label: "flakes", min: 0, max: 120, step: 1 },
			{ key: "speed", label: "speed", min: 0.03, max: 0.5, step: 0.01 },
			{ key: "sway", label: "sway", min: 0, max: 1.5, step: 0.05 },
			{ key: "settle", label: "settle", min: 0, max: 0.5, step: 0.01 },
		],
		colors: ["#d1d5dc"],
		colorLabel: "color",
	},
};

export const DEFAULTS: Record<Kind, Record<string, number>> = {
	fire: { height: 0.5, rate: 36, embers: 8 },
	bolt: { every: 0.6, upTo: 1.4, rate: 30 },
	rings: { interval: 1.15, speed: 0.45, width: 2.6 },
	fluid: { level: 0.2, slosh: 0.09, tempo: 0.15, bubbles: 12 },
	beam: { spread: 0.5, motes: 16 },
	rain: { drops: 64, speed: 1.4, slant: 0.25, length: 6 },
	snow: { flakes: 40, speed: 0.12, sway: 0.6, settle: 0.12 },
};

export type Anchor = readonly [number, number];

/**
 * The anchor is a getter rather than a pair because the effects re-read it
 * every frame: dragging then steers the live effect instead of rebuilding it
 * and losing the rings already in flight.
 */
export function build(
	kind: Kind,
	values: Record<string, number>,
	colors: string[],
	anchor: (() => Anchor) | undefined,
): DitherEffect {
	const [a, b, c] = colors;
	switch (kind) {
		case "fire":
			return fire({
				colors: [a, b, c],
				height: values.height,
				rate: values.rate,
				embers: values.embers,
			});
		case "bolt":
			return bolt({
				color: a,
				interval: [
					Math.min(values.every, values.upTo),
					Math.max(values.every, values.upTo),
				],
				rate: values.rate,
				target: anchor,
			});
		case "rings":
			return rings({
				color: a,
				interval: values.interval,
				speed: values.speed,
				width: values.width,
				origin: anchor,
			});
		case "fluid":
			return fluid({
				color: a,
				level: values.level,
				slosh: values.slosh,
				tempo: values.tempo,
				bubbles: values.bubbles,
			});
		case "beam":
			return beam({
				color: a,
				spread: values.spread,
				motes: values.motes,
				origin: anchor,
			});
		case "rain":
			return rain({
				color: a,
				drops: values.drops,
				speed: values.speed,
				slant: values.slant,
				length: values.length,
			});
		case "snow":
			return snow({
				color: a,
				flakes: values.flakes,
				speed: values.speed,
				sway: values.sway,
				settle: values.settle,
			});
	}
}

const round = (value: number) => Number(value.toFixed(2));

function changed(kind: Kind, values: Record<string, number>, colors: string[]) {
	const spec = SPECS[kind];
	const out: string[] = [];

	if (colors.some((color, i) => color !== spec.colors[i])) {
		out.push(
			kind === "fire"
				? `colors: [${colors.map((c) => `"${c}"`).join(", ")}]`
				: `color: "${colors[0]}"`,
		);
	}

	if (kind === "bolt") {
		const lo = round(Math.min(values.every, values.upTo));
		const hi = round(Math.max(values.every, values.upTo));
		if (lo !== 0.6 || hi !== 1.4) out.push(`interval: [${lo}, ${hi}]`);
		if (values.rate !== 30) out.push(`rate: ${values.rate}`);
		return out;
	}

	for (const { key } of spec.numbers) {
		if (values[key] !== DEFAULTS[kind][key]) out.push(`${key}: ${round(values[key])}`);
	}
	return out;
}

export interface CanvasProps {
	cell: number;
	seed: number;
	active: boolean;
}

export function snippet(
	kind: Kind,
	values: Record<string, number>,
	colors: string[],
	anchor: { on: boolean; x: number; y: number },
	canvas: CanvasProps,
): string {
	const spec = SPECS[kind];
	const options = changed(kind, values, colors);
	if (spec.anchor && anchor.on) {
		const at: [number, number] = spec.anchor.axis === "x"
			? [round(anchor.x), spec.anchor.at[1]]
			: [round(anchor.x), round(anchor.y)];
		if (at[0] !== spec.anchor.at[0] || at[1] !== spec.anchor.at[1]) {
			options.push(`${spec.anchor.key}: [${at[0]}, ${at[1]}]`);
		}
	}

	const call = options.length
		? `${kind}({\n${options.map((line) => `\t${line},`).join("\n")}\n})`
		: `${kind}()`;

	const props = ["effect={effect}"];
	if (!canvas.active) props.push("active={false}");
	if (canvas.cell !== 3) props.push(`cell={${canvas.cell}}`);
	if (canvas.seed !== 1) props.push(`seed={${canvas.seed}}`);

	return [
		`import { DitherCanvas, ${kind} } from "@/components/dither-fx";`,
		"",
		`const effect = ${call};`,
		"",
		`<DitherCanvas ${props.join(" ")} />`,
	].join("\n");
}
