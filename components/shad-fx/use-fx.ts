import { useEffect, useRef, useState } from "react";
import { createFx, type Fx, type FxFactory } from "./engine";

const same = (a: unknown, b: unknown): boolean =>
	Object.is(a, b) ||
	(Array.isArray(a) &&
		Array.isArray(b) &&
		a.length === b.length &&
		a.every((v, i) => same(v, b[i])));

/**
 * Builds an effect once and keeps it in step with `options`, render by render,
 * without restarting it: pass options as plain props, inline arrays and all.
 * Hand the result to any renderer's canvas. For something that changes every
 * frame, such as a pointer position, call `fx.set` from the handler instead of
 * re-rendering.
 *
 * A different `factory` builds a new effect, which starts from scratch.
 */
export function useFx<O>(factory: FxFactory<O>, options?: NoInfer<O>): Fx<O> {
	const [built, setBuilt] = useState(() => ({ factory, fx: createFx(factory, options) }));
	let { fx } = built;
	if (built.factory !== factory) {
		fx = createFx(factory, options);
		setBuilt({ factory, fx });
	}

	const last = useRef({ fx, options });
	// Every render, after commit: only the keys whose values changed reach the
	// effect, so an unchanged inline `colors` array costs nothing, and a value
	// set through `fx.set` holds until its prop changes. A new effect was built
	// with these options, so it is compared against them, not the old one's.
	useEffect(() => {
		const seen = last.current.fx === fx ? last.current.options : options;
		const prev = (seen ?? {}) as Record<string, unknown>;
		const next = (options ?? {}) as Record<string, unknown>;
		last.current = { fx, options };
		const patch: Record<string, unknown> = {};
		let changed = false;
		for (const key of new Set([...Object.keys(prev), ...Object.keys(next)])) {
			if (same(prev[key], next[key])) continue;
			patch[key] = next[key];
			changed = true;
		}
		if (changed) fx.set(patch as O);
	});

	return fx;
}
