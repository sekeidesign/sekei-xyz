"use client";

import { m } from "motion/react";
import { cn } from "../cn";
import { type Glyph, STATUS } from "./status";

/** The icon's own box, and the geometry the product draws in it. */
const CENTRE = 8;
const TRACK_RADIUS = 7;
const WEDGE_RADIUS = 5;

/**
 * The wedge is a stroke as wide as its own radius, so one dash offset fills it
 * from the centre out — the same disc the product's path draws, in a form that
 * can be animated between fractions.
 */
const PIE_RADIUS = WEDGE_RADIUS / 2;
const PIE_LENGTH = 2 * Math.PI * PIE_RADIUS;

/** Eight dashes evenly spaced around the track, for nothing started. */
const DASH_LENGTH = 1;
const SEGMENT = (2 * Math.PI * TRACK_RADIUS) / 8;

/**
 * Nothing started reads as an outline that hasn't closed up yet, so the dashes
 * grow into each other the moment there is any progress at all — a gap of zero
 * being a solid ring keeps that one value to interpolate.
 */
const DASHED = `${DASH_LENGTH} ${SEGMENT - DASH_LENGTH}`;
const SOLID = `${SEGMENT} 0`;

/** The gaps close on their own clock, whatever the wedge is doing. */
const CLOSING = { duration: 0.17, ease: "easeOut" } as const;

/** Finishing: the disc grows out of the wedge and the tick draws itself in. */
const GROW = { type: "spring", bounce: 0, duration: 0.35 } as const;
const DRAW = { duration: 0.25, ease: "easeOut", delay: 0.08 } as const;
const TICK = "M4.9 8.2L6.9 10.2L11.1 5.9";

/**
 * A disc with its mark punched out: the disc runs clockwise and the mark
 * counter-clockwise, so non-zero winding leaves the mark as a hole. From the
 * product as-is.
 */
const DISCS = {
	tick: "M8 0C12.4183 6.45734e-08 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C2.57702e-07 3.58172 3.58172 1.93129e-07 8 0ZM12.0176 4.70703C11.7179 4.4214 11.2429 4.43295 10.957 4.73242L6.2373 9.67676L5.03027 8.46973C4.73739 8.17684 4.26262 8.17686 3.96973 8.46973C3.67683 8.76262 3.67683 9.23738 3.96973 9.53027L5.71973 11.2803C5.86251 11.423 6.05688 11.5023 6.25879 11.5C6.46067 11.4976 6.65357 11.4136 6.79297 11.2676L12.043 5.76758C12.3286 5.46794 12.317 4.99291 12.0176 4.70703Z",
	cross:
		"M8 0C12.4183 6.45734e-08 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C2.57702e-07 3.58172 3.58172 1.93129e-07 8 0ZM12.0303 3.96973C11.7374 3.67686 11.2626 3.6769 10.9697 3.96973L8 6.93945L5.03027 3.96973C4.7374 3.67686 4.26263 3.6769 3.96973 3.96973C3.67683 4.26262 3.67683 4.73738 3.96973 5.03027L6.93945 8L3.96973 10.9697C3.67683 11.2626 3.67683 11.7374 3.96973 12.0303C4.26262 12.3232 4.73738 12.3232 5.03027 12.0303L8 9.06055L10.9697 12.0303C11.2626 12.3232 11.7374 12.3232 12.0303 12.0303C12.3231 11.7374 12.3231 11.2626 12.0303 10.9697L9.06055 8L12.0303 5.03027C12.3231 4.73737 12.3231 4.2626 12.0303 3.96973Z",
	bang: "M8 0C12.4183 6.45734e-08 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C2.57702e-07 3.58172 3.58172 1.93129e-07 8 0ZM7.99609 10.5C7.53814 10.5001 7.16717 10.873 7.16699 11.333C7.16699 11.7932 7.53803 12.1669 7.99609 12.167H8.00391C8.46204 12.1669 8.83301 11.7932 8.83301 11.333C8.83283 10.873 8.46193 10.5001 8.00391 10.5H7.99609ZM8 3.83301C7.53976 3.83301 7.16699 4.20675 7.16699 4.66699V8C7.16699 8.46024 7.53976 8.83301 8 8.83301C8.4602 8.83296 8.83301 8.46021 8.83301 8V4.66699C8.83301 4.20678 8.4602 3.83305 8 3.83301Z",
};

/** The status a label stands for, drawn at whatever size the caller needs. */
export function StatusDial({
	status,
	...rest
}: {
	status: string;
	size?: number;
	animated?: boolean;
	className?: string;
}) {
	const glyph = STATUS[status] ?? STATUS.Open;
	return (
		<ProgressDial
			{...glyph}
			{...rest}
			className={cn(glyph.tone, rest.className)}
		/>
	);
}

/** The same dial driven by a fraction rather than a named status. */
export function ProgressDial({
	fraction = 0,
	colour,
	dashed,
	mark,
	size = 14,
	animated,
	className,
}: Partial<Glyph> & {
	size?: number;
	animated?: boolean;
	className?: string;
}) {
	const glyph = { fraction, colour, dashed, mark };
	const transition = animated
		? ({ type: "spring", bounce: 0, duration: 0.5 } as const)
		: { duration: 0 };

	return (
		<svg
			viewBox="0 0 16 16"
			width={size}
			height={size}
			fill="none"
			className={cn("shrink-0", className)}
			aria-hidden="true"
			focusable="false"
		>
			{glyph.mark === "cross" || glyph.mark === "bang" ? (
				<path d={DISCS[glyph.mark]} fill="currentColor" />
			) : (
				<>
					<m.circle
						cx={CENTRE}
						cy={CENTRE}
						r={TRACK_RADIUS}
						fill="none"
						strokeWidth={2}
						strokeLinecap="round"
						animate={{
							stroke: glyph.colour ?? "currentColor",
							strokeDasharray:
								glyph.dashed && !glyph.fraction ? DASHED : SOLID,
						}}
						transition={{ ...transition, strokeDasharray: CLOSING }}
					/>
					<m.circle
						cx={CENTRE}
						cy={CENTRE}
						r={PIE_RADIUS}
						fill="none"
						strokeWidth={WEDGE_RADIUS}
						strokeDasharray={PIE_LENGTH}
						transform={`rotate(-90 ${CENTRE} ${CENTRE})`}
						animate={{
							strokeDashoffset: PIE_LENGTH * (1 - (glyph.fraction ?? 0)),
							stroke: glyph.colour ?? "currentColor",
						}}
						transition={transition}
					/>
					{/* Finishing grows out of the wedge over the outline it filled,
					    rather than replacing both with a disc. */}
					{glyph.mark === "tick" && (
						<>
							<m.circle
								cx={CENTRE}
								cy={CENTRE}
								fill="currentColor"
								initial={{ r: WEDGE_RADIUS }}
								animate={{ r: 8 }}
								transition={GROW}
							/>
							<m.path
								d={TICK}
								fill="none"
								stroke="white"
								strokeWidth={1.6}
								strokeLinecap="round"
								strokeLinejoin="round"
								pathLength={1}
								strokeDasharray={1}
								initial={{ strokeDashoffset: 1 }}
								animate={{ strokeDashoffset: 0 }}
								transition={DRAW}
							/>
						</>
					)}
				</>
			)}
		</svg>
	);
}
