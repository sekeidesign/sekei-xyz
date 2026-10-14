"use client";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";
import type { Fx } from "../engine";
import { useFxEngine } from "../use-fx-engine";
import { DitherRenderer } from "./painter";

export interface DitherCanvasProps {
	/** From `useFx`. A different effect starts from scratch; the canvas is kept. */
	effect: Fx;
	/** Eases the effect in and out. Defaults to on. */
	active?: boolean;
	cell?: number;
	seed?: number;
	/** Ceiling on the backing grid, so a large box can't cost a large frame. */
	maxCols?: number;
	maxRows?: number;
	className?: string;
}

/**
 * Fills its positioned parent with a pixelated dither canvas running `effect`.
 * The backing resolution is the box divided by `cell`, scaled back up without
 * smoothing, so every dither cell is a crisp square of `cell` CSS px.
 */
export function DitherCanvas({
	effect,
	active = true,
	cell = 2,
	seed = 1,
	maxCols,
	maxRows,
	className,
}: DitherCanvasProps) {
	const reduced = usePrefersReducedMotion();
	const { wrapRef, canvasRef } = useFxEngine(
		(canvas) => new DitherRenderer(canvas, { cell, maxCols, maxRows }),
		{ effect, active, reduced, seed },
		[cell, maxCols, maxRows],
	);

	return (
		<div
			ref={wrapRef}
			aria-hidden
			className={cn(
				"pointer-events-none absolute inset-0 overflow-hidden",
				className,
			)}
		>
			<canvas
				ref={canvasRef}
				className="absolute inset-0 size-full"
				style={{ imageRendering: "pixelated" }}
			/>
		</div>
	);
}
