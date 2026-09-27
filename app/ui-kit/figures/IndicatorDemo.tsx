"use client";

import { AnimatePresence, m } from "motion/react";
import { useId, useState } from "react";
import { Surface } from "../Surface";
import { SliderTrack } from "../controls/Slider";
import { ProgressDial } from "./StatusDial";

const SIZE = 48;
const UNLIT = "rgba(153, 161, 175, 0.2)";

const tone = (level: number) =>
	level >= 4 ? "#f54900" : level === 3 ? "#ffb900" : "#99a1af";

/**
 * The warning glyph's shake, scaled to the icon: ±4px at 24px, so the same
 * beats read at this size.
 */
const shake = (delay: number) => ({
	x: [0, -4, 4, -2, 2, -1, 1, 0].map((beat) => (beat * SIZE) / 24),
	transition: { duration: 0.25, delay },
});

/** Lands on 4 after mount — a figure that loads at its last step stays still. */
function useLandedOnFour(level: number) {
	const [previous, setPrevious] = useState(level);
	const [landed, setLanded] = useState(false);
	if (level !== previous) {
		setPrevious(level);
		setLanded(level === 4);
	}
	return landed;
}

const QUADRANTS = [
	"M9 4.614C9 4.867 8.81 5.078 8.562 5.125C6.638 5.487 5.487 6.638 5.125 8.562C5.078 8.81 4.867 9 4.614 9H2.631C2.33 9 2.096 8.736 2.154 8.441C2.78 5.274 5.274 2.779 8.441 2.153C8.736 2.095 9 2.329 9 2.63V4.614Z",
	"M11 2.63C11 2.329 11.264 2.095 11.559 2.153C14.726 2.779 17.22 5.274 17.846 8.441C17.904 8.736 17.67 9 17.369 9H15.386C15.133 9 14.922 8.81 14.875 8.562C14.513 6.638 13.362 5.487 11.438 5.125C11.19 5.078 11 4.867 11 4.614V2.63Z",
	"M17.369 11C17.67 11 17.904 11.264 17.846 11.559C17.22 14.726 14.726 17.22 11.559 17.846C11.264 17.904 11 17.67 11 17.369V15.385C11 15.132 11.19 14.921 11.438 14.874C13.361 14.512 14.513 13.361 14.875 11.438C14.922 11.19 15.133 11 15.386 11H17.369Z",
	"M4.614 11C4.867 11 5.078 11.19 5.125 11.438C5.487 13.361 6.638 14.512 8.562 14.874C8.81 14.921 9 15.132 9 15.385V17.369C9 17.67 8.736 17.904 8.441 17.846C5.274 17.22 2.78 14.726 2.154 11.559C2.096 11.264 2.33 11 2.631 11H4.614Z",
];
const HUB =
	"M12 10C12 11.105 11.105 12 10 12C8.895 12 8 11.105 8 10C8 8.895 8.895 8 10 8C11.105 8 12 8.895 12 10Z";

/**
 * A thick stroke over the ring's band, clipped to the quadrants, sweeps round
 * from twelve o'clock, lighting the top-right quadrant first, so each one fills
 * along its curve. The clip never changes; only the stroke under it moves.
 */
const SWEEP_RADIUS = 6.4;

/** Cropped to the quadrants' own extent, so the ring fills its box like the dial does. */
const RING_VIEW_BOX = "2.15 2.15 15.7 15.7";
const SWEEP_LENGTH = 2 * Math.PI * SWEEP_RADIUS;

function ImpactDial({ level }: { level: number }) {
	const clipId = `impact-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
	const landed = useLandedOnFour(level);

	return (
		<m.svg
			width={SIZE}
			height={SIZE}
			viewBox={RING_VIEW_BOX}
			fill="none"
			aria-hidden="true"
			focusable="false"
			initial={false}
			animate={landed ? shake(0.15) : { x: 0 }}
		>
			<clipPath id={clipId}>
				{QUADRANTS.map((d) => (
					<path key={d} d={d} />
				))}
			</clipPath>
			<m.path
				d={HUB}
				initial={false}
				animate={{ fill: level > 3 ? tone(level) : UNLIT }}
				transition={{ duration: 0.25 }}
			/>
			{QUADRANTS.map((d) => (
				<path key={d} d={d} fill={UNLIT} />
			))}
			<g clipPath={`url(#${clipId})`}>
				<m.circle
					cx={10}
					cy={10}
					r={SWEEP_RADIUS}
					fill="none"
					strokeWidth={4}
					strokeDasharray={SWEEP_LENGTH}
					transform="rotate(-90 10 10)"
					initial={false}
					animate={{
						strokeDashoffset: SWEEP_LENGTH * (1 - level / 4),
						stroke: tone(level),
					}}
					transition={{
						strokeDashoffset: { type: "spring", bounce: 0, duration: 0.45 },
						stroke: { duration: 0.25 },
					}}
				/>
			</g>
		</m.svg>
	);
}

const BARS = [1, 2, 3];
const BAR_WIDTH = 3;
const BAR_GAP = 2;
const BAR_HEIGHT = 12;
const BARS_LEFT = (16 - (BARS.length * BAR_WIDTH + 2 * BAR_GAP)) / 2;
const BARS_TOP = (16 - BAR_HEIGHT) / 2;

/** The warning triangle, from the status button, fitted to the 16px box. */
const WARNING =
	"M9.4 3c1.16-2 4.04-2 5.2 0l7.36 12.75c1.15 2-0.29 4.5-2.6 4.5H4.64c-2.31 0-3.75-2.5-2.6-4.5L9.4 3ZM12 8.25a0.75 0.75 0 0 1 0.75 0.75v3.75a0.75 0.75 0 0 1-1.5 0V9a0.75 0.75 0 0 1 0.75-0.75Zm0 8.25a0.75 0.75 0 1 0 0-1.5 0.75 0.75 0 0 0 0 1.5Z";

