"use client";

import { useId, type ReactNode } from "react";
import { cn } from "../cn";

export function ControlPanel({
	title,
	children,
	className,
}: {
	title?: string;
	children: ReactNode;
	className?: string;
}) {
	const titleId = useId();

	return (
		<div
			role={title ? "group" : undefined}
			aria-labelledby={title ? titleId : undefined}
			className={cn(
				"bg-white overflow-hidden rounded-xl ring ring-gray-500/10 shadow-skew",
				className,
			)}
		>
			{title && (
				<div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
					<span
						id={titleId}
						className="text-[13px] leading-[1.43] font-[550] text-gray-900"
					>
						{title}
					</span>
				</div>
			)}
			<div className="divide-y divide-gray-100">{children}</div>
		</div>
	);
}

/** A labelled group of rows, so one container can still read as sections
 * rather than nine undifferentiated rows. */
export function ControlSection({
	label,
	children,
}: {
	label: string;
	children: ReactNode;
}) {
	const labelId = useId();

	return (
		<fieldset aria-labelledby={labelId} className="min-w-0 divide-y divide-gray-100">
			<div className="px-3 py-1.5 bg-gray-50">
				<span
					id={labelId}
					className="text-[11px] leading-[1.3] font-mono font-[450] uppercase tracking-wide text-gray-500"
				>
					{label}
				</span>
			</div>
			{children}
		</fieldset>
	);
}

const LABEL = "w-20 shrink-0 text-[13px] leading-[1.43] font-[420] text-gray-500";

/**
 * One row: label on the left, control in the middle, readout on the right.
 * `htmlFor` makes the label a real <label>, so clicking it reaches the control.
 */
export function ControlRow({
	label,
	labelId,
	htmlFor,
	children,
	value,
}: {
	label: string;
	labelId?: string;
	htmlFor?: string;
	children: ReactNode;
	value?: ReactNode;
}) {
	return (
		<div className="flex items-center gap-3 py-2 pr-2 pl-3">
			{htmlFor ? (
				<label id={labelId} htmlFor={htmlFor} className={LABEL}>
					{label}
				</label>
			) : (
				<span id={labelId} className={LABEL}>
					{label}
				</span>
			)}
			<div className="flex-1 min-w-0 flex items-center">{children}</div>
			{value !== undefined && (
				<span className="w-12 shrink-0 text-right text-[12px] leading-[1.33] font-mono font-[450] text-gray-500 tabular-nums">
					{value}
				</span>
			)}
		</div>
	);
}
