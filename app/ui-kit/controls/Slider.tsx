"use client";

import {
	useCallback,
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useState,
	type CSSProperties,
} from "react";
import { m, type Transition } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "../cn";
import { ControlRow } from "./ControlPanel";

/** Half the input's thumb, which the fill and handle are laid out against. */
const THUMB_HALF = 6;
/** Clearance around the value before the handle has to step around it. */
const CLEARANCE = 4;

/** Each dot carries 1px past where it settles as the halves split, then springs back. */
const POP: Transition = { duration: 0.42, times: [0, 0.4, 0.7, 1], ease: "easeOut" };

// Always fully rounded, and 13px each against a 22px handle: the 4px overlap
// is the bar's own width, which is what it takes to bury both round caps.
const HALF =
	"absolute inset-x-0 rounded-full bg-gray-300 transition-[height] duration-150 ease-out group-hover:bg-gray-400 group-has-[:active]:bg-gray-500";

export function Slider({
	label,
	value,
	min,
	max,
	step,
	unit = "",
	showSteps = false,
	onChange,
}: {
	label: string;
	value: number;
	min: number;
	max: number;
	step: number;
	unit?: string;
	/** Draws a tick at every step, bar the two ends and any behind the value. */
	showSteps?: boolean;
	onChange: (value: number) => void;
}) {
	// --f drives the fill and the handle in CSS, so dragging does no per-frame
	// layout work of its own. Both are laid out against the input's 12px thumb,
	// which travels 100% - 12px, so the drawn handle stays under the pointer.
	const fraction = (value - min) / (max - min);
	const labelId = useId();
	const trackRef = useRef<HTMLDivElement>(null);
	const valueRef = useRef<HTMLSpanElement>(null);
	const [split, setSplit] = useState(false);
	// The value's span along the thumb's travel, as fractions, so ticks behind it
	// can be left out.
	const [cover, setCover] = useState<[number, number]>([0, 0]);
	const reduced = usePrefersReducedMotion();
	const pop = (direction: 1 | -1) =>
		split && !reduced ? { y: [0, direction, -0.25 * direction, 0] } : { y: 0 };

	// Where the handle sits against the value is only known after layout, so
	// it is measured rather than derived. Setting the same boolean bails out, so
	// this settles in one pass.
	const measure = useCallback(() => {
		const track = trackRef.current;
		const text = valueRef.current;
		if (!track || !text) return;
		const box = track.getBoundingClientRect();
		const travel = box.width - THUMB_HALF * 2;
		const at = (px: number) => (px - box.left - THUMB_HALF) / travel;
		const rect = text.getBoundingClientRect();
		const from = at(rect.left - CLEARANCE);
		const to = at(rect.right + CLEARANCE);
		const f = Number(track.style.getPropertyValue("--f"));
		setSplit(f > from && f < to);
		setCover((prev) => (prev[0] === from && prev[1] === to ? prev : [from, to]));
	}, []);

	useLayoutEffect(measure);

	useEffect(() => {
		const track = trackRef.current;
		if (!track) return;
		const observer = new ResizeObserver(measure);
		observer.observe(track);
		return () => observer.disconnect();
	}, [measure]);

	return (
		<ControlRow label={label} labelId={labelId}>
			<div
				ref={trackRef}
				style={{ "--f": fraction } as CSSProperties}
				className="group relative h-7 w-full overflow-hidden rounded-md bg-white ring ring-gray-500/15 shadow-skew has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent"
			>
				<span className="absolute inset-y-0 left-0 w-[calc(12px+(100%-12px)*var(--f))] rounded-md bg-gray-100 ring ring-gray-200" />
				{showSteps &&
					stepFractions(min, max, step)
						.filter((t) => t < cover[0] || t > cover[1])
						.map((t) => (
							<span
								key={t}
								aria-hidden="true"
								style={{ "--t": t } as CSSProperties}
								className="absolute top-1/2 left-[calc(6px+(100%-12px)*var(--t))] h-2.5 w-px -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-500/20"
							/>
						))}
				<span
					aria-hidden="true"
					className="absolute inset-y-0 left-[calc(6px+(100%-12px)*var(--f))] w-1 -translate-x-1/2"
				>
					<m.span
						initial={false}
						animate={pop(-1)}
						transition={POP}
						className={cn(HALF, "top-[3px]", split ? "h-1" : "h-[13px]")}
					/>
					<m.span
						initial={false}
						animate={pop(1)}
						transition={POP}
						className={cn(HALF, "bottom-[3px]", split ? "h-1" : "h-[13px]")}
					/>
				</span>
				<span
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-[12px] leading-none font-[450] tabular-nums"
				>
					<span ref={valueRef} className="text-gray-900">
						{value}
						{unit}
					</span>
				</span>
				<input
					type="range"
					min={min}
					max={max}
					step={step}
					value={value}
					aria-labelledby={labelId}
					aria-valuetext={`${value}${unit}`}
					onChange={(event) => onChange(Number(event.target.value))}
					className="control-slider-hit absolute inset-0 size-full"
				/>
			</div>
		</ControlRow>
	);
}

/** Every step between the ends, as a fraction of the range. */
function stepFractions(min: number, max: number, step: number) {
	const count = Math.round((max - min) / step);
	return Array.from({ length: Math.max(count - 1, 0) }, (_, index) => (index + 1) / count);
}