const GLYPH = {
	initial: { scale: 0, opacity: 0 },
	animate: { scale: 1, opacity: 1 },
	exit: { scale: 0.3, opacity: 0 },
};

/** Transforms on SVG children pivot on their own box, not the canvas's corner. */
const OWN_BOX = { transformBox: "fill-box", originX: 0.5 } as const;

function LikelihoodBars({ level }: { level: number }) {
	const certain = level === 4;
	const landed = useLandedOnFour(level);
	const clipId = `bars-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
	const [previous, setPrevious] = useState(level);
	const [rising, setRising] = useState(true);
	if (level !== previous) {
		setRising(level > previous);
		setPrevious(level);
	}

	return (
		<m.svg
			width={SIZE}
			height={SIZE}
			viewBox="0 0 16 16"
			fill="none"
			aria-hidden="true"
			focusable="false"
			initial={false}
			animate={landed ? shake(0.2) : { x: 0 }}
		>
			<m.g
				initial={false}
				animate={{ opacity: certain ? 0 : 1 }}
				transition={{ duration: 0.15, delay: certain ? 0.1 : 0 }}
			>
				{BARS.map((bar) => {
					const x = BARS_LEFT + (bar - 1) * (BAR_WIDTH + BAR_GAP);
					const height = (bar / 3) * BAR_HEIGHT;
					const order = rising ? bar - 1 : 3 - bar;
					return (
						<g key={bar}>
							<clipPath id={`${clipId}-${bar}`}>
								<rect
									x={x}
									y={BARS_TOP}
									width={BAR_WIDTH}
									height={BAR_HEIGHT}
									rx={1}
								/>
							</clipPath>
							<rect
								x={x}
								y={BARS_TOP}
								width={BAR_WIDTH}
								height={BAR_HEIGHT}
								rx={1}
								fill={UNLIT}
							/>
							<g clipPath={`url(#${clipId}-${bar})`}>
								<m.g
									initial={false}
									animate={{ y: !certain && level >= bar ? 0 : height }}
									transition={{
										type: "spring",
										bounce: 0,
										duration: 0.3,
										delay: order * 0.04,
									}}
								>
									<m.rect
										x={x}
										y={BARS_TOP + BAR_HEIGHT - height}
										width={BAR_WIDTH}
										height={height}
										rx={1}
										initial={false}
										animate={{ fill: tone(level) }}
										transition={{ duration: 0.25 }}
									/>
								</m.g>
							</g>
						</g>
					);
				})}
			</m.g>
			<AnimatePresence initial={false}>
				{certain && (
					<m.g
						key="certain"
						variants={GLYPH}
						initial="initial"
						animate="animate"
						exit="exit"
						transition={{ duration: 0.25 }}
						style={{ ...OWN_BOX, originY: 0.5 }}
					>
						<path
							d={WARNING}
							fill={tone(4)}
							fillRule="evenodd"
							clipRule="evenodd"
							transform="translate(0 0.5) scale(0.6667)"
						/>
					</m.g>
				)}
			</AnimatePresence>
		</m.svg>
	);
}

function Column({
	label,
	figure,
	children,
}: {
	label: string;
	figure: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-1 flex-col items-center gap-8 px-6 py-8">
			<span className="font-mono text-xs text-gray-400">{label}</span>
			<div
				style={{ width: SIZE, height: SIZE }}
				className="flex items-center justify-center"
			>
				{figure}
			</div>
			<div className="w-full">{children}</div>
		</div>
	);
}

const statusTone = (fraction: number) =>
	fraction === 0 ? "#d1d5dc" : fraction === 1 ? "#2b7fff" : "#ffb900";

function StatusColumn() {
	const [fraction, setFraction] = useState(0);

	return (
		<Column
			label="Status"
			figure={
				<m.div
					animate={{ color: statusTone(fraction) }}
					transition={{ duration: 0.25 }}
					className="flex"
				>
					<ProgressDial
						fraction={fraction}
						dashed
						mark={fraction === 1 ? "tick" : undefined}
						size={SIZE}
					/>
				</m.div>
			}
		>
			<SliderTrack
				aria-label="Status"
				value={fraction}
				min={0}
				max={1}
				step={0.01}
				format={(value) => value.toFixed(2)}
				onChange={setFraction}
			/>
		</Column>
	);
}

function LevelColumn({
	label,
	steps,
	figure,
}: {
	label: string;
	steps: readonly string[];
	figure: (level: number) => React.ReactNode;
}) {
	const [level, setLevel] = useState(2);

	return (
		<Column label={label} figure={figure(level)}>
			<SliderTrack
				aria-label={label}
				value={level}
				min={0}
				max={steps.length - 1}
				step={1}
				format={(value) => steps[value] ?? ""}
				showSteps
				onChange={setLevel}
			/>
		</Column>
	);
}

const IMPACT_STEPS = ["None", "Low", "Medium", "High", "Critical"];
const LIKELIHOOD_STEPS = ["None", "Low", "Medium", "High", "Certain"];

export function IndicatorDemo() {
	return (
		<Surface
			className="my-6 w-full cursor-default"
			inner={{
				className:
					"flex flex-col divide-y divide-gray-500/10 bg-gray-50 sm:flex-row sm:divide-x sm:divide-y-0",
			}}
		>
			<StatusColumn />
			<LevelColumn
				label="Impact"
				steps={IMPACT_STEPS}
				figure={(level) => <ImpactDial level={level} />}
			/>
			<LevelColumn
				label="Likelihood"
				steps={LIKELIHOOD_STEPS}
				figure={(level) => <LikelihoodBars level={level} />}
			/>
		</Surface>
	);
}
