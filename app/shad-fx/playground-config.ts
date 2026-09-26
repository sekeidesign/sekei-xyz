import {
	beam,
	bolt,
	type FxEffect,
	fire,
	fluid,
	rain,
	rings,
	snow,
} from "@/components/shad-fx";

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

export type AnchorKey = "origin" | "target";

export interface AnchorSpec {
	key: AnchorKey;
	/** The library's default, which the snippet compares against. */
	at: [number, number];
	/** Beam reads only the column, so its knobs each keep to one row. */
	axis: "x" | "xy";
	/** The row an x-only knob sits on, as a fraction of the height. */
	row?: number;
	/** The effect trails the knob on a spring instead of snapping to it. */
	spring?: boolean;
}

export interface HandleSpec {
	/** The option a stage handle steers; its NumberSpec sets the range. */
	key: string;
	shape: "arc" | "level";
	/** The effect trails the handle on a spring instead of snapping to it. */
	spring?: boolean;
}

export interface KindSpec {
	/** Sliders, in the order the effect's own options are documented. */
	numbers: NumberSpec[];
	/** One per colour the factory takes; fire takes three, cold to hot. */
	colors: string[];
	colorLabel: string;
	anchors?: AnchorSpec[];
	handle?: HandleSpec;
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
		handle: { key: "height", shape: "level" },
	},
	bolt: {
		numbers: [
			{ key: "every", label: "every", min: 0.2, max: 3, step: 0.1 },
			{ key: "upTo", label: "up to", min: 0.2, max: 3, step: 0.1 },
			{ key: "rate", label: "rate", min: 10, max: 60, step: 1 },
		],
		colors: ["#fcbb00"],
		colorLabel: "color",
		anchors: [{ key: "target", at: [0.5, 0.43], axis: "xy" }],
	},
	rings: {
		numbers: [
			{ key: "interval", label: "interval", min: 0.3, max: 3, step: 0.05 },
			{ key: "speed", label: "speed", min: 0.15, max: 1.2, step: 0.05 },
			{ key: "width", label: "width", min: 1, max: 6, step: 0.1 },
		],
		colors: ["#ac4bff"],
		colorLabel: "color",
		anchors: [{ key: "origin", at: [0.5, 0.42], axis: "xy", spring: true }],
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
		handle: { key: "level", shape: "level", spring: true },
	},
	beam: {
		numbers: [
			{ key: "spread", label: "spread", min: 0.1, max: 1.2, step: 0.05 },
			{ key: "motes", label: "motes", min: 0, max: 40, step: 1 },
		],
		colors: ["#3080ff"],
		colorLabel: "color",
		anchors: [
			{ key: "origin", at: [0.5, 0.5], axis: "x", row: 0.1 },
			{ key: "target", at: [0.5, 0.5], axis: "x", row: 0.9 },
		],
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
		handle: { key: "slant", shape: "arc" },
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
export type AnchorGetters = Partial<Record<AnchorKey, () => Anchor>>;

export interface AnchorState {
	on: boolean;
	at: Partial<Record<AnchorKey, { x: number; y: number }>>;
}

/** The stage handle's option and range for an effect, when it has one. */
export function handleOf(kind: Kind): (HandleSpec & NumberSpec) | undefined {
	const spec = SPECS[kind];
	if (!spec.handle) return undefined;
	const number = spec.numbers.find((n) => n.key === spec.handle?.key);
	return number ? { ...spec.handle, ...number } : undefined;
}

/**
 * Anchors and the live option are getters rather than values because the
 * effects re-read them every frame: dragging then steers the live effect
 * instead of rebuilding it and losing the rings already in flight.
 */
export function build(
	kind: Kind,
	values: Record<string, number>,
	colors: string[],
	anchors: AnchorGetters,
	live?: () => number,
): FxEffect {
	const [a, b, c] = colors;
	switch (kind) {
		case "fire":
			return fire({
				colors: [a, b, c],
				height: live ?? values.height,
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
				target: anchors.target,
			});
		case "rings":
			return rings({
				color: a,
				interval: values.interval,
				speed: values.speed,
				width: values.width,
				origin: anchors.origin,
			});
		case "fluid":
			return fluid({
				color: a,
				level: live ?? values.level,
				slosh: values.slosh,
				tempo: values.tempo,
				bubbles: values.bubbles,
			});
		case "beam":
			return beam({
				color: a,
				spread: values.spread,
				motes: values.motes,
				origin: anchors.origin,
				target: anchors.target,
			});
		case "rain":
			return rain({
				color: a,
				drops: values.drops,
				speed: values.speed,
				slant: live ?? values.slant,
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
	anchors: AnchorState,
	canvas: CanvasProps,
): string {
	const spec = SPECS[kind];
	const options = changed(kind, values, colors);
	if (spec.anchors && anchors.on) {
		for (const a of spec.anchors) {
			const p = anchors.at[a.key];
			if (!p) continue;
			const x = round(p.x);
			const y = a.axis === "x" ? a.at[1] : round(p.y);
			// Beam's target defaults to the origin's column, so it has changed
			// once it leaves that column, not the spec's number.
			const baseX =
				kind === "beam" && a.key === "target"
					? round(anchors.at.origin?.x ?? a.at[0])
					: a.at[0];
			if (x !== baseX || y !== a.at[1]) options.push(`${a.key}: [${x}, ${y}]`);
		}
	}

	const call = options.length
		? `${kind}({\n${options.map((line) => `\t${line},`).join("\n")}\n})`
		: `${kind}()`;

	const props = ["effect={effect}"];
	if (!canvas.active) props.push("active={false}");
	if (canvas.cell !== 2) props.push(`cell={${canvas.cell}}`);
	if (canvas.seed !== 1) props.push(`seed={${canvas.seed}}`);

	return [
		`import { DitherCanvas, ${kind} } from "@/components/shad-fx";`,
		"",
		`const effect = ${call};`,
		"",
		`<DitherCanvas ${props.join(" ")} />`,
	].join("\n");
}
