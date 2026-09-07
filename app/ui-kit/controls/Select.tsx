"use client";

import { ControlRow } from "./ControlPanel";

export interface SelectOption {
	value: string;
	label: string;
}

export function Select({
	label,
	value,
	options,
	onChange,
}: {
	label: string;
	value: string;
	options: SelectOption[];
	onChange: (value: string) => void;
}) {
	return (
		<ControlRow label={label}>
			<select
				value={value}
				aria-label={label}
				onChange={(event) => onChange(event.target.value)}
				className="w-full cursor-pointer rounded-md bg-white px-2 py-1 text-[13px] leading-[1.43] font-[420] text-gray-900 ring ring-gray-500/15 shadow-skew focus:outline-none focus:ring-gray-500/40"
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</ControlRow>
	);
}
