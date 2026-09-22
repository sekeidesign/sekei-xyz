"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";
import { type DitherEffect, DitherEngine } from "./engine";

export interface DitherCanvasProps {
	/** A new reference restarts the simulation; the canvas itself is kept. */
	effect: DitherEffect;
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
	const wrapRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const engineRef = useRef<DitherEngine | null>(null);
	const runningRef = useRef(effect);
	const reduced = usePrefersReducedMotion();

	// Only the options baked into the constructor rebuild the engine. `effect`,
	// `active` and `reduced` are seeded into a fresh one here and applied on
	// their own below, so listing them would tear down the canvas and its
	// observer on every change.
	// biome-ignore lint/correctness/useExhaustiveDependencies: see above
	useEffect(() => {
		const wrap = wrapRef.current;
		const canvas = canvasRef.current;
		if (!wrap || !canvas) return;
		const engine = new DitherEngine(canvas, effect, {
			cell,
			seed,
			maxCols,
			maxRows,
		});
		engineRef.current = engine;
		runningRef.current = effect;
		engine.resize(wrap.clientWidth, wrap.clientHeight);
		engine.setReduced(reduced);
		engine.setActive(active);
		const ro = new ResizeObserver(([entry]) => {
			const { width, height } = entry.contentRect;
			engine.resize(width, height);
		});
		ro.observe(wrap);
		return () => {
			ro.disconnect();
			engine.destroy();
			engineRef.current = null;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cell, seed, maxCols, maxRows]);

	useEffect(() => {
		if (runningRef.current === effect) return;
		runningRef.current = effect;
		engineRef.current?.setEffect(effect);
	}, [effect]);

	useEffect(() => {
		engineRef.current?.setReduced(reduced);
	}, [reduced]);

	useEffect(() => {
		engineRef.current?.setActive(active);
	}, [active]);

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
