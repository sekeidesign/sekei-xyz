"use client";

import { useId } from "react";
import { ControlRow } from "./ControlPanel";

const FIELD =
	"w-full rounded-md bg-white px-2 py-1 text-[13px] leading-[1.43] font-[420] text-gray-900 ring ring-gray-500/15 shadow-skew placeholder:text-gray-400 focus:outline-none focus:ring-gray-500/40";

export function TextField({
	label,
	value,
	placeholder,
	onChange,
}: {
	label: string;
	value: string;
	placeholder?: string;
	onChange: (value: string) => void;
}) {
	const labelId = useId();

	return (
		<ControlRow label={label} labelId={labelId}>
			<input
				type="text"
				value={value}
				placeholder={placeholder}
				aria-labelledby={labelId}
				onChange={(event) => onChange(event.target.value)}
				className={FIELD}
			/>
		</ControlRow>
	);
}

export function TextAreaField({
	label,
	value,
	rows = 5,
	placeholder,
	onChange,
	ref,
}: {
	label: string;
	value: string;
	rows?: number;
	placeholder?: string;
	onChange: (value: string) => void;
	ref?: React.Ref<HTMLTextAreaElement>;
}) {
	const labelId = useId();

	return (
		<ControlRow label={label} labelId={labelId}>
			<textarea
				ref={ref}
				value={value}
				rows={rows}
				placeholder={placeholder}
				aria-labelledby={labelId}
				onChange={(event) => onChange(event.target.value)}
				className={`${FIELD} resize-y leading-[1.6]`}
			/>
		</ControlRow>
	);
}
