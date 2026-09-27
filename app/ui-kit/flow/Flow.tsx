"use client";

import { m } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "../cn";
import { type FlowLayout, type LayoutSpacing, layoutFlow } from "./elk";
import { parseFlow } from "./parse";
import { arrowHead, pathLength, roundedPath, trimEnd } from "./path";

const STROKE = 3;
const RADIUS = 10;
const ARROW = { length: 7, width: 8 };
const APPEAR = { type: "spring", duration: 0.5, bounce: 0 } as const;

const LINE = { hidden: { pathLength: 0, opacity: 0 }, shown: { pathLength: 1, opacity: 1 } };
const HEAD = { hidden: { opacity: 0 }, shown: { opacity: 1 } };
const LABEL = {
	hidden: { opacity: 0, x: -6, filter: "blur(2px)" },
	shown: { opacity: 1, x: 0, filter: "blur(0px)" },
};
const INSET = STROKE + ARROW.width;

/** When the drawing reaches each node, travelling at `speed` along the edges. */
function arrivals(layout: FlowLayout, speed: number) {
	const time = new Map<string, number>();
	const incoming = new Set(layout.edges.map(({ to }) => to));
	for (const { id } of layout.nodes) {
		if (!incoming.has(id)) time.set(id, 0);
	}

	let changed = true;
	while (changed) {
		changed = false;
		for (const edge of layout.edges) {
			const start = time.get(edge.from);
			if (start === undefined) continue;
			const end = start + pathLength(edge.points) / speed;
			if (end < (time.get(edge.to) ?? Number.POSITIVE_INFINITY)) {
				time.set(edge.to, end);
				changed = true;
			}
		}
	}
	return time;
}

function useLayout(source: string, spacing: LayoutSpacing) {
	const ref = useRef<SVGSVGElement>(null);
	const [layout, setLayout] = useState<FlowLayout | null>(null);
	const [error, setError] = useState<string | null>(null);
	const { padding, rows, columns, clearance } = spacing;

	useEffect(() => {
		let cancelled = false;

		(async () => {
			await document.fonts.ready;
			const svg = ref.current;
			if (!svg || cancelled) return;

			const style = getComputedStyle(svg);
			const context = document.createElement("canvas").getContext("2d");
			if (!context) return;
			context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
			const height = Number.parseFloat(style.fontSize) * 1.4;

			try {
				const next = await layoutFlow(
					parseFlow(source),
					(label) => ({ width: context.measureText(label).width, height }),
					{ padding, rows, columns, clearance },
				);
				if (cancelled) return;
				setLayout(next);
				setError(null);
			} catch (reason) {
				if (!cancelled) setError(String(reason instanceof Error ? reason.message : reason));
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [source, padding, rows, columns, clearance]);

	return { ref, layout, error };
}

// motion's useInView measures area, and a diagram wider than its Pan never
// has half its area on screen, so only the vertical extent counts here.
function useInViewY(ref: React.RefObject<Element | null>, amount: number) {
	const [inView, setInView] = useState(false);

	useEffect(() => {
		const element = ref.current;
		if (!element || inView) return;

		const check = () => {
			const { top, bottom, height } = element.getBoundingClientRect();
			const visible = Math.min(bottom, window.innerHeight) - Math.max(top, 0);
			if (height > 0 && visible / height >= amount) setInView(true);
		};

		const stop = () => {
			window.removeEventListener("scroll", check);
			window.removeEventListener("resize", check);
		};

		const observer = new IntersectionObserver(([entry]) => {
			if (entry?.isIntersecting) {
				window.addEventListener("scroll", check, { passive: true });
				window.addEventListener("resize", check);
				check();
			} else {
				stop();
			}
		});

		observer.observe(element);
		return () => {
			observer.disconnect();
			stop();
		};
	}, [ref, amount, inView]);

	return inView;
}

export function Flow({
	source,
	animate = true,
	threshold = 0.5,
	speed = 600,
	padding = 6,
	rows = 24,
	columns = 32,
	clearance = 16,
	className,
	"aria-label": label,
}: {
	/** Mermaid-style lines: `a[Label] --- b`, `-->` for an arrow, `a:T --> T:b` to pick sides. */
	source: string;
	animate?: boolean;
	/** How much of the diagram's height has to be on screen before it draws in, from 0 to 1. */
	threshold?: number;
	/** How fast the lines draw in, in px per second. */
	speed?: number;
	padding?: number;
	rows?: number;
	columns?: number;
	clearance?: number;
	className?: string;
	"aria-label"?: string;
}) {
	const { ref, layout, error } = useLayout(source, { padding, rows, columns, clearance });
	const reduced = usePrefersReducedMotion();
	const still = !animate || reduced;
	const inView = useInViewY(ref, threshold);
	const state = still || inView ? "shown" : "hidden";
	const time = useMemo(
		() => (layout ? arrivals(layout, speed) : new Map<string, number>()),
		[layout, speed],
	);

	const width = (layout?.width ?? 0) + INSET * 2;
	const height = (layout?.height ?? 0) + INSET * 2;

	return (
		<div className={cn("flex flex-col gap-2", className)}>
			<svg
				ref={ref}
				role="img"
				aria-label={label}
				width={width}
				height={height}
				viewBox={`${-INSET} ${-INSET} ${width} ${height}`}
				className="overflow-visible text-[14px] font-[450]"
			>
				<g
					fill="none"
					stroke="currentColor"
					strokeWidth={STROKE}
					strokeLinecap="round"
					strokeLinejoin="round"
					className="text-gray-400"
				>
					{layout?.edges.map((edge, index) => {
						const points = edge.arrow ? trimEnd(edge.points, ARROW.length - 1) : edge.points;
						const delay = time.get(edge.from) ?? 0;
						const duration = pathLength(edge.points) / speed;
						return (
							<g key={index}>
								<m.path
									d={roundedPath(points, RADIUS)}
									initial={still ? false : LINE.hidden}
									animate={LINE[state]}
									transition={{
										pathLength: { delay, duration, ease: "linear" },
										opacity: { delay, duration: 0 },
									}}
								/>
								{edge.arrow && (
									<m.path
										d={arrowHead(edge.points, ARROW.length, ARROW.width)}
										fill="currentColor"
										initial={still ? false : HEAD.hidden}
										animate={HEAD[state]}
										transition={{ ...APPEAR, delay: delay + duration }}
									/>
								)}
							</g>
						);
					})}
				</g>
				{layout?.nodes.map((node) => (
					<m.g
						key={node.id}
						initial={still ? false : LABEL.hidden}
						animate={LABEL[state]}
						transition={{ ...APPEAR, delay: time.get(node.id) ?? 0 }}
					>
						<text
							x={node.x + padding}
							y={node.y + node.height / 2}
							dominantBaseline="central"
							className="fill-gray-900"
						>
							{node.label}
						</text>
					</m.g>
				))}
			</svg>
			{error && <p className="font-mono text-[12px] text-red-600">{error}</p>}
		</div>
	);
}
