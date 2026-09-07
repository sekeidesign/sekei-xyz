"use client";

import { m, useInView } from "motion/react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { cn } from "../cn";
import { usePrefersReducedMotion } from "../use-prefers-reduced-motion";
import { ACCENT, MARK_PATH, PROMPT, TREE } from "./wiki-tree";

/** Both variants draw at the design's own sizes and crop, never scale. */

const VISITED = TREE.reduce<number[]>(
	(all, node, index) => (node.visited ? [...all, index] : all),
	[],
);

const DWELL = 2400;

const TRAVEL = { type: "spring", duration: 0.55, bounce: 0.18 } as const;

/** Ends back on the ground colour, so nothing has to reset it. */
const SHEEN: CSSProperties = {
	backgroundImage:
		`linear-gradient(100deg, var(--color-gray-300) 40%, ${ACCENT} 50%, var(--color-gray-300) 60%)`,
	backgroundSize: "300% 100%",
	WebkitBackgroundClip: "text",
	backgroundClip: "text",
	color: "transparent",
};

const CARD = {
	"--wiki-accent": ACCENT,
	"--wiki-inset": "0px",
	"--wiki-width": "400px",
	"--wiki-height": "auto",
	"--wiki-radius": "0px",
	"--wiki-pad": "10px",
	"--wiki-text": "12px",
	"--wiki-line": "16px",
	"--wiki-mark": "12px",
	"--wiki-box": "14px",
	"--wiki-corner": "4px",
} as CSSProperties;

const PAGE = {
	"--wiki-accent": ACCENT,
	"--wiki-inset": "40px",
	"--wiki-width": "100%",
	"--wiki-height": "100%",
	"--wiki-radius": "12px",
	"--wiki-pad": "16px",
	"--wiki-term": "287px",
	"--wiki-text": "14px",
	"--wiki-line": "18px",
	"--wiki-mark": "14px",
	"--wiki-box": "16px",
	"--wiki-corner": "5px",
	"--dot-color": "var(--color-gray-200)",
	"--dot-gap": "14px",
	"--dot-size": "0.75px",
} as CSSProperties;

export function WikiTreeCover({
	variant = "card",
}: {
	variant?: "card" | "page";
}) {
	const ref = useRef<HTMLDivElement>(null);
	const inView = useInView(ref, { amount: 0.3 });
	const reducedMotion = usePrefersReducedMotion();
	const [step, setStep] = useState(0);
	const page = variant === "page";

	useEffect(() => {
		if (!inView || reducedMotion) return;
		const timer = setInterval(
			() => setStep((current) => current + 1),
			DWELL,
		);
		return () => clearInterval(timer);
	}, [inView, reducedMotion]);

	const selected = VISITED[step % VISITED.length];

	return (
		<div
			ref={ref}
			style={page ? PAGE : CARD}
			className={cn(
				"relative size-full overflow-hidden bg-gray-50",
				page && "dot-matrix",
			)}
		>
			<div
				className={cn(
					"absolute left-[var(--wiki-inset)] top-[var(--wiki-inset)] flex h-[var(--wiki-height)] w-[var(--wiki-width)] overflow-hidden rounded-[var(--wiki-radius)] bg-white font-mono text-[length:var(--wiki-text)] leading-[var(--wiki-line)] whitespace-pre text-gray-300",
					page && "ring-1 ring-gray-400/15 shadow-2xl",
				)}
			>
			<div className="flex flex-1 flex-col p-[var(--wiki-pad)]">
				{TREE.map((node, index) => (
					<div key={node.name} className="relative flex shrink-0">
						<span className="shrink-0">{node.prefix}</span>
						{index === selected ? (
							// Keyed so landing here again replays the pass.
							<m.span
								key={step}
								className="relative"
								style={SHEEN}
								initial={{ backgroundPositionX: "100%" }}
								animate={{ backgroundPositionX: "0%" }}
								transition={{ duration: 0.7, ease: "linear" }}
							>
								{node.name}
								<Crosshair />
							</m.span>
						) : (
							<span className="relative shrink-0">{node.name}</span>
						)}
						{index === selected && <Mark />}
					</div>
				))}
			</div>
				{page && <Terminal running={inView && !reducedMotion} />}
			</div>
		</div>
	);
}

/** Walks out and back, so the mark pulses rather than jumps. */
const THINKING = ["·", "✢", "✳", "∗", "✻", "✽", "✻", "∗", "✳", "✢"];

const TICK = 215;

/** Page only: at the card's crop it would take the box and leave no tree. */
function Terminal({ running }: { running: boolean }) {
	const [frame, setFrame] = useState(0);

	useEffect(() => {
		if (!running) return;
		const timer = setInterval(() => setFrame((at) => at + 1), TICK);
		return () => clearInterval(timer);
	}, [running]);

	return (
		<div className="flex w-[var(--wiki-term)] shrink-0 flex-col gap-[var(--wiki-pad)] self-stretch border-l border-white/20 bg-[#282c34] p-[var(--wiki-pad)]">
			<p className="whitespace-pre-wrap text-gray-500">{PROMPT}</p>
			<p className="flex items-center gap-[1ch] text-[var(--wiki-accent)]">
				{/* Geist Mono has none of these glyphs, so each frame falls back to a
				    different face; a fixed box keeps its metrics off the line. */}
				<span className="grid h-[var(--wiki-line)] w-[1ch] place-items-center">
					{THINKING[frame % THINKING.length]}
				</span>
				Noodling...
			</p>
		</div>
	);
}

/** Travels on its own, not inside the crosshair, which changes width. */
function Mark() {
	return (
		<m.span
			layoutId="wiki-mark"
			transition={TRAVEL}
			className="absolute left-4 top-[2px] flex size-[var(--wiki-mark)] text-[var(--wiki-accent)]"
		>
			<svg
				viewBox="0 0 12 12"
				fill="currentColor"
				className="size-full"
				aria-hidden="true"
				focusable="false"
			>
				<path d={MARK_PATH} />
			</svg>
		</m.span>
	);
}

/** Four marks travelling independently, so none of them stretches en route. */
const CORNERS = [
	{ id: "tl", at: "top-0 left-0 border-t border-l" },
	{ id: "tr", at: "top-0 right-0 border-t border-r" },
	{ id: "bl", at: "bottom-0 left-0 border-b border-l" },
	{ id: "br", at: "bottom-0 right-0 border-b border-r" },
];

function Crosshair() {
	return (
		// A line box is the full leading, hence a fixed height. Transform is safe
		// here: the travelling marks are children, not this span.
		<span className="pointer-events-none absolute -inset-x-[2px] top-1/2 h-[var(--wiki-box)] -translate-y-1/2">
			{CORNERS.map(({ id, at }) => (
				<m.span
					key={id}
					layoutId={`wiki-corner-${id}`}
					transition={TRAVEL}
					className={cn(
						"absolute size-[var(--wiki-corner)] border-[var(--wiki-accent)]",
						at,
					)}
				/>
			))}
		</span>
	);
}
