"use client";

import { type RefObject, useRef, useState } from "react";
import { cn } from "@ui-kit/cn";

// The rail, as fractions of the stage: a shallow smile from X0 to X1 at Y,
// dipping by SAG in the middle. A quadratic curve with its control point on
// the centre line keeps x linear in the value, so the pointer's x alone says
// where on the range it is and y just follows the bend.
const X0 = 0.22;
const X1 = 0.78;
const SAG = 0.07;
// Centred on the stage: the ends sit half the sag above the middle, the dip
// half below.
const Y = 0.5 - SAG / 2;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const railY = (t: number) => Y + 4 * SAG * t * (1 - t);

const RAIL = `M ${X0 * 100} ${Y * 100} Q 50 ${(Y + 2 * SAG) * 100} ${X1 * 100} ${Y * 100}`;

/**
 * A slider bent into an arc, for the rain's slant: left blows the rain left,
 * right blows it right, and the dip in the middle is upright.
 */
export function SlantHandle({
	box,
	value,
	min,
	max,
	step,
	label,
	onChange,
}: {
	/** The stage the rail is laid across. */
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
	const t = clamp01((value - min) / (max - min));

	function set(next: number) {
		const snapped = Math.round(next / step) * step;
		onChange(Math.min(max, Math.max(min, Number(snapped.toFixed(4)))));
	}

	function move(clientX: number) {
		const rect = box.current?.getBoundingClientRect();
		if (!rect) return;
		const along = ((clientX - rect.left) / rect.width - X0) / (X1 - X0);
		set(min + clamp01(along) * (max - min));
	}

	return (
		<>
			<svg
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 size-full text-gray-900/10"
				viewBox="0 0 100 100"
				preserveAspectRatio="none"
			>
				<path
					d={RAIL}
					fill="none"
					stroke="currentColor"
					strokeWidth="1"
					vectorEffect="non-scaling-stroke"
				/>
			</svg>
			{/* biome-ignore lint/a11y/useSemanticElements: a range input can't sit on an arc; the role carries the same value semantics. */}
			<div
				ref={ref}
				role="slider"
				tabIndex={0}
				aria-label={label}
				aria-orientation="horizontal"
				aria-valuemin={min}
				aria-valuemax={max}
				aria-valuenow={value}
				aria-valuetext={value.toFixed(2)}
				onPointerDown={(event) => {
					event.preventDefault();
					ref.current?.setPointerCapture(event.pointerId);
					setDragging(true);
					move(event.clientX);
				}}
				onPointerMove={(event) => {
					if (!dragging) return;
					move(event.clientX);
				}}
				onPointerUp={() => setDragging(false)}
				onPointerCancel={() => setDragging(false)}
				onKeyDown={(event) => {
					const by = (event.shiftKey ? 5 : 1) * step;
					switch (event.key) {
						case "ArrowLeft":
						case "ArrowDown":
							set(value - by);
							break;
						case "ArrowRight":
						case "ArrowUp":
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
				style={{
					left: `${(X0 + t * (X1 - X0)) * 100}%`,
					top: `${railY(t) * 100}%`,
				}}
				className={cn(
					"absolute z-10 size-6 -translate-x-1/2 -translate-y-1/2 touch-none rounded-full",
					// The site's white-chip treatment, the same as the anchor handle.
					"bg-white ring-1 ring-gray-500/10 shadow-md",
					"focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500/40",
					dragging ? "cursor-grabbing scale-110" : "cursor-grab",
				)}
			/>
		</>
	);
}
