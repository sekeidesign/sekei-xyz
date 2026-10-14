import { type DependencyList, useEffect, useRef } from "react";
import { type Fx, FxEngine, type Renderer } from "./engine";

export interface FxEngineOptions {
	effect: Fx;
	active: boolean;
	reduced: boolean;
	seed: number;
}

/**
 * What every renderer's canvas shares: builds an engine around `create`'s
 * renderer, sizes it to the wrapper, pauses it off screen, and keeps
 * `effect`, `active` and `reduced` in step without rebuilding. Only `seed`
 * and `deps`, what the renderer is built from, rebuild it.
 */
export function useFxEngine<R extends Renderer>(
	create: (canvas: HTMLCanvasElement, wrap: HTMLDivElement) => R,
	{ effect, active, reduced, seed }: FxEngineOptions,
	deps: DependencyList,
) {
	const wrapRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const engineRef = useRef<FxEngine | null>(null);
	const rendererRef = useRef<R | null>(null);
	const runningRef = useRef(effect);

	// biome-ignore lint/correctness/useExhaustiveDependencies: the rest apply in place below
	useEffect(() => {
		const wrap = wrapRef.current;
		const canvas = canvasRef.current;
		if (!wrap || !canvas) return;
		const renderer = create(canvas, wrap);
		const engine = new FxEngine(renderer, effect, { seed });
		rendererRef.current = renderer;
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
		// The margin starts a canvas just before it scrolls in.
		const io = new IntersectionObserver(
			([entry]) => engine.setVisible(entry.isIntersecting),
			{ rootMargin: "100px" },
		);
		io.observe(wrap);
		return () => {
			ro.disconnect();
			io.disconnect();
			engine.destroy();
			engineRef.current = null;
			rendererRef.current = null;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [seed, ...deps]);

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

	return { wrapRef, canvasRef, engineRef, rendererRef };
}
