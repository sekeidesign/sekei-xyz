"use client";

import { m } from "motion/react";
import { useState } from "react";
import { cn } from "../cn";
import { SURFACE_INNER, SURFACE_OUTER } from "../post/surface";
import { ProgressDial } from "./StatusDial";

/** Where the named statuses fall on the dial, for the scale under the track. */
const MARKS = [0, 0.25, 0.5, 0.75, 1];

/**
 * Nothing yet, work under way, and done. Hex rather than a class so the change
 * between them is a colour motion can cross, not a swap.
 */
const tone = (fraction: number) =>
	fraction === 0 ? "#d1d5dc" : fraction === 1 ? "#2b7fff" : "#ffb900";

export function ProgressDemo() {
	const [fraction, setFraction] = useState(0.3);

	return (
		<div className={cn("my-6 w-full cursor-default rounded-xl", SURFACE_OUTER)}>
			<div
				className={cn(
					"flex flex-col items-center gap-8 rounded-lg px-6 py-10",
					SURFACE_INNER,
					"bg-gray-50",
				)}
			>
				<span className="font-mono text-xs text-gray-400 tabular-nums">
					Value {fraction.toFixed(2)}
				</span>

				<m.div
					animate={{ color: tone(fraction) }}
					transition={{ duration: 0.25 }}
					className="flex"
				>
					<ProgressDial
						fraction={fraction}
						dashed
						mark={fraction === 1 ? "tick" : undefined}
						size={96}
					/>
				</m.div>

				<div className="flex w-full max-w-80 flex-col gap-3">
					<label className="relative flex h-6 items-center">
						<span className="absolute inset-x-0 h-1.5 rounded-full bg-gray-500/15" />
						<m.span
							style={{ width: `${fraction * 100}%` }}
							animate={{ backgroundColor: tone(fraction) }}
							transition={{ duration: 0.25 }}
							className="absolute h-1.5 rounded-full"
						/>
						<span
							style={{ left: `${fraction * 100}%` }}
							className="pointer-events-none absolute size-5 -translate-x-1/2 rounded-full bg-white ring-1 ring-gray-500/20 shadow-skew"
						/>
						<input
							type="range"
							min={0}
							max={1}
							step={0.01}
							value={fraction}
							onChange={(event) => setFraction(Number(event.target.value))}
							aria-label="Fraction complete"
							className="absolute inset-0 w-full cursor-grab opacity-0 active:cursor-grabbing"
						/>
					</label>
					<div className="flex justify-between font-mono text-xs text-gray-400 tabular-nums">
						{MARKS.map((at) => (
							<span key={at}>{at.toFixed(2)}</span>
						))}
					</div>
				</div>

			</div>
		</div>
	);
}
