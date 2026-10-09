"use client";

import { m, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { seededRandom } from "@/components/shad-fx";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

/** Flat side of a plate, in the units its contents are drawn in. */
const S = 150;
/** Plate thickness, which is also the gap between plates while the stack is closed. */
const H = 8;
/** Distance between plates once the stack has opened. */
const GAP = 106;
const CX = 205;
/** Room the stack needs once open, so it can sit centred in the 720-tall view. */
const TOP = (720 - (4 * GAP + S + H)) / 2;
const CELLS = 15;
const COS = Math.cos(Math.PI / 6);

/** A flat point on a plate's top face, projected. */
const iso = (x: number, y: number) => [CX + (x - y) * COS, (x + y) / 2] as const;
const pts = (...points: (readonly [number, number])[]) => points.map((p) => p.join(",")).join(" ");
const down = ([x, y]: readonly [number, number]) => [x, y + H] as const;

/** Draws its children in the plate's flat coordinates, onto the top face. */
const FACE = `matrix(${COS} 0.5 ${-COS} 0.5 ${CX} 0)`;

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

/** A frozen frame of the fire: heat seeded along the near edge, wavering as it rises. */
const HEAT = (() => {
	const rand = seededRandom(7);
	const field: number[] = [];
	for (let row = 0; row < CELLS; row++) {
		for (let col = 0; col < CELLS; col++) {
			const lift = (row + 1) / CELLS;
			const lean = 0.22 * Math.sin(col * 0.85 + row * 0.35) + 0.12 * Math.sin(col * 2.1);
			field.push(Math.max(0, Math.min(1, lift * 1.35 - 0.38 + lean + (rand() - 0.5) * 0.18)));
		}
	}
	return field;
})();

const LIT = HEAT.map((heat, index) => heat > (BAYER[(index % CELLS) % 4 + (Math.floor(index / CELLS) % 4) * 4] + 0.5) / 16);

function cells(size: number, lit: (index: number) => number) {
	return HEAT.map((_, index) => {
		const opacity = lit(index);
		if (opacity <= 0) return null;
		const x = (index % CELLS) * size;
		const y = Math.floor(index / CELLS) * size;
		return <rect key={index} x={x} y={y} width={size} height={size} opacity={opacity} className="fill-gray-800" />;
	});
}

const LINE = { vectorEffect: "non-scaling-stroke" } as const;

function Mount() {
	const inset = 15;
	const span = S - inset * 2;
	return (
		<>
			{Array.from({ length: 11 }, (_, i) => (
				<g key={i} className="stroke-gray-800/25" strokeWidth={0.75}>
					<line x1={inset + (i + 1) * 10} y1={inset} x2={inset + (i + 1) * 10} y2={S - inset} style={LINE} />
					<line x1={inset} y1={inset + (i + 1) * 10} x2={S - inset} y2={inset + (i + 1) * 10} style={LINE} />
				</g>
			))}
			<rect x={inset} y={inset} width={span} height={span} className="fill-none stroke-gray-800" style={LINE} />
			{/* ResizeObserver: the corners the canvas is measured from. */}
			{[
				[6, 6, 1, 1],
				[S - 6, 6, -1, 1],
				[S - 6, S - 6, -1, -1],
				[6, S - 6, 1, -1],
			].map(([x, y, dx, dy]) => (
				<path
					key={`${x}${y}`}
					d={`M${x} ${y + dy * 12}V${y}H${x + dx * 12}`}
					className="fill-none stroke-gray-800"
					strokeWidth={1.5}
					style={LINE}
				/>
			))}
		</>
	);
}

function Loop() {
	const c = S / 2;
	const reduced = usePrefersReducedMotion();
	return (
		<>
			{Array.from({ length: 36 }, (_, i) => {
				const a = (i / 36) * Math.PI * 2;
				const long = i % 6 === 0;
				const r0 = long ? 46 : 50;
				return (
					<line
						key={i}
						x1={c + Math.cos(a) * r0}
						y1={c + Math.sin(a) * r0}
						x2={c + Math.cos(a) * 56}
						y2={c + Math.sin(a) * 56}
						className={long ? "stroke-gray-800" : "stroke-gray-800/40"}
						style={LINE}
					/>
				);
			})}
			<circle cx={c} cy={c} r={56} className="fill-none stroke-gray-800" style={LINE} />
			{/* Turned in the plate's own flat coordinates, so it spins lying on the plate. */}
			<g>
				<path
					d={`M${c + 34} ${c}A34 34 0 1 1 ${c} ${c - 34}`}
					className="fill-none stroke-gray-800"
					strokeWidth={1.5}
					style={LINE}
				/>
				<path d={`M${c - 6} ${c - 40}L${c + 2} ${c - 34}L${c - 6} ${c - 28}`} className="fill-none stroke-gray-800" style={LINE} />
				{!reduced && (
					<animateTransform
						attributeName="transform"
						type="rotate"
						from={`0 ${c} ${c}`}
						to={`360 ${c} ${c}`}
						dur="4s"
						repeatCount="indefinite"
					/>
				)}
			</g>
		</>
	);
}

function Simulate() {
	return <>{cells(S / CELLS, (index) => HEAT[index] * 0.85)}</>;
}

/** The renderer paints into a small backing store, the near corner of the box. */
function Dither() {
	const small = S / 2;
	return (
		<>
			<rect x={small} y={small} width={small} height={small} className="fill-white stroke-gray-800" style={LINE} />
			<g transform={`translate(${small} ${small})`}>{cells(small / CELLS, (index) => (LIT[index] ? 1 : 0))}</g>
			<rect
				x={0}
				y={0}
				width={S}
				height={S}
				className="fill-none stroke-gray-800/50"
				strokeDasharray="3 3"
				style={LINE}
			/>
		</>
	);
}

/** image-rendering: pixelated scales that store up to the box, each cell a crisp block. */
function Upscale() {
	return <>{cells(S / CELLS, (index) => (LIT[index] ? 1 : 0))}</>;
}

const LAYERS: { step: string; detail: string; face: string; art: ReactNode }[] = [
	{ step: "Mount", detail: "div + ResizeObserver", face: "fill-white", art: <Mount /> },
	{ step: "rAF loop", detail: "step() at 36/s", face: "fill-white", art: <Loop /> },
	{ step: "Simulate", detail: "heat per cell", face: "fill-white", art: <Simulate /> },
	{ step: "Dither", detail: "Bayer 4×4, one putImageData", face: "fill-gray-50", art: <Dither /> },
	{ step: "Upscale", detail: "image-rendering: pixelated", face: "fill-gray-100", art: <Upscale /> },
];

const MIDDLE = (LAYERS.length - 1) / 2;

/** The pipeline builds upward: mount is the base, the upscaled frame sits on top. */
const slot = (index: number) => LAYERS.length - 1 - index;
const OPEN_DELAY = 0.7;
/** Just behind the plates, so each label lands while its plate is still settling. */
const LABEL_DELAY = OPEN_DELAY + 0.15;

/** Every plate starts flush against its neighbours, so the stack reads as one closed box. */
const plate = (index: number): Variants => ({
	hidden: { y: (slot(index) - MIDDLE) * (H - GAP) },
	show: { y: 0, transition: { type: "spring", stiffness: 90, damping: 17, delay: OPEN_DELAY } },
});

const label = (index: number): Variants => ({
	hidden: { opacity: 0, x: -8 },
	show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut", delay: LABEL_DELAY + index * 0.06 } },
});

const fade: Variants = {
	hidden: { opacity: 0 },
	show: { opacity: 1, transition: { duration: 0.5, delay: LABEL_DELAY } },
};

const MONO = "font-mono uppercase tracking-[0.12em]";

const ARROW = "<-----";
const ROW = 14;
/** Wide enough for the longest detail, so every box is the same size. */
const INNER = Math.max(...LAYERS.map(({ detail }) => detail.length)) + 2;

/**
 * Drawn in text, one monospace row at a time, so it reads like a terminal
 * annotation. The arrow joins the box on the title row, level with the plate's
 * corner at `y`.
 */
function Callout({
	x,
	y,
	title,
	number,
	detail,
}: {
	x: number;
	y: number;
	title: string;
	number: string;
	detail: string;
}) {
	const pad = " ".repeat(ARROW.length);
	const line = (text: string) => ` ${text}`.padEnd(INNER);
	const rows: { lead: string; edge: string; body: string; tail?: string; end: string; strong?: boolean }[] = [
		{ lead: pad, edge: "┌", body: "─".repeat(INNER), end: "┐" },
		// The step on the left, its number pushed to the right edge.
		{
			lead: ARROW,
			edge: "┤",
			body: line(title).slice(0, INNER - number.length - 1),
			tail: `${number} `,
			end: "│",
			strong: true,
		},
		{ lead: pad, edge: "│", body: line(detail), end: "│" },
		{ lead: pad, edge: "└", body: "─".repeat(INNER), end: "┘" },
	];
	return (
		<text x={x} y={y - ROW + 4} className="fill-gray-400 font-mono text-[11px]" style={{ whiteSpace: "pre" }}>
			{rows.map(({ lead, edge, body, tail, end, strong }, row) => (
				<tspan key={row} x={x} dy={row === 0 ? 0 : ROW}>
					<tspan className={strong ? "fill-gray-800" : undefined}>{lead}</tspan>
					{edge}
					<tspan className={strong ? "fill-gray-900" : "fill-gray-500"}>{body}</tspan>
					{tail}
					{end}
				</tspan>
			))}
		</text>
	);
}

function Plate({ index }: { index: number }) {
	const { step, detail, face, art } = LAYERS[index];
	const top = TOP + slot(index) * GAP;
	const right = iso(S, 0);
	return (
		<m.g variants={plate(index)}>
			<g transform={`translate(0 ${top})`}>
				<polygon
					points={pts(iso(S, 0), iso(S, S), iso(0, S), down(iso(0, S)), down(iso(S, S)), down(iso(S, 0)))}
					className="fill-gray-200 stroke-gray-800"
					strokeLinejoin="round"
				/>
				<line x1={iso(S, S)[0]} y1={iso(S, S)[1]} x2={iso(S, S)[0]} y2={iso(S, S)[1] + H} className="stroke-gray-800" />
				<polygon points={pts(iso(0, 0), iso(S, 0), iso(S, S), iso(0, S))} className={`${face} stroke-gray-800`} strokeLinejoin="round" />
				<g transform={FACE}>{art}</g>
				<m.g variants={label(index)}>
					<Callout
						x={right[0] + 8}
						y={right[1]}
						title={step.toUpperCase()}
						number={String(index + 1).padStart(2, "0")}
						detail={detail}
					/>
				</m.g>
			</g>
		</m.g>
	);
}

/** The guides the plates slide apart along, rising from the base to the frame on screen. */
function Guides() {
	const first = TOP;
	const last = TOP + (LAYERS.length - 1) * GAP;
	return (
		<m.g variants={fade} className="stroke-gray-800/50" strokeDasharray="6 5">
			{[iso(0, S), iso(S, 0)].map(([x, y]) => (
				<g key={x}>
					<line x1={x} y1={first + y + H + 10} x2={x} y2={last + y - 10} />
					<path
						d={`M${x - 3.5} ${first + y + H + 16}L${x} ${first + y + H + 10}L${x + 3.5} ${first + y + H + 16}`}
						className="fill-none"
						strokeDasharray="none"
					/>
				</g>
			))}
		</m.g>
	);
}

/** One DitherCanvas, opened up: each plate is a stage between mounting and a frame on screen. */
export function PipelineFigure() {
	return (
		<div className="relative h-full w-full">
			<m.svg
				variants={{ hidden: {}, show: {} }}
				viewBox="0 0 640 720"
				className="h-full w-full overflow-visible"
				role="img"
				aria-label="The DitherCanvas pipeline: mount, rAF loop, simulate, dither, upscale"
			>
				<Guides />
				{/* Lowest first, so each plate covers the one beneath it. */}
				{LAYERS.map((_, index) => (
					<Plate key={index} index={index} />
				))}
			</m.svg>
			<span className={`absolute top-5 left-5 text-[11px] text-gray-400 ${MONO}`}>Fig 01</span>
			<span className={`absolute right-5 bottom-5 text-[11px] text-gray-400 ${MONO}`}>[ DitherCanvas ]</span>
		</div>
	);
}
