"use client";

import { useSpring } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DitherCanvas } from "@/components/shad-fx";
import { cn } from "@ui-kit/cn";
import { ControlPanel, ControlSection } from "@ui-kit/controls/ControlPanel";
import { Select } from "@ui-kit/controls/Select";
import { Slider } from "@ui-kit/controls/Slider";
import { Swatches } from "@ui-kit/controls/Swatches";
import { Toggle } from "@ui-kit/controls/Toggle";
import { SURFACE_INNER, SURFACE_OUTER } from "@ui-kit/post/surface";
import { AnchorHandle } from "./AnchorHandle";
import { EffectTabs } from "./EffectTabs";
import { LevelHandle } from "./LevelHandle";
import {
	type AnchorGetters,
	type AnchorKey,
	type AnchorSpec,
	type AnchorState,
	build,
	DEFAULTS,
	handleOf,
	type Kind,
	KINDS,
	snippet,
	SPECS,
} from "./playground-config";
import { SlantHandle } from "./SlantHandle";
import { Snippet } from "./Snippet";

const SURFACES = [
	{ value: "light", label: "Light" },
	{ value: "dark", label: "Dark" },
];

const COLOR_NAMES: Record<Kind, string[]> = {
	fire: ["cold", "warm", "hot"],
	bolt: ["color"],
	rings: ["color"],
	fluid: ["color"],
	beam: ["color"],
	rain: ["color"],
	snow: ["color"],
};

// What a sprung anchor or handle trails its knob on: a little give, no wobble.
const HANDLE_SPRING = { stiffness: 180, damping: 20 };

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

// How close the beam's two ends have to be, as a fraction of the width, before
// they snap into one column and the beam stands upright.
const SNAP = 0.03;

type Anchors = Record<Kind, AnchorState>;

const initialAnchors = () =>
	Object.fromEntries(
		KINDS.map((kind) => [
			kind,
			{
				on: true,
				at: Object.fromEntries(
					(SPECS[kind].anchors ?? []).map((a) => [
						a.key,
						{ x: a.at[0], y: a.at[1] },
					]),
				),
			},
		]),
	) as Anchors;

const initialColors = () =>
	Object.fromEntries(KINDS.map((kind) => [kind, SPECS[kind].colors])) as Record<
		Kind,
		string[]
	>;

const initialLive = () =>
	Object.fromEntries(
		KINDS.map((kind) => {
			const handle = handleOf(kind);
			return [kind, handle ? DEFAULTS[kind][handle.key] : 0];
		}),
	) as Record<Kind, number>;

