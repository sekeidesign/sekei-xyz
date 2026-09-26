"use client";

import { animate, useMotionValue } from "motion/react";
import { type ComponentType, useCallback, useEffect, useRef } from "react";

/** 4×4 ordered-dither thresholds, the pattern shad-fx's effects fade through. */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(
	(v) => (v + 0.5) / 16,
);

/**
 * An icon drawn at `cells` px and scaled up without smoothing, so it's made of
 * the same squares as a dither canvas beside it. Each pixel's coverage is
 * weighed against the Bayer threshold, which gives the edges their dither and
 * lets `visible` resolve the icon in and out in the effects' own order.
 */
export function PixelIcon({
	Icon,
	color,
	visible,
	cells = 24,
	size = 24,
}: {
	Icon: ComponentType<{ size?: number }>;
	color: string;
	visible: boolean;
	cells?: number;
	size?: number;
}) {
	const sourceRef = useRef<HTMLSpanElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const coverage = useRef<Float32Array | null>(null);
	const level = useMotionValue(visible ? 1 : 0);

	const draw = useCallback(
		(amount: number) => {
			const ctx = canvasRef.current?.getContext("2d");
			const mask = coverage.current;
			if (!ctx || !mask) return;
			const image = ctx.createImageData(cells, cells);
			const r = Number.parseInt(color.slice(1, 3), 16);
			const g = Number.parseInt(color.slice(3, 5), 16);
			const b = Number.parseInt(color.slice(5, 7), 16);
			for (let y = 0; y < cells; y++) {
				for (let x = 0; x < cells; x++) {
					const i = y * cells + x;
					if (mask[i] * amount <= BAYER[(y % 4) * 4 + (x % 4)]) continue;
					image.data.set([r, g, b, 255], i * 4);
				}
			}
			ctx.putImageData(image, 0, 0);
		},
		[cells, color],
	);

	// The icon's own SVG, rendered hidden and read back, so any icon component
	// works without a raster copy of it.
	useEffect(() => {
		const svg = sourceRef.current?.querySelector("svg");
		if (!svg) return;
		const markup = new XMLSerializer().serializeToString(svg);
		const img = new Image();
		img.onload = () => {
			const scratch = document.createElement("canvas");
			scratch.width = cells;
			scratch.height = cells;
			const ctx = scratch.getContext("2d");
			if (!ctx) return;
			ctx.drawImage(img, 0, 0, cells, cells);
			const { data } = ctx.getImageData(0, 0, cells, cells);
			const mask = new Float32Array(cells * cells);
			for (let i = 0; i < mask.length; i++) mask[i] = data[i * 4 + 3] / 255;
			coverage.current = mask;
			draw(level.get());
		};
		img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
	}, [cells, draw, level]);

	useEffect(() => level.on("change", draw), [level, draw]);

	useEffect(() => {
		const controls = animate(level, visible ? 1 : 0, {
			duration: 0.3,
			ease: "easeOut",
		});
		return () => controls.stop();
	}, [level, visible]);

	return (
		<>
			<span ref={sourceRef} hidden>
				<Icon size={cells} />
			</span>
			<canvas
				ref={canvasRef}
				width={cells}
				height={cells}
				aria-hidden
				style={{ width: size, height: size, imageRendering: "pixelated" }}
			/>
		</>
	);
}
