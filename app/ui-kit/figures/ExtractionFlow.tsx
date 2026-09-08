"use client";

import { useInView } from "motion/react";
import { type CSSProperties, useId, useRef, useState } from "react";
import { cn } from "../cn";
import { KIND } from "../covers/raid-log";
import { TatoMark } from "../icons/TatoMark";
import { SURFACE_INNER, SURFACE_OUTER } from "../post/surface";
import { usePrefersReducedMotion } from "../use-prefers-reduced-motion";
import { Disc } from "./Disc";
import { RAID_KINDS } from "./kinds";
import { SOURCES, SourceIcon } from "./sources";

/**
 * The design's own card, and the x of each column's centre in it. Both the
 * lines and the badges are placed from these, the lines through a stretched
 * viewBox and the badges as a percentage of the width, so the two agree at any
 * size — a line can then run to the centre of what it feeds and be covered by
 * it, which is what lets a pulse arrive and leave from behind a badge.
 */
const WIDTH = 656;
const HEIGHT = 320;
const SOURCE_X = 95;
const MARK_X = 328;
const OUTPUT_X = 561;
const MIDDLE = HEIGHT / 2;

const BADGE = 46;
const GAP = 16;

/**
 * The y of each source badge, read off the same badge and gap the column is
 * laid out with so the two can't drift: four badges of 46 with 16 between
 * them, centred in the card.
 */
const COLUMN = SOURCES.length * BADGE + (SOURCES.length - 1) * GAP;
const LANES = SOURCES.map(
	(_, index) => (HEIGHT - COLUMN) / 2 + BADGE / 2 + index * (BADGE + GAP),
);

const BEND = (SOURCE_X + MARK_X) / 2;
const INBOUND = LANES.map(
	(y) => `M${SOURCE_X} ${y}C${BEND} ${y} ${BEND} ${MIDDLE} ${MARK_X} ${MIDDLE}`,
);
const OUTBOUND = [`M${MARK_X} ${MIDDLE}H${OUTPUT_X}`];

/** Offsets and positions land in the DOM, where binary fractions read as noise. */
const round = (value: number) => Math.round(value * 1000) / 1000;

const lane = (x: number) => `${round((x / WIDTH) * 100)}%`;

/**
 * Dash length as a fraction of a path. A gap of 2 against a path of 1 keeps
 * every other dash in the pattern off the path, so a lane carries one dash and
 * nothing else. It parks a dash short of the start and runs until the tail
 * clears the end, and since both ends sit under a badge, a pulse is drawn
 * emerging from behind one and sliding in behind the next.
 */
const DASH = 0.12;
const PULSE_PERIOD = DASH + 2;
const PULSE_FROM = round(PULSE_PERIOD + DASH);
const PULSE_TO = round(PULSE_PERIOD - 1);

/** Stroked on the badge's own edge, hence the half stroke off the radius. */
const TRACE_BOX = 50;
const TRACE_R = TRACE_BOX / 2 - 0.75;

/** An arc is half the badge's border, so the segment reads at the line's length. */
const TRACE_DASH = 0.35;

/**
 * The segment leaves at the badge's east point: it ends a twentieth past the
 * arc, where stopping level with the end would leave the dash's round cap
 * behind as a dot.
 */
/** How far ahead of the pulse the badge takes an item, in seconds. */
const LEAD = 0.1;

const TRACE_PERIOD = TRACE_DASH + 2;
const TRACE_FROM = round(TRACE_PERIOD + TRACE_DASH);
const TRACE_TO = round(TRACE_PERIOD - 1.05);

const WASH = "transition-opacity duration-300 ease-out";
const GLYPH = "transition-[translate,filter,opacity] duration-300 ease-out";
const GLYPH_HERE = "translate-x-0 opacity-100 blur-none";
const GLYPH_LEAVING = "translate-x-2 opacity-0 blur-xs";
const GLYPH_WAITING = "-translate-x-2 opacity-0 blur-xs";

