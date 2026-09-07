"use client";

import { useId, type CSSProperties } from "react";
import { ControlRow } from "./ControlPanel";

export function Slider({
	label,
	value,
	min,
	max,
	step,
	unit = "",
	onChange,
}: {
	label: string;
	value: number;
	min: number;
	max: number;
	step: number;
	unit?: string;
	onChange: (value: number) => void;
}) {
	// --fill drives the track's played portion in CSS, so the styled track needs
	// no per-frame work of its own.
	const fill = ((value - min) / (max - min)) * 100;
	const labelId = useId();

	return (
		<ControlRow label={label} labelId={labelId} value={`${value}${unit}`}>
			<input
				type="range"
				min={min}
				max={max}
				step={step}
				value={value}
				aria-labelledby={labelId}
				onChange={(event) => onChange(Number(event.target.value))}
				style={{ "--fill": `${fill}%` } as CSSProperties}
				className="control-slider w-full"
			/>
		</ControlRow>
	);
}
