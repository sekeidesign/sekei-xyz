"use client";

import { useState } from "react";
import { ControlPanel, ControlSection } from "@ui-kit/controls/ControlPanel";
import { Select } from "@ui-kit/controls/Select";
import { Slider } from "@ui-kit/controls/Slider";
import { Swatches } from "@ui-kit/controls/Swatches";
import { TextAreaField, TextField } from "@ui-kit/controls/TextField";
import { Toggle } from "@ui-kit/controls/Toggle";

const PATTERNS = [
	{ value: "bayer", label: "Bayer 4×4" },
	{ value: "noise", label: "Blue noise" },
	{ value: "lines", label: "Lines" },
];

function Frame({ children }: { children: React.ReactNode }) {
	return <div className="w-full max-w-sm">{children}</div>;
}

export function FullPanel() {
	const [scale, setScale] = useState(4);
	const [animate, setAnimate] = useState(true);
	const [pattern, setPattern] = useState("bayer");
	const [colors, setColors] = useState(["#111827", "#f3f4f6"]);
	const [label, setLabel] = useState("Dither");

	return (
		<Frame>
			<ControlPanel title="Playground">
				<ControlSection label="Shape">
					<Slider label="Scale" value={scale} min={1} max={12} step={1} unit="px" onChange={setScale} />
					<Select label="Pattern" value={pattern} options={PATTERNS} onChange={setPattern} />
				</ControlSection>
				<ControlSection label="Look">
					<Swatches label="Colors" values={colors} names={["Ink", "Paper"]} onChange={setColors} />
					<Toggle label="Animate" checked={animate} onChange={setAnimate} />
					<TextField label="Label" value={label} onChange={setLabel} />
				</ControlSection>
			</ControlPanel>
		</Frame>
	);
}

export function SliderDemo() {
	const [value, setValue] = useState(62);
	return (
		<Frame>
			<ControlPanel>
				<Slider label="Opacity" value={value} min={0} max={100} step={1} unit="%" onChange={setValue} />
			</ControlPanel>
		</Frame>
	);
}

export function ToggleDemo() {
	const [on, setOn] = useState(true);
	const [reduced, setReduced] = useState(false);
	return (
		<Frame>
			<ControlPanel>
				<Toggle label="Animate" checked={on} onChange={setOn} />
				<Toggle label="Reduce" checked={reduced} hint="Respects the OS" onChange={setReduced} />
			</ControlPanel>
		</Frame>
	);
}

export function SelectDemo() {
	const [value, setValue] = useState("noise");
	return (
		<Frame>
			<ControlPanel>
				<Select label="Pattern" value={value} options={PATTERNS} onChange={setValue} />
			</ControlPanel>
		</Frame>
	);
}

export function TextFieldDemo() {
	const [value, setValue] = useState("");
	return (
		<Frame>
			<ControlPanel>
				<TextField label="Title" value={value} placeholder="Untitled" onChange={setValue} />
			</ControlPanel>
		</Frame>
	);
}

export function TextAreaDemo() {
	const [value, setValue] = useState(
		"The best interface is the one you stop noticing.",
	);
	return (
		<Frame>
			<ControlPanel>
				<TextAreaField label="Quote" value={value} rows={3} onChange={setValue} />
			</ControlPanel>
		</Frame>
	);
}

export function SliderSteps() {
	const [value, setValue] = useState(4);
	return (
		<Frame>
			<ControlPanel>
				<Slider label="Columns" value={value} min={1} max={12} step={1} showSteps onChange={setValue} />
			</ControlPanel>
		</Frame>
	);
}

export function SwatchesDemo() {
	const [colors, setColors] = useState(["#111827", "#6b7280", "#f3f4f6"]);
	return (
		<Frame>
			<ControlPanel>
				<Swatches label="Palette" values={colors} names={["Ink", "Mid", "Paper"]} onChange={setColors} />
			</ControlPanel>
		</Frame>
	);
}

export function PanelThumb() {
	const [value, setValue] = useState(4);
	const [on, setOn] = useState(true);
	return (
		<div className="w-64">
			<ControlPanel title="Playground">
				<Slider label="Scale" value={value} min={1} max={12} step={1} unit="px" onChange={setValue} />
				<Toggle label="Animate" checked={on} onChange={setOn} />
			</ControlPanel>
		</div>
	);
}
