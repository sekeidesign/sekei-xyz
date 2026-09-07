"use client";

import { useInView } from "motion/react";
import { type CSSProperties, useRef } from "react";
import { cn } from "../cn";
import { KIND, type RaidRow, ROWS } from "./raid-log";

/** Both variants draw at the design's own sizes and crop, never scale. */

const CARD = {
	"--raid-inset": "0px",
	"--raid-width": "400px",
	"--raid-height": "auto",
	"--raid-radius": "0px",
	"--raid-header": "32px",
	"--raid-pad": "10px",
	"--raid-gap": "8px",
	"--raid-icon": "16px",
	"--raid-id": "64px",
	"--raid-title": "300px",
	"--raid-date": "72px",
	"--raid-impact": "72px",
	"--raid-text": "12px",
	"--raid-line": "16px",
	"--raid-chip": "8px",
	"--raid-pill": "56px",
	"--raid-cell": "2px",
} as CSSProperties;

/** 100% sizing under an inset overhangs the box by that inset, at any width. */
const PAGE = {
	"--raid-inset": "40px",
	"--raid-width": "100%",
	"--raid-height": "100%",
	"--raid-radius": "12px",
	"--raid-header": "32px",
	"--raid-pad": "12px",
	"--raid-gap": "8px",
	"--raid-icon": "20px",
	"--raid-id": "64px",
	"--raid-title": "300px",
	"--raid-date": "72px",
	"--raid-impact": "72px",
	"--raid-text": "14px",
	"--raid-line": "18px",
	"--raid-chip": "8px",
	"--raid-pill": "56px",
	"--raid-cell": "2px",
	"--dot-color": "var(--color-gray-200)",
	"--dot-gap": "14px",
	"--dot-size": "0.75px",
} as CSSProperties;

export function RaidLogCover({
	variant = "card",
}: {
	variant?: "card" | "page";
}) {
	const ref = useRef<HTMLDivElement>(null);
	// Both loops run forever, and the feed would otherwise run one per card.
	const inView = useInView(ref, { amount: 0.3 });
	const page = variant === "page";

	return (
		<div
			ref={ref}
			style={page ? PAGE : CARD}
			className={cn(
				"relative size-full overflow-hidden bg-gray-50",
				page && "dot-matrix",
				inView && "raid-live",
			)}
		>
			<div
				className={cn(
					"absolute left-[var(--raid-inset)] top-[var(--raid-inset)] flex h-[var(--raid-height)] w-[var(--raid-width)] flex-col overflow-hidden rounded-[var(--raid-radius)] bg-white",
					page && "ring-1 ring-gray-400/15 shadow-2xl",
				)}
			>
				<Chrome />
				{ROWS.map((row, index) => (
					<Line key={row.id} row={row} shaded={index % 2 === 1} />
				))}
			</div>
		</div>
	);
}

/**
 * Each bar sits in a box of its column's width. Laid out against each other
 * instead, the lanes come up short and the rows below read as misaligned.
 */
function Chrome() {
	return (
		<>
			<div className="flex h-[var(--raid-header)] shrink-0 items-center gap-[var(--raid-gap)] bg-gray-500/10 px-[var(--raid-pad)]">
				<div className="flex size-[var(--raid-icon)] shrink-0 items-center justify-center">
					<Bar round />
				</div>
				<div className="flex h-[var(--raid-line)] w-[var(--raid-id)] shrink-0 items-center">
					<Bar />
				</div>
				<div className="flex h-[var(--raid-line)] w-[var(--raid-title)] shrink-0 items-center">
					<Bar />
				</div>
				<div className="flex h-[var(--raid-line)] w-[var(--raid-date)] shrink-0 items-center">
					<Bar />
				</div>
				<div className="flex h-[var(--raid-line)] w-[var(--raid-impact)] shrink-0 items-center">
					<Bar />
				</div>
			</div>
			<Divider />
		</>
	);
}

function Bar({ round }: { round?: boolean }) {
	return (
		<div
			className={cn(
				"h-[var(--raid-chip)] rounded-full bg-gray-500/15",
				round ? "w-[var(--raid-chip)]" : "w-[var(--raid-pill)]",
			)}
		/>
	);
}

function Divider() {
	return <div className="h-px shrink-0 bg-gray-500/10" />;
}

function Line({ row, shaded }: { row: RaidRow; shaded: boolean }) {
	const { Icon, tint } = KIND[row.kind];

	return (
		<>
			<div
				className={cn(
					"flex shrink-0 items-center gap-[var(--raid-gap)] p-[var(--raid-pad)]",
					shaded && "bg-gray-500/5",
				)}
			>
				<Icon
					className={cn(
						"shrink-0 w-[var(--raid-icon)] h-[var(--raid-icon)]",
						tint,
					)}
				/>
				<span className="w-[var(--raid-id)] shrink-0 font-mono text-[length:var(--raid-text)] leading-[var(--raid-line)] text-gray-300">
					{row.id}
				</span>
				{/* Loader inside the lane, or it pushes this row's title out of line. */}
				<div className="flex w-[var(--raid-title)] shrink-0 items-center gap-1 overflow-hidden">
					{row.pending && <ArrowLoader />}
					<span
						className={cn(
							"truncate text-[length:var(--raid-text)] leading-[var(--raid-line)]",
							row.pending
								? "raid-shimmer bg-clip-text text-transparent"
								: "text-gray-400",
						)}
					>
						{row.title}
					</span>
				</div>
				<span className="w-[var(--raid-date)] shrink-0 text-[length:var(--raid-text)] leading-[var(--raid-line)] text-gray-300">
					{row.date}
				</span>
				<span className="w-[var(--raid-impact)] shrink-0 text-[length:var(--raid-text)] leading-[var(--raid-line)] text-gray-300">
					{row.impact}
				</span>
			</div>
			<Divider />
		</>
	);
}

const CYCLE = 1000;

/** raid-cell's keyframes hold one step per 12.5% of the cycle. */
const STEP = CYCLE / 8;

/** Squares: the site's lattice only draws dots, and clips them at this size. */
function ArrowLoader() {
	return (
		<div className="grid shrink-0 grid-cols-3 gap-[var(--raid-cell)]">
			{Array.from({ length: 9 }, (_, index) => {
				const row = Math.floor(index / 3);
				const column = index % 3;
				const lit = column === 0 || (column === 1 && row === 1);

				return (
					<div
						key={index}
						style={{
							// A step later per column carries the arrow right; the offset
							// leaves a paused loop resting on the frame below.
							animationDelay: `${STEP * column - CYCLE}ms`,
							animationDuration: `${CYCLE}ms`,
							opacity: lit ? 1 : 0.2,
						}}
						className={cn(
							"raid-cell size-[var(--raid-cell)] bg-gray-400",
							row === 1 && "raid-cell-tip",
						)}
					/>
				);
			})}
		</div>
	);
}
