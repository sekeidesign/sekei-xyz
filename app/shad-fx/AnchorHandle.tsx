"use client";

import { type RefObject, useRef, useState } from "react";
import { cn } from "@ui-kit/cn";
import { FOCUS_RING } from "@ui-kit/focus";

const clamp = (value: number) => Math.min(1, Math.max(0, value));

const NUDGE: Record<string, [number, number]> = {
	ArrowLeft: [-1, 0],
	ArrowRight: [1, 0],
	ArrowUp: [0, -1],
	ArrowDown: [0, 1],
};

export function AnchorHandle({
	box,
	x,
	y,
	axis,
	row = 0.5,
	shape = "round",
	label,
	onChange,
}: {
	/** The stage the fractions are measured against. */
	box: RefObject<HTMLDivElement | null>;
	x: number;
	y: number;
	/** Beam only reads the column, so its knob stays on one row. */
	axis: "x" | "xy";
	/** The row an x-only knob sits on, as a fraction of the height. */
	row?: number;
	/** A tall pill marks a knob that moves something else along, not a point. */
	shape?: "round" | "tall";
	label: string;
	onChange: (x: number, y: number) => void;
}) {
	const [dragging, setDragging] = useState(false);
	const ref = useRef<HTMLButtonElement>(null);

	function move(clientX: number, clientY: number) {
		const rect = box.current?.getBoundingClientRect();
		if (!rect) return;
		onChange(
			clamp((clientX - rect.left) / rect.width),
			axis === "x" ? y : clamp((clientY - rect.top) / rect.height),
		);
	}

	return (
		<button
			ref={ref}
			type="button"
			// Two values, which no single ARIA role covers, so the label carries
			// them; the arrow keys below make it reachable without a pointer.
			aria-label={
				axis === "x"
					? `${label}: ${x.toFixed(2)}`
					: `${label}: ${x.toFixed(2)}, ${y.toFixed(2)}`
			}
			onPointerDown={(event) => {
				event.preventDefault();
				ref.current?.setPointerCapture(event.pointerId);
				setDragging(true);
				move(event.clientX, event.clientY);
			}}
			onPointerMove={(event) => {
				if (!dragging) return;
				move(event.clientX, event.clientY);
			}}
			onPointerUp={() => setDragging(false)}
			onPointerCancel={() => setDragging(false)}
			onKeyDown={(event) => {
				const step = NUDGE[event.key];
				if (!step) return;
				event.preventDefault();
				const by = event.shiftKey ? 0.1 : 0.02;
				onChange(
					clamp(x + step[0] * by),
					axis === "x" ? y : clamp(y + step[1] * by),
				);
			}}
			style={{ left: `${x * 100}%`, top: `${(axis === "x" ? row : y) * 100}%` }}
			className={cn(
				"absolute z-10 -translate-x-1/2 -translate-y-1/2 touch-none rounded-full",
				shape === "tall" ? "h-7 w-4" : "size-6",
				// The site's white-chip treatment, the same as every other control.
				"bg-white ring-1 ring-gray-500/10 shadow-md",
				FOCUS_RING,
				dragging ? "cursor-grabbing scale-110" : "cursor-grab",
			)}
		/>
	);
}