export function ExtractionFlow() {
	const ref = useRef<HTMLDivElement>(null);
	const inView = useInView(ref, { amount: 0.4 });
	const reduced = usePrefersReducedMotion();
	const [current, setCurrent] = useState(0);
	const [leaving, setLeaving] = useState<number | null>(null);
	// The pulse leaving the mark is the colour of the item on its way, and the
	// badge takes that item on the lap the pulse lands.
	const next = (current + 1) % RAID_KINDS.length;

	return (
		<div className={cn("my-6 w-full rounded-xl", SURFACE_OUTER)}>
			<div
				ref={ref}
				role="img"
				aria-label="Activity from meetings, chats, email and connected tools flows into Tato, which produces a RAID item"
				className={cn(
					"relative h-80 rounded-lg",
					SURFACE_INNER,
					"bg-gray-50",
					inView && "flow-live",
				)}
			>
				<Flow paths={INBOUND} tone="text-gray-600" duration={4.8} fade />
				<Flow
					paths={OUTBOUND}
					tone={KIND[RAID_KINDS[next].kind].tint}
					duration={1.6}
					delay={1.2}
					held
					onArrive={() => {
						if (reduced) return;
						setLeaving(current);
						setCurrent(next);
					}}
				/>

				<div
					style={{ left: lane(SOURCE_X) }}
					className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-4"
				>
					{SOURCES.map(({ label, viewBox, paths }) => (
						<Disc key={label} wash="bg-gray-200 shadow-gray-500/20">
							<SourceIcon
								viewBox={viewBox}
								paths={paths}
								className="size-5 text-gray-600/75"
							/>
						</Disc>
					))}
				</div>

				<div
					style={{ left: lane(MARK_X) }}
					className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
				>
					{[0, 1, 2].map((step) => (
						<span
							key={step}
							aria-hidden="true"
							className="flow-ring absolute top-1/2 left-1/2 size-13 -translate-x-1/2 -translate-y-1/2 rounded-[10px] ring-1 ring-gray-500/10"
							style={{ animationDelay: `${step * 1.2}s` }}
						/>
					))}
					{/* 10px is the tile's rounded-md plus this frame's p-1, so the two
					    corners stay concentric — and the rings above start on them. */}
					<span className="relative flex rounded-[10px] bg-white p-1 ring-1 ring-gray-500/10 shadow-sm">
						<span className="flex size-11 items-center justify-center rounded-md bg-linear-to-b from-orange-500 to-orange-600 ring-1 ring-orange-600 shadow-xl shadow-orange-500/25 inset-shadow-2xs inset-shadow-white/20">
							<TatoMark className="h-8 text-white" />
						</span>
					</span>
				</div>

				<div
					style={{ left: lane(OUTPUT_X) }}
					className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
				>
					{leaving !== null && (
						<Trace key={current} tone={KIND[RAID_KINDS[current].kind].tint} />
					)}
					<span className="flex rounded-full bg-white p-1 ring-1 ring-gray-500/10 shadow-sm">
						<span className="relative size-10">
							{RAID_KINDS.map(({ kind, wash }, index) => {
								const { Icon, tint } = KIND[kind];
								const here = index === current;
								return (
									<span
										key={kind}
										className={cn(
											"absolute inset-0 flex items-center justify-center rounded-full bg-linear-to-b from-white to-transparent ring-1 ring-gray-500/10 shadow-sm",
											wash,
											WASH,
											here ? "opacity-100" : "opacity-0",
										)}
									>
										<Icon
											size={24}
											className={cn(
												tint,
												GLYPH,
												here
													? GLYPH_HERE
													: index === leaving
														? GLYPH_LEAVING
														: GLYPH_WAITING,
											)}
										/>
									</span>
								);
							})}
						</span>
					</span>
				</div>
			</div>
		</div>
	);
}

