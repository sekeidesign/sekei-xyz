"use client";

import { type RefObject, useRef, useState } from "react";
import { cn } from "@ui-kit/cn";
import { FOCUS_RING } from "@ui-kit/focus";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/**
 * A height picked straight off the stage, for fire's height and fluid's
 * level: a hairline at the level and a pill to drag it up and down. `value`
 * is a fraction of the stage's height, measured up from the floor.
 */
export function LevelHandle({
	box,
	value,
	min,
	max,
	step,
	label,
	onChange,
}: {
	/** The stage the fraction is measured against. */
	box: RefObject<HTMLDivElement | null>;
	value: number;
	min: number;
	max: number;
	step: number;
	label: string;
	onChange: (value: number) => void;
}) {
	const [dragging, setDragging] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const top = `${(1 - clamp01(value)) * 100}%`;

	function set(next: number) {
		const snapped = Math.round(next / step) * step;
		onChange(Math.min(max, Math.max(min, Number(snapped.toFixed(4)))));
	}

	function move(clientY: number) {
		const rect = box.current?.getBoundingClientRect();
		if (!rect) return;
		set(1 - clamp01((clientY - rect.top) / rect.height));
	}

	return (
		<>
			<span
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 h-px bg-gray-900/10"
				style={{ top }}
			/>
			{/* biome-ignore lint/a11y/useSemanticElements: a range input can't be laid over the stage; the role carries the same value semantics. */}
			<div
				ref={ref}
				role="slider"
				tabIndex={0}
				aria-label={label}
				aria-orientation="vertical"
				aria-valuemin={min}
				aria-valuemax={max}
				aria-valuenow={value}
				aria-valuetext={value.toFixed(2)}
				onPointerDown={(event) => {
					event.preventDefault();
					ref.current?.setPointerCapture(event.pointerId);
					setDragging(true);
					move(event.clientY);
				}}
				onPointerMove={(event) => {
					if (!dragging) return;
					move(event.clientY);
				}}
				onPointerUp={() => setDragging(false)}
				onPointerCancel={() => setDragging(false)}
				onKeyDown={(event) => {
					const by = (event.shiftKey ? 5 : 1) * step;
					switch (event.key) {
						case "ArrowDown":
						case "ArrowLeft":
							set(value - by);
							break;
						case "ArrowUp":
						case "ArrowRight":
							set(value + by);
							break;
						case "Home":
							set(min);
							break;
						case "End":
							set(max);
							break;
						default:
							return;
					}
					event.preventDefault();
				}}
				style={{ left: "50%", top }}
				className={cn(
					// Two units shorter and one wider than the round handles: a pill.
					"absolute z-10 h-4 w-7 -translate-x-1/2 -translate-y-1/2 touch-none rounded-full",
					"bg-white ring-1 ring-gray-500/10 shadow-md",
					FOCUS_RING,
					dragging ? "cursor-grabbing scale-110" : "cursor-grab",
				)}
			/>
		</>
	);
}
