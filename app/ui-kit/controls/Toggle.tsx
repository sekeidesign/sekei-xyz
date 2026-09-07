"use client";

import { useId } from "react";
import { cn } from "../cn";
import { ControlRow } from "./ControlPanel";

export function Toggle({
	label,
	checked,
	hint,
	onChange,
}: {
	label: string;
	checked: boolean;
	hint?: string;
	onChange: (checked: boolean) => void;
}) {
	const labelId = useId();

	return (
		<ControlRow label={label} labelId={labelId} value={checked ? "on" : "off"}>
			<button
				type="button"
				role="switch"
				aria-checked={checked}
				aria-labelledby={labelId}
				onClick={() => onChange(!checked)}
				className={cn(
					"relative h-5 w-9 shrink-0 rounded-full ring-1 ring-gray-500/10 shadow-skew cursor-pointer",
					checked ? "bg-gray-900" : "bg-gray-200",
				)}
			>
				<span
					className={cn(
						"absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-[left] duration-150 ease-out",
						checked ? "left-[18px]" : "left-0.5",
					)}
				/>
			</button>
			{hint && (
				<span className="ml-3 text-[12px] leading-[1.33] font-[420] text-gray-400">
					{hint}
				</span>
			)}
		</ControlRow>
	);
}
