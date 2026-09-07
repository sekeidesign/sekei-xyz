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
			// A named group rather than a heading: these are controls, not a
			// section of the document.
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

/** A group heading inside the panel, so one container can still read as
 * sections rather than nine undifferentiated rows. */
export function ControlSection({ label }: { label: string }) {
	return (
		<div className="px-3 py-1.5 bg-gray-50">
			<span className="text-[11px] leading-[1.3] font-mono font-[450] uppercase tracking-wide text-gray-400">
				{label}
			</span>
		</div>
	);
}

/** One row: label on the left, control in the middle, readout on the right. */
export function ControlRow({
	label,
	labelId,
	children,
	value,
}: {
	label: string;
	/** From the control inside, which points its `aria-labelledby` back here —
	 * so the row's own text names it instead of a repeated `aria-label`. */
	labelId?: string;
	children: ReactNode;
	value?: ReactNode;
}) {
	return (
		<div className="flex items-center gap-3 px-3 py-2">
			<span
				id={labelId}
				className="w-20 shrink-0 text-[13px] leading-[1.43] font-[420] text-gray-500"
			>
				{label}
			</span>
			<div className="flex-1 min-w-0 flex items-center">{children}</div>
			{value !== undefined && (
				<span className="w-12 shrink-0 text-right text-[12px] leading-[1.33] font-mono font-[450] text-gray-400 tabular-nums">
					{value}
				</span>
			)}
		</div>
	);
}
