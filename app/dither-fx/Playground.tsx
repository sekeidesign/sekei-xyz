"use client";

import { useMemo, useState } from "react";
import {
	beam,
	bolt,
	DitherCanvas,
	type DitherEffect,
	fire,
	fluid,
	rings,
} from "@/components/dither-fx";
import { cn } from "@ui-kit/cn";
import { ControlPanel } from "@ui-kit/controls/ControlPanel";
import { Select } from "@ui-kit/controls/Select";
import { Slider } from "@ui-kit/controls/Slider";
import { Toggle } from "@ui-kit/controls/Toggle";
import { Snippet } from "./Snippet";

const BUILDERS: Record<string, () => DitherEffect> = {
	fire,
	bolt,
	rings,
	fluid,
	beam,
};

const EFFECTS = Object.keys(BUILDERS).map((value) => ({ value, label: value }));

const SURFACES = [
	{ value: "dark", label: "Dark" },
	{ value: "light", label: "Light" },
];

export function Playground() {
	const [kind, setKind] = useState("fire");
	const [surface, setSurface] = useState("dark");
	const [cell, setCell] = useState(3);
	const [seed, setSeed] = useState(1);
	const [active, setActive] = useState(true);

	// Rebuilt only when the effect changes, so the canvas and its observer
	// survive every other control.
	const effect = useMemo(() => BUILDERS[kind](), [kind]);

	const code = [
		"<DitherCanvas",
		`  effect={${kind}Effect}`,
		active ? null : "  active={false}",
		cell === 3 ? null : `  cell={${cell}}`,
		seed === 1 ? null : `  seed={${seed}}`,
		"/>",
	]
		.filter(Boolean)
		.join("\n");

	return (
		<div className="flex flex-col gap-4 lg:flex-row">
			<div
				className={cn(
					"relative min-h-70 flex-1 overflow-hidden rounded-xl ring ring-gray-500/10",
					surface === "dark" ? "bg-gray-900" : "bg-gray-50",
				)}
			>
				<DitherCanvas effect={effect} active={active} cell={cell} seed={seed} />
			</div>

			<div className="flex w-full shrink-0 flex-col gap-3 lg:max-w-xs">
				<ControlPanel title="DitherCanvas">
					<Select
						label="effect"
						value={kind}
						options={EFFECTS}
						onChange={setKind}
					/>
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
				</ControlPanel>

				<Snippet code={code} />
			</div>
		</div>
	);
}
