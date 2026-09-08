"use client";

import { useMemo, useState } from "react";
import { ControlPanel, ControlSection } from "@ui-kit/controls/ControlPanel";
import { Select } from "@ui-kit/controls/Select";
import { Slider } from "@ui-kit/controls/Slider";
import type { BloomInput } from "@ui-kit/dither/bloom";
import { RaidTypes, type RaidTypesTweaks } from "@ui-kit/figures/RaidTypes";

const ACTIVE = [
	{ value: "hover", label: "On hover" },
	{ value: "all", label: "All running" },
	{ value: "risk", label: "Risks only" },
	{ value: "action", label: "Actions only" },
	{ value: "issue", label: "Issues only" },
	{ value: "decision", label: "Decisions only" },
];

const BLOOMS = [
	{ value: "soft", label: "Soft (light theme)" },
	{ value: "glow", label: "Glow (additive)" },
	{ value: "aura", label: "Aura" },
	{ value: "off", label: "Off" },
];

const DECISION = [
	{ value: "fluid", label: "Fluid" },
	{ value: "beam", label: "Beam" },
];

export function DitherStudio() {
	const [cell, setCell] = useState(2);
	const [bloom, setBloom] = useState<BloomInput>("soft");
	const [active, setActive] = useState<RaidTypesTweaks["active"]>("hover");
	const [decision, setDecision] = useState<"fluid" | "beam">("fluid");

	const [fireHeight, setFireHeight] = useState(0.5);
	const [fireRate, setFireRate] = useState(36);
	const [embers, setEmbers] = useState(8);

	const [boltMin, setBoltMin] = useState(0.6);
	const [boltMax, setBoltMax] = useState(1.4);

	const [ringInterval, setRingInterval] = useState(1.15);
	const [ringSpeed, setRingSpeed] = useState(0.45);
	const [ringWidth, setRingWidth] = useState(2.6);

	const [level, setLevel] = useState(0.2);
	const [slosh, setSlosh] = useState(0.09);
	const [tempo, setTempo] = useState(0.15);
	const [bubbles, setBubbles] = useState(12);

	const [spread, setSpread] = useState(0.5);
	const [motes, setMotes] = useState(16);

	// One object per distinct set of values: RaidTypes rebuilds its effects when
	// the reference changes, so a slider tick restarts only what it touched.
	const tweaks = useMemo<RaidTypesTweaks>(
		() => ({
			cell,
			bloom,
			active,
			decision,
			fire: { height: fireHeight, rate: fireRate, embers },
			bolt: { interval: [Math.min(boltMin, boltMax), Math.max(boltMin, boltMax)] },
			rings: { interval: ringInterval, speed: ringSpeed, width: ringWidth },
			fluid: { level, slosh, tempo, bubbles },
			beam: { spread, motes },
		}),
		[
			cell,
			bloom,
			active,
			decision,
			fireHeight,
			fireRate,
			embers,
			boltMin,
			boltMax,
			ringInterval,
			ringSpeed,
			ringWidth,
			level,
			slosh,
			tempo,
			bubbles,
			spread,
			motes,
		],
	);

	return (
		<div className="flex flex-col gap-6">
			<RaidTypes tweaks={tweaks} />
			<div className="grid gap-4 md:grid-cols-2">
				<ControlPanel title="Canvas">
					<Slider label="Cell" value={cell} min={1} max={8} step={1} unit="px" onChange={setCell} />
					<Select
						label="Bloom"
						value={typeof bloom === "string" ? bloom : "soft"}
						options={BLOOMS}
						onChange={(value) => setBloom(value as BloomInput)}
					/>
					<Select
						label="Run"
						value={active ?? "hover"}
						options={ACTIVE}
						onChange={(value) => setActive(value as RaidTypesTweaks["active"])}
					/>
					<Select
						label="Decisions"
						value={decision}
						options={DECISION}
						onChange={(value) => setDecision(value as "fluid" | "beam")}
					/>
				</ControlPanel>
				<ControlPanel title="Risks · fire">
					<Slider label="Height" value={fireHeight} min={0.2} max={1} step={0.05} onChange={setFireHeight} />
					<Slider label="Rate" value={fireRate} min={8} max={60} step={1} unit="hz" onChange={setFireRate} />
					<Slider label="Embers" value={embers} min={0} max={24} step={1} onChange={setEmbers} />
				</ControlPanel>
				<ControlPanel title="Actions · bolt">
					<Slider label="Gap min" value={boltMin} min={0.1} max={3} step={0.1} unit="s" onChange={setBoltMin} />
					<Slider label="Gap max" value={boltMax} min={0.1} max={3} step={0.1} unit="s" onChange={setBoltMax} />
				</ControlPanel>
				<ControlPanel title="Issues · rings">
					<Slider label="Interval" value={ringInterval} min={0.2} max={2.5} step={0.05} unit="s" onChange={setRingInterval} />
					<Slider label="Speed" value={ringSpeed} min={0.1} max={1.5} step={0.05} onChange={setRingSpeed} />
					<Slider label="Width" value={ringWidth} min={0.6} max={5} step={0.2} onChange={setRingWidth} />
				</ControlPanel>
				<ControlPanel title="Decisions">
					<ControlSection label="fluid" />
					<Slider label="Level" value={level} min={0.05} max={0.8} step={0.05} onChange={setLevel} />
					<Slider label="Slosh" value={slosh} min={0} max={0.4} step={0.01} onChange={setSlosh} />
					<Slider label="Tempo" value={tempo} min={0.05} max={1.5} step={0.05} unit="hz" onChange={setTempo} />
					<Slider label="Bubbles" value={bubbles} min={0} max={20} step={1} onChange={setBubbles} />
					<ControlSection label="beam" />
					<Slider label="Spread" value={spread} min={0.1} max={1} step={0.05} onChange={setSpread} />
					<Slider label="Motes" value={motes} min={0} max={40} step={1} onChange={setMotes} />
				</ControlPanel>
				<ControlPanel title="Values">
					<pre className="overflow-x-auto px-3 py-2 font-mono text-[12px] leading-[1.5] text-gray-600">
						{JSON.stringify(tweaks, null, 2)}
					</pre>
				</ControlPanel>
			</div>
		</div>
	);
}
