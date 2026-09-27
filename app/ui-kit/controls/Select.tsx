"use client";

import { useId } from "react";
import { ChevronDownIcon } from "../icons/ChevronDownIcon";
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
	const labelId = useId();

	return (
		<ControlRow label={label} labelId={labelId}>
			<div className="relative w-full">
				<select
					value={value}
					aria-labelledby={labelId}
					onChange={(event) => onChange(event.target.value)}
					className="w-full cursor-pointer appearance-none rounded-md bg-white py-1 pr-7 pl-2 text-[13px] leading-[1.43] font-[420] text-gray-900 ring ring-gray-500/15 shadow-skew focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
				>
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
				<ChevronDownIcon
					size={14}
					className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-gray-400"
				/>
			</div>
		</ControlRow>
	);
}
