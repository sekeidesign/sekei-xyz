"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DitherCanvas } from "@/components/dither-fx";
import { cn } from "@ui-kit/cn";
import { ControlPanel, ControlSection } from "@ui-kit/controls/ControlPanel";
import { Select } from "@ui-kit/controls/Select";
import { Slider } from "@ui-kit/controls/Slider";
import { Swatches } from "@ui-kit/controls/Swatches";
import { Toggle } from "@ui-kit/controls/Toggle";
import { SURFACE_INNER, SURFACE_OUTER } from "@ui-kit/post/surface";
import { AnchorHandle } from "./AnchorHandle";
import { EffectTabs } from "./EffectTabs";
import {
	type Anchor,
	build,
	DEFAULTS,
	type Kind,
	KINDS,
	snippet,
	SPECS,
} from "./playground-config";
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

type Anchors = Record<Kind, { on: boolean; x: number; y: number }>;

const initialAnchors = () =>
	Object.fromEntries(
		KINDS.map((kind) => {
			const at = SPECS[kind].anchor?.at ?? [0.5, 0.5];
			return [kind, { on: true, x: at[0], y: at[1] }];
		}),
	) as Anchors;

const initialColors = () =>
	Object.fromEntries(KINDS.map((kind) => [kind, SPECS[kind].colors])) as Record<
		Kind,
		string[]
	>;

export function Playground() {
	const [kind, setKind] = useState<Kind>("fire");
	const [surface, setSurface] = useState("light");
	const [cell, setCell] = useState(3);
	const [seed, setSeed] = useState(1);
	const [active, setActive] = useState(true);

	// Per effect, so leaving fire for rings and coming back finds fire as it was.
	const [values, setValues] = useState(() => ({ ...DEFAULTS }));
	const [colors, setColors] = useState(initialColors);
	const [anchors, setAnchors] = useState(initialAnchors);

	const spec = SPECS[kind];
	const anchor = anchors[kind];
	const stage = useRef<HTMLDivElement>(null);

	// A ref, not a dependency: a new `effect` reference restarts the simulation,
	// so a dependency here would rebuild it on every pointer move.
	const at = useRef<Anchor>([anchor.x, anchor.y]);
	useEffect(() => {
		at.current = [anchor.x, anchor.y];
	}, [anchor.x, anchor.y]);
	const getAnchor = useCallback(() => at.current, []);

	const effect = useMemo(
		() =>
			build(
				kind,
				values[kind],
				colors[kind],
				spec.anchor && anchor.on ? getAnchor : undefined,
			),
		[kind, values, colors, spec.anchor, anchor.on, getAnchor],
	);

	const code = snippet(kind, values[kind], colors[kind], anchor, {
		cell,
		seed,
		active,
	});

	const setValue = (key: string, value: number) =>
		setValues((prev) => ({ ...prev, [kind]: { ...prev[kind], [key]: value } }));

	return (
		<div className={cn("rounded-xl", SURFACE_OUTER)}>
			<div className="px-1 py-1.5">
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
					{spec.anchor && anchor.on && (
						<AnchorHandle
							box={stage}
							x={anchor.x}
							y={anchor.y}
							axis={spec.anchor.axis}
							label={`Drag to move the ${kind} ${spec.anchor.key}`}
							onChange={(x, y) =>
								setAnchors((prev) => ({ ...prev, [kind]: { on: true, x, y } }))
							}
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
							value={values[kind][number.key]}
							min={number.min}
							max={number.max}
							step={number.step}
							onChange={(value) => setValue(number.key, value)}
						/>
					))}
					{spec.anchor && (
						<Toggle
							label={spec.anchor.key}
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

			<Snippet code={code} lang="tsx" className="mt-1 rounded-lg" />
		</div>
	);
}
