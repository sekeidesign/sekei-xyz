"use client";

import { useEffect, useRef } from "react";
import { cn } from "../cn";
import { usePrefersReducedMotion } from "../use-prefers-reduced-motion";
import { type BloomInput, bloomStyle } from "./bloom";
import { type DitherEffect, DitherEngine } from "./engine";

export interface DitherCanvasProps {
	/** Keep this reference stable (useMemo / module scope); a new one restarts the engine. */
	effect: DitherEffect;
	active: boolean;
	cell?: number;
	seed?: number;
	bloom?: BloomInput;
	className?: string;
}

/**
 * Fills its positioned parent with a pixelated dither canvas running `effect`.
 * The backing resolution is the box divided by `cell`, scaled back up without
 * smoothing, so every dither cell is a crisp square of `cell` CSS px.
 */
export function DitherCanvas({
	effect,
	active,
	cell = 3,
	seed = 1,
	bloom = "off",
	className,
}: DitherCanvasProps) {
	const wrapRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const bloomRef = useRef<HTMLCanvasElement>(null);
	const engineRef = useRef<DitherEngine | null>(null);
	const reduced = usePrefersReducedMotion();
	const glow = bloomStyle(bloom);
	const hasBloom = glow !== null;

	useEffect(() => {
		const wrap = wrapRef.current;
		const canvas = canvasRef.current;
		if (!wrap || !canvas) return;
		const engine = new DitherEngine(canvas, bloomRef.current, effect, { cell, seed });
		engineRef.current = engine;
		engine.resize(wrap.clientWidth, wrap.clientHeight);
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
	}, [effect, cell, seed, hasBloom]);

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
			className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
		>
			{glow && (
				<canvas
					ref={bloomRef}
					className="absolute inset-0 size-full"
					style={glow}
				/>
			)}
			<canvas
				ref={canvasRef}
				className="absolute inset-0 size-full"
				style={{ imageRendering: "pixelated" }}
			/>
		</div>
	);
}
