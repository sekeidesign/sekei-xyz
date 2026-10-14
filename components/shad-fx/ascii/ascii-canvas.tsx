"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";
import { type Fx, FxEngine } from "../engine";
import { AsciiRenderer, SYSTEM_MONO } from "./painter";

export interface AsciiCanvasProps {
	/** From `useFx`. A different effect starts from scratch; the canvas is kept. */
	effect: Fx;
	/** Eases the effect in and out. Defaults to on. */
	active?: boolean;
	/**
	 * Any CSS `font-family`, by name: `"'Geist Mono', monospace"`. A `var()`
	 * works too. Defaults to the system monospace, so nothing is downloaded. A
	 * web font must be loaded by the page; the canvas redraws once it lands.
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

/**
 * Fills its positioned parent with a canvas that draws `effect` as coloured
 * glyphs in `fontFamily`.
 */
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
	const wrapRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const engineRef = useRef<FxEngine | null>(null);
	const rendererRef = useRef<AsciiRenderer | null>(null);
	const runningRef = useRef(effect);
	const fontRef = useRef(fontFamily);
	const reduced = usePrefersReducedMotion();

	// A canvas font can't hold `var()`, so the family is set on the wrapper and
	// read back computed. Measured before a web font has loaded, the cell is
	// the fallback's, so it is measured again once `document.fonts` has it.
	// Bumping `pending` drops the reload of a family that has since changed.
	const pending = useRef(0);
	const refont = () => {
		const wrap = wrapRef.current;
		const renderer = rendererRef.current;
		const engine = engineRef.current;
		if (!wrap || !renderer || !engine) return;
		const apply = () => {
			renderer.setFont(getComputedStyle(wrap).fontFamily || SYSTEM_MONO);
			engine.resize(wrap.clientWidth, wrap.clientHeight);
		};
		apply();
		const token = ++pending.current;
		document.fonts?.load(renderer.font).then(() => {
			if (token === pending.current && rendererRef.current === renderer) apply();
		}, () => {});
	};

	// As in DitherCanvas: only what the renderer is built from rebuilds the
	// engine. `effect`, `active`, `reduced`, `ramp` and `fontFamily` are seeded
	// into a fresh one here and applied on their own below.
	// biome-ignore lint/correctness/useExhaustiveDependencies: see above
	useEffect(() => {
		const wrap = wrapRef.current;
		const canvas = canvasRef.current;
		if (!wrap || !canvas) return;
		const renderer = new AsciiRenderer(canvas, {
			fontSize,
			fontFamily: getComputedStyle(wrap).fontFamily || SYSTEM_MONO,
			ramp,
			maxCols,
			maxRows,
		});
		const engine = new FxEngine(renderer, effect, { seed });
		rendererRef.current = renderer;
		engineRef.current = engine;
		runningRef.current = effect;
		fontRef.current = fontFamily;
		engine.resize(wrap.clientWidth, wrap.clientHeight);
		engine.setReduced(reduced);
		engine.setActive(active);
		const ro = new ResizeObserver(([entry]) => {
			const { width, height } = entry.contentRect;
			engine.resize(width, height);
		});
		ro.observe(wrap);
		const io = new IntersectionObserver(
			([entry]) => engine.setVisible(entry.isIntersecting),
			{ rootMargin: "100px" },
		);
		io.observe(wrap);
		refont();
		return () => {
			ro.disconnect();
			io.disconnect();
			engine.destroy();
			engineRef.current = null;
			rendererRef.current = null;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fontSize, seed, maxCols, maxRows]);

	useEffect(() => {
		if (runningRef.current === effect) return;
		runningRef.current = effect;
		engineRef.current?.setFx(effect);
	}, [effect]);

	useEffect(() => {
		engineRef.current?.setReduced(reduced);
	}, [reduced]);

	useEffect(() => {
		engineRef.current?.setActive(active);
	}, [active]);

	useEffect(() => {
		rendererRef.current?.setRamp(ramp ?? "");
	}, [ramp]);

	// In place, so changing the font only restarts the effect when the new
	// glyph cell changes the size of the grid.
	// biome-ignore lint/correctness/useExhaustiveDependencies: fontFamily is the trigger
	useEffect(() => {
		if (fontRef.current === fontFamily) return;
		fontRef.current = fontFamily;
		refont();
	}, [fontFamily]);

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
