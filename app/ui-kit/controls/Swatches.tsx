"use client";

import { useId } from "react";
import { ControlRow } from "./ControlPanel";

export function Swatches({
	label,
	values,
	names,
	onChange,
}: {
	label: string;
	values: string[];
	/** One per value: the slot's name, which is both its key and its label. */
	names: string[];
	onChange: (values: string[]) => void;
}) {
	const id = useId();

	return (
		<ControlRow label={label}>
			<div className="flex items-center gap-1.5">
				{values.map((value, index) => (
					<span
						key={`${id}:${names[index]}`}
						className="relative size-6 overflow-hidden rounded-md bg-white ring ring-gray-500/15 shadow-skew"
						style={{ backgroundColor: value }}
					>
						<input
							type="color"
							value={value}
							aria-label={names[index]}
							onChange={(event) => {
								const next = values.slice();
								next[index] = event.target.value;
								onChange(next);
							}}
							className="absolute -inset-2 size-[200%] cursor-pointer opacity-0"
						/>
					</span>
				))}
			</div>
		</ControlRow>
	);
}
