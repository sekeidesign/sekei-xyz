"use client";

import { useEffect } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";
import type { Fx } from "../engine";
import { useFxEngine } from "../use-fx-engine";
import { AsciiRenderer, SYSTEM_MONO } from "./painter";

export interface AsciiCanvasProps {
	/** From `useFx`. A different effect starts from scratch; the canvas is kept. */
	effect: Fx;
	/** Eases the effect in and out. Defaults to on. */
	active?: boolean;
	/**
	 * Any CSS `font-family`, `var()` included. Defaults to the system monospace.
	 * Load a web font as the page already does; the canvas redraws once it lands.
	 */
	fontFamily?: string;
	/** CSS px. A glyph cell is one advance wide and two tall. */
	fontSize?: number;
	/** Lightest to densest, for evenly lit glyphs. Defaults to `.:-=+*#%@`. */
	ramp?: string;
	seed?: number;
	/** Ceiling on the glyph grid, so a large box can't cost a large frame. */
	maxCols?: number;
	maxRows?: number;
	className?: string;
}

// A canvas font can't hold `var()`, so the family is read back computed from the wrapper.
const computedFamily = (wrap: HTMLElement) => getComputedStyle(wrap).fontFamily || SYSTEM_MONO;

/** Fills its positioned parent with a canvas drawing `effect` as coloured glyphs. */
export function AsciiCanvas({
	effect,
	active = true,
	fontFamily = SYSTEM_MONO,
	fontSize = 10,
	ramp,
	seed = 1,
	maxCols,
	maxRows,
	className,
}: AsciiCanvasProps) {
	const reduced = usePrefersReducedMotion();
	const { wrapRef, canvasRef, engineRef, rendererRef } = useFxEngine(
		(canvas, wrap) =>
			new AsciiRenderer(canvas, { fontFamily: computedFamily(wrap), fontSize, ramp, maxCols, maxRows }),
		{ effect, active, reduced, seed },
		[maxCols, maxRows],
	);

	useEffect(() => {
		rendererRef.current?.setRamp(ramp ?? "");
	}, [ramp, rendererRef]);

	// Re-runs after a rebuild, so a web font still loading reaches the new renderer.
	// biome-ignore lint/correctness/useExhaustiveDependencies: see above
	useEffect(() => {
		const wrap = wrapRef.current;
		const renderer = rendererRef.current;
		const engine = engineRef.current;
		if (!wrap || !renderer || !engine) return;
		let live = true;
		const family = computedFamily(wrap);
		const apply = (force: boolean) => {
			renderer.setFont(family, fontSize, force);
			engine.resize(wrap.clientWidth, wrap.clientHeight);
		};
		apply(false);
		const fonts = document.fonts;
		if (fonts && !fonts.check(renderer.font)) {
			fonts.load(renderer.font).then(() => live && apply(true), () => {});
		}
		return () => {
			live = false;
		};
	}, [fontFamily, fontSize, seed, maxCols, maxRows]);

	return (
		<div
			ref={wrapRef}
			aria-hidden
			className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
			style={{ fontFamily }}
		>
			<canvas ref={canvasRef} className="absolute top-0 left-0" />
		</div>
	);
}