export function Playground() {
	const [kind, setKind] = useState<Kind>("fire");
	const [surface, setSurface] = useState("light");
	const [cell, setCell] = useState(2);
	const [seed, setSeed] = useState(1);
	const [active, setActive] = useState(true);

	// Per effect, so leaving fire for rings and coming back finds fire as it was.
	const [values, setValues] = useState(() => ({ ...DEFAULTS }));
	const [colors, setColors] = useState(initialColors);
	const [anchors, setAnchors] = useState(initialAnchors);
	// One option per effect is steered from the stage: fire's height, fluid's
	// level, rain's slant. It lives outside `values`, like the anchors, and
	// reaches the effect through a getter read every frame, so a drag never
	// produces a new effect reference and restarts what is on screen.
	const [live, setLive] = useState(initialLive);

	const spec = SPECS[kind];
	const handle = useMemo(() => handleOf(kind), [kind]);
	const anchor = anchors[kind];
	const stage = useRef<HTMLDivElement>(null);

	// Refs, not dependencies: the getters read the latest state without the
	// effect being rebuilt around them.
	const anchorRef = useRef(anchors);
	useEffect(() => {
		anchorRef.current = anchors;
	}, [anchors]);
	const liveRef = useRef(live);
	useEffect(() => {
		liveRef.current = live;
	}, [live]);
	// A sprung live value, for the handles that ask for one: fluid's level
	// rises and settles behind its pill rather than stepping with it.
	const sprungLive = useSpring(0, HANDLE_SPRING);
	const liveSprung = Boolean(handle?.spring);
	const sprungLiveFor = useRef<Kind | null>(null);
	useEffect(() => {
		if (!liveSprung) return;
		const value = live[kind];
		if (sprungLiveFor.current !== kind) {
			sprungLiveFor.current = kind;
			sprungLive.jump(value);
			return;
		}
		sprungLive.set(value);
	}, [kind, liveSprung, live, sprungLive]);
	const getLive = useCallback(
		() => (liveSprung ? sprungLive.get() : liveRef.current[kind]),
		[kind, liveSprung, sprungLive],
	);

	// A sprung anchor. The knob follows the pointer; the effect reads these,
	// which trail it. Switching effects jumps them, so nothing swings in from
	// wherever the previous effect's knob was.
	const sprungX = useSpring(0, HANDLE_SPRING);
	const sprungY = useSpring(0, HANDLE_SPRING);
	const sprungSpec = spec.anchors?.find((a) => a.spring);
	const sprungAt = sprungSpec ? anchor.at[sprungSpec.key] : undefined;
	const sprungFor = useRef<Kind | null>(null);
	useEffect(() => {
		if (!sprungAt) return;
		if (sprungFor.current !== kind) {
			sprungFor.current = kind;
			sprungX.jump(sprungAt.x);
			sprungY.jump(sprungAt.y);
			return;
		}
		sprungX.set(sprungAt.x);
		sprungY.set(sprungAt.y);
	}, [kind, sprungAt, sprungX, sprungY]);

	const getters = useMemo(() => {
		const out: AnchorGetters = {};
		for (const a of spec.anchors ?? []) {
			out[a.key] = a.spring
				? () => [sprungX.get(), sprungY.get()]
				: () => {
						const p = anchorRef.current[kind].at[a.key];
						return p ? [p.x, p.y] : a.at;
					};
		}
		return out;
	}, [kind, spec.anchors, sprungX, sprungY]);

	const effect = useMemo(
		() =>
			build(
				kind,
				values[kind],
				colors[kind],
				anchor.on ? getters : {},
				handle ? getLive : undefined,
			),
		[kind, values, colors, anchor.on, getters, handle, getLive],
	);

	const code = snippet(
		kind,
		handle ? { ...values[kind], [handle.key]: live[kind] } : values[kind],
		colors[kind],
		anchor,
		{ cell, seed, active },
	);

	const isLive = (key: string) => handle?.key === key;
	const valueOf = (key: string) => (isLive(key) ? live[kind] : values[kind][key]);
	const setLiveValue = (value: number) =>
		setLive((prev) => ({ ...prev, [kind]: value }));
	const setValue = (key: string, value: number) => {
		if (isLive(key)) {
			setLiveValue(value);
			return;
		}
		setValues((prev) => ({ ...prev, [kind]: { ...prev[kind], [key]: value } }));
	};
	const moveAnchor = (key: AnchorKey, x: number, y: number) =>
		setAnchors((prev) => ({
			...prev,
			[kind]: { on: true, at: { ...prev[kind].at, [key]: { x, y } } },
		}));

	// Beam's anchors are read at the top and bottom edges, where a knob would be
	// half clipped, so each knob sits a little way in on the axis line, and a
	// drag is solved back to the edge it stands for.
	const axis =
		spec.anchors?.length === 2 && anchor.at.origin && anchor.at.target
			? { ox: anchor.at.origin.x, tx: anchor.at.target.x }
			: undefined;
	const knobX = (a: AnchorSpec, x: number) =>
		axis && a.axis === "x" ? axis.ox + (axis.tx - axis.ox) * (a.row ?? 0.5) : x;
	const edgeX = (a: AnchorSpec, knob: number) => {
		if (!axis || a.axis !== "x") return knob;
		const r = a.row ?? 0.5;
		const edge =
			a.key === "origin"
				? clamp01((knob - axis.tx * r) / (1 - r))
				: clamp01((knob - axis.ox * (1 - r)) / r);
		const other = a.key === "origin" ? axis.tx : axis.ox;
		return Math.abs(edge - other) < SNAP ? other : edge;
	};
	// The middle knob carries both ends along, keeping the angle. The shift is
	// clamped so neither end leaves the box.
	const shiftAxis = (mid: number) =>
		setAnchors((prev) => {
			const at = prev[kind].at;
			if (!at.origin || !at.target) return prev;
			const lo = Math.min(at.origin.x, at.target.x);
			const hi = Math.max(at.origin.x, at.target.x);
			const d = Math.max(-lo, Math.min(1 - hi, mid - (lo + hi) / 2));
			return {
				...prev,
				[kind]: {
					on: true,
					at: {
						...at,
						origin: { ...at.origin, x: at.origin.x + d },
						target: { ...at.target, x: at.target.x + d },
					},
				},
			};
		});

	return (
		<div className={cn("rounded-xl", SURFACE_OUTER)}>
			<div className="px-1 pt-0.5 pb-1.5">
				<EffectTabs value={kind} onChange={setKind} />
			</div>

			<div className={cn("flex flex-col rounded-lg lg:flex-row", SURFACE_INNER)}>
				<div
					ref={stage}
					className={cn(
						"relative min-h-70 flex-1",
						surface === "dark" && "bg-gray-900",
					)}
				>
					<DitherCanvas
						effect={effect}
						active={active}
						cell={cell}
						seed={seed}
					/>
					{axis && anchor.on && (
						<svg
							aria-hidden="true"
							className="pointer-events-none absolute inset-0 size-full text-gray-900/10"
							viewBox="0 0 100 100"
							preserveAspectRatio="none"
						>
							<line
								x1={axis.ox * 100}
								y1={0}
								x2={axis.tx * 100}
								y2={100}
								stroke="currentColor"
								strokeWidth="1"
								vectorEffect="non-scaling-stroke"
							/>
						</svg>
					)}
					{axis && anchor.on && (
						<AnchorHandle
							box={stage}
							x={(axis.ox + axis.tx) / 2}
							y={0.5}
							axis="x"
							row={0.5}
							shape="tall"
							label={`Drag to move the ${kind}`}
							onChange={shiftAxis}
						/>
					)}
					{anchor.on &&
						spec.anchors?.map((a) => {
							const p = anchor.at[a.key];
							if (!p) return null;
							return (
								<AnchorHandle
									key={a.key}
									box={stage}
									x={knobX(a, p.x)}
									y={p.y}
									axis={a.axis}
									row={a.row}
									label={`Drag to move the ${kind} ${a.key}`}
									onChange={(x, y) => moveAnchor(a.key, edgeX(a, x), y)}
								/>
							);
						})}
					{handle?.shape === "arc" && (
						<SlantHandle
							box={stage}
							value={live[kind]}
							min={handle.min}
							max={handle.max}
							step={handle.step}
							label={`Drag to set the ${kind} ${handle.key}`}
							onChange={setLiveValue}
						/>
					)}
					{handle?.shape === "level" && (
						<LevelHandle
							box={stage}
							value={live[kind]}
							min={handle.min}
							max={handle.max}
							step={handle.step}
							label={`Drag to set the ${kind} ${handle.key}`}
							onChange={setLiveValue}
						/>
					)}
				</div>

				<ControlPanel
					className={cn(
						"shrink-0 rounded-none bg-transparent shadow-none ring-0 lg:w-72",
						"border-t border-gray-200 lg:border-t-0 lg:border-l",
					)}
				>
					<ControlSection label="canvas" />
					<Toggle label="active" checked={active} onChange={setActive} />
					<Slider
						label="cell"
						value={cell}
						min={1}
						max={8}
						step={1}
						unit="px"
						onChange={setCell}
					/>
					<Slider
						label="seed"
						value={seed}
						min={1}
						max={12}
						step={1}
						onChange={setSeed}
					/>
					<Select
						label="surface"
						value={surface}
						options={SURFACES}
						onChange={setSurface}
					/>

					<ControlSection label={`${kind}()`} />
					<Swatches
						label={spec.colorLabel}
						values={colors[kind]}
						names={COLOR_NAMES[kind]}
						onChange={(next) => setColors((prev) => ({ ...prev, [kind]: next }))}
					/>
					{spec.numbers.map((number) => (
						<Slider
							key={number.key}
							label={number.label}
							value={valueOf(number.key)}
							min={number.min}
							max={number.max}
							step={number.step}
							onChange={(value) => setValue(number.key, value)}
						/>
					))}
					{spec.anchors && (
						<Toggle
							label={spec.anchors.map((a) => a.key).join(" & ")}
							checked={anchor.on}
							hint={anchor.on ? "drag it" : "default"}
							onChange={(on) =>
								setAnchors((prev) => ({
									...prev,
									[kind]: { ...prev[kind], on },
								}))
							}
						/>
					)}
				</ControlPanel>
			</div>

			<Snippet code={code} lang="tsx" framed={false} className="mt-1" />
		</div>
	);
}
