"use client";

import { type RefObject, useRef, useState } from "react";
import { cn } from "@ui-kit/cn";

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
	label,
	onChange,
}: {
	/** The stage the fractions are measured against. */
	box: RefObject<HTMLDivElement | null>;
	x: number;
	y: number;
	/** Beam only reads the column, so its handle stays on one rail. */
	axis: "x" | "xy";
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
		<>
			{axis === "x" && (
				<span
					aria-hidden="true"
					className="pointer-events-none absolute inset-y-0 w-px bg-gray-900/10"
					style={{ left: `${x * 100}%` }}
				/>
			)}
			<button
				ref={ref}
				type="button"
				aria-label={label}
				// Two values, which no single ARIA role covers; the arrow keys below
				// are what makes it reachable without a pointer.
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
				style={{ left: `${x * 100}%`, top: `${(axis === "x" ? 0.5 : y) * 100}%` }}
				className={cn(
					"absolute z-10 size-6 -translate-x-1/2 -translate-y-1/2 touch-none rounded-full",
					// The site's white-chip treatment, the same as every other control.
					"bg-white ring-1 ring-gray-500/10 shadow-md",
					"focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500/40",
					dragging ? "cursor-grabbing scale-110" : "cursor-grab",
				)}
			/>
		</>
	);
}
