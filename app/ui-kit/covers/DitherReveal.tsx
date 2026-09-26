"use client";

import { animate, useMotionValue } from "motion/react";
import { type ReactNode, useEffect, useRef } from "react";

/** 4×4 ordered-dither thresholds, the pattern shad-fx's effects fade through. */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

/**
 * One tile per coverage level, 0 to 16 of 16 cells. SVG rather than canvas so
 * it builds on the server too, and crispEdges so the cells stay square.
 */
const TILES = Array.from({ length: 17 }, (_, level) => {
	const cells = BAYER.flatMap((rank, i) =>
		rank < level
			? [`<rect x="${i % 4}" y="${Math.floor(i / 4)}" width="1" height="1"/>`]
			: [],
	).join("");
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4" shape-rendering="crispEdges">${cells}</svg>`;
	return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
});

/**
 * Shows and hides its children through an ordered-dither mask, so they resolve
 * in and out the way a dither effect fades. Fully shown, the mask comes off and
 * the children render untouched.
 */
export function DitherReveal({
	visible,
	children,
	/** CSS px per dither cell; 2 matches DitherCanvas's default. */
	cell = 2,
	duration = 0.3,
}: {
	visible: boolean;
	children: ReactNode;
	cell?: number;
	duration?: number;
}) {
	const ref = useRef<HTMLSpanElement>(null);
	const level = useMotionValue(visible ? 16 : 0);

	useEffect(() => {
		const paint = (value: number) => {
			const node = ref.current;
			if (!node) return;
			const step = Math.round(value);
			node.style.visibility = step === 0 ? "hidden" : "";
			const mask = step === 16 ? "" : TILES[step];
			node.style.maskImage = mask;
			node.style.webkitMaskImage = mask;
		};
		paint(level.get());
		const unsubscribe = level.on("change", paint);
		return () => unsubscribe();
	}, [level]);

	useEffect(() => {
		const controls = animate(level, visible ? 16 : 0, {
			duration,
			ease: "linear",
		});
		return () => controls.stop();
	}, [level, visible, duration]);

	return (
		<span
			ref={ref}
			style={{
				maskSize: `${cell * 4}px`,
				WebkitMaskSize: `${cell * 4}px`,
				maskRepeat: "repeat",
			}}
			className="flex"
		>
			{children}
		</span>
	);
}