/** The viewBox stretches to the layout, so the stroke has to refuse to. */
function Flow({
	paths,
	tone,
	duration,
	delay = 0,
	held,
	fade,
	onArrive,
}: {
	paths: string[];
	tone: string;
	/** Seconds a lap takes. Also the window the paths stagger across. */
	duration: number;
	delay?: number;
	/** Wait out half the lap before setting off, so the loop reads slower. */
	held?: boolean;
	fade?: boolean;
	onArrive?: () => void;
}) {
	const gradient = useId();

	return (
		<svg
			viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
			preserveAspectRatio="none"
			className={cn("pointer-events-none absolute inset-0 size-full", tone)}
			aria-hidden="true"
			focusable="false"
		>
			{fade && (
				<defs>
					{/* User space rather than the default object bounding box: a
					    straight path has no height, and a gradient measured against
					    that box never paints. */}
					<linearGradient
						id={gradient}
						gradientUnits="userSpaceOnUse"
						x1={SOURCE_X}
						y1="0"
						x2={MARK_X}
						y2="0"
					>
						<stop offset="0" stopColor="currentColor" stopOpacity="0" />
						<stop offset="0.45" stopColor="currentColor" />
						<stop offset="1" stopColor="currentColor" stopOpacity="0" />
					</linearGradient>
				</defs>
			)}
			{paths.map((d, index) => (
				<g key={d}>
					{/* The hairline keeps the clock for the hand-off, run a fraction
					    ahead of the pulse: it carries no dash, so animating a dash
					    offset on it moves nothing and only its lap matters. */}
					<path
						d={d}
						fill="none"
						strokeWidth={1}
						vectorEffect="non-scaling-stroke"
						className={cn(
							"stroke-gray-200",
							onArrive && "flow-pulse",
							onArrive && held && "flow-held",
						)}
						style={
							onArrive
								? ({
										"--flow-from": PULSE_FROM,
										"--flow-to": PULSE_TO,
										animationDelay: `${round(delay - LEAD)}s`,
										animationDuration: `${duration}s`,
									} as CSSProperties)
								: undefined
						}
						onAnimationIteration={onArrive}
					/>
					<path
						d={d}
						fill="none"
						stroke={fade ? `url(#${gradient})` : "currentColor"}
						strokeWidth={1.5}
						strokeLinecap="round"
						pathLength={1}
						strokeDasharray={`${DASH} 2`}
						vectorEffect="non-scaling-stroke"
						className={cn("flow-pulse", held && "flow-held")}
						style={
							{
								"--flow-from": PULSE_FROM,
								"--flow-to": PULSE_TO,
								animationDelay: `${round(delay + (index * duration) / paths.length)}s`,
								animationDuration: `${duration}s`,
							} as CSSProperties
						}
					/>
				</g>
			))}
		</svg>
	);
}

function Trace({ tone }: { tone: string }) {
	const west = `M${TRACE_BOX / 2 - TRACE_R} ${TRACE_BOX / 2}`;
	const east = `${TRACE_BOX / 2 + TRACE_R} ${TRACE_BOX / 2}`;

	return (
		<svg
			viewBox={`0 0 ${TRACE_BOX} ${TRACE_BOX}`}
			className={cn(
				"pointer-events-none absolute top-1/2 left-1/2 size-12.5 -translate-x-1/2 -translate-y-1/2",
				tone,
			)}
			aria-hidden="true"
			focusable="false"
		>
			{/* Sweep 1 goes over the top and 0 under the bottom, both from the
			    west point — the pulse splitting around the badge. */}
			{[1, 0].map((sweep) => (
				<path
					key={sweep}
					d={`${west}A${TRACE_R} ${TRACE_R} 0 0 ${sweep} ${east}`}
					fill="none"
					stroke="currentColor"
					strokeWidth={1.5}
					strokeLinecap="round"
					pathLength={1}
					strokeDasharray={`${TRACE_DASH} 2`}
					className="flow-trace"
					style={
						{
							"--flow-from": TRACE_FROM,
							"--flow-to": TRACE_TO,
						} as CSSProperties
					}
				/>
			))}
		</svg>
	);
}
