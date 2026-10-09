export type Rgb = readonly [number, number, number];

export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/** A point as fractions of the canvas box: `[0.5, 0.5]` is the centre. */
export type Anchor = readonly [number, number];

export const mix = (a: Rgb, b: Rgb, t: number): Rgb => [
	a[0] + (b[0] - a[0]) * t,
	a[1] + (b[1] - a[1]) * t,
	a[2] + (b[2] - a[2]) * t,
];

export function hex(value: string): Rgb {
	const n = Number.parseInt(value.replace("#", ""), 16);
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** What every effect takes for a colour: `"#e5343a"` or `[229, 52, 58]`. */
export type RgbInput = Rgb | string;

export const toRgb = (value: RgbInput): Rgb =>
	typeof value === "string" ? hex(value) : value;

/**
 * mulberry32 (Tommy Ettinger, public domain): a seeded stream, so an effect
 * replays identically for a given seed rather than drifting between reloads.
 */
export function seededRandom(seed: number): () => number {
	let s = seed >>> 0;
	return () => {
		s = (s + 0x6d2b79f5) >>> 0;
		let t = Math.imul(s ^ (s >>> 15), 1 | s);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/**
 * The grid an effect paints into. Every effect draws through these four calls
 * and nothing else, which is what lets one effect run on any renderer: the
 * dither renderer turns them into Bayer-thresholded pixels, another could turn
 * them into glyphs. Writes outside the grid are dropped.
 */
export interface Surface {
	readonly cols: number;
	readonly rows: number;
	clear(): void;
	/** A solid cell, source-over onto whatever is already there. */
	blend(x: number, y: number, color: Rgb, alpha: number): void;
	/** A field sample at `density` 0–1: heat, glow, a fading band. */
	dither(x: number, y: number, density: number, color: Rgb, gain?: number): void;
	/** A sparkle: the centre cell plus four arms that flare in at `arms` 0–1. */
	glint(x: number, y: number, color: Rgb, alpha: number, arms?: number): void;
}

export interface FxFrame {
	px: Surface;
	cols: number;
	rows: number;
	/** Seconds since the engine started. */
	t: number;
	/** Seconds since the previous frame, capped so a background tab can't jump. */
	dt: number;
	/** Eased 0–1 activation, driven by `setActive`. */
	intensity: number;
	reduced: boolean;
	rand: () => number;
}

export interface FxEffect<O = unknown> {
	resize(cols: number, rows: number, rand: () => number): void;
	/** Advance and paint. Return true when the surface holds a new frame. */
	step(frame: FxFrame): boolean;
	/** True once nothing is left to animate at the current intensity. */
	idle(): boolean;
	/**
	 * Apply changed options without a restart. Only the keys present have
	 * changed, and a key present but undefined goes back to its default. The
	 * effect decides what each change costs: most apply on the next frame, and
	 * one that sizes the simulation rebuilds just that part.
	 */
	set(options: O): void;
}

/** An effect's factory: `fire`, `rings`, and so on. */
export type FxFactory<O> = (options?: O) => FxEffect<O>;

/**
 * Merges `patch` over `current` key by key, sending a key that is present but
 * undefined back to its default. What an effect's `set` builds its options
 * with, so removing a prop behaves like never having passed it.
 */
export function assign<T extends object>(defaults: T, current: T, patch: Partial<T>): T {
	const next = { ...current };
	for (const key of Object.keys(patch) as (keyof T)[]) {
		next[key] = (patch[key] ?? defaults[key]) as T[keyof T];
	}
	return next;
}

/**
 * A running effect and the way to change it. A renderer runs `effect` and
 * subscribes, so `set` repaints even when the frame loop has parked: under
 * reduced motion, or after an ease-out.
 */
export interface Fx<O = unknown> {
	readonly effect: FxEffect<O>;
	/** Change options in place, without a re-render or a restart. */
	set(options: O): void;
	subscribe(listener: () => void): () => void;
}

/** Builds an effect and wraps it in an `Fx`. In React, `useFx` does this for you. */
export function createFx<O>(factory: FxFactory<O>, options?: O): Fx<O> {
	const effect = factory(options);
	const listeners = new Set<() => void>();
	return {
		effect,
		set(next) {
			effect.set(next);
			for (const listener of listeners) listener();
		},
		subscribe(listener) {
			listeners.add(listener);
			return () => listeners.delete(listener);
		},
	};
}

/** What a renderer hands the engine: somewhere to paint, and a way to show it. */
export interface Renderer {
	/**
	 * Fit the backing store to a CSS box. Returns the new surface, or null when
	 * the grid is unchanged and the effect should keep its state.
	 */
	resize(width: number, height: number): Surface | null;
	/** Put the surface's current contents on screen. */
	present(): void;
}

/**
 * Runs one effect against one renderer: eases `intensity` toward its target
 * and steps the effect on requestAnimationFrame only while something is
 * changing and the canvas is on screen. An idle or off-screen effect costs
 * nothing.
 */
export class FxEngine {
	private surface: Surface | null = null;
	private effect: FxEffect;
	private unsubscribe: () => void;
	private readonly rand: () => number;
	private raf = 0;
	private last = 0;
	private t = 0;
	private intensity = 0;
	private target = 0;
	private reduced = false;
	private hidden = false;

	constructor(
		private readonly renderer: Renderer,
		fx: Fx,
		{ seed = 1 }: { seed?: number } = {},
	) {
		this.rand = seededRandom(seed);
		this.effect = fx.effect;
		this.unsubscribe = fx.subscribe(this.wake);
	}

	resize(width: number, height: number) {
		const surface = this.renderer.resize(width, height);
		if (!surface) return;
		this.surface = surface;
		this.effect.resize(surface.cols, surface.rows, this.rand);
		this.wake();
	}

	setActive(on: boolean) {
		this.target = on ? 1 : 0;
		this.wake();
	}

	setReduced(reduced: boolean) {
		this.reduced = reduced;
		this.wake();
	}

	/**
	 * Pauses the loop while the canvas is off screen, and picks up where it
	 * left off when it comes back. Changes made meanwhile (`setActive`, `set`,
	 * a resize) are kept and applied then.
	 */
	setVisible(visible: boolean) {
		this.hidden = !visible;
		if (visible) {
			this.wake();
		} else if (this.raf) {
			cancelAnimationFrame(this.raf);
			this.raf = 0;
		}
	}

	setFx(fx: Fx) {
		this.unsubscribe();
		this.unsubscribe = fx.subscribe(this.wake);
		this.effect = fx.effect;
		if (this.surface) this.effect.resize(this.surface.cols, this.surface.rows, this.rand);
		this.wake();
	}

	destroy() {
		this.unsubscribe();
		if (this.raf) cancelAnimationFrame(this.raf);
		this.raf = 0;
	}

	private readonly wake = () => {
		if (this.raf || this.hidden) return;
		this.last = 0;
		this.raf = requestAnimationFrame(this.tick);
	};

	private readonly tick = (now: number) => {
		this.raf = 0;
		const px = this.surface;
		if (!px) return;
		const dt = this.last ? Math.min((now - this.last) / 1000, 0.1) : 1 / 60;
		this.last = now;
		this.t += dt;

		const ease = 1 - Math.exp(-dt * (this.reduced ? 30 : 8));
		this.intensity += (this.target - this.intensity) * ease;
		if (Math.abs(this.target - this.intensity) < 0.002) this.intensity = this.target;

		const painted = this.effect.step({
			px,
			cols: px.cols,
			rows: px.rows,
			t: this.t,
			dt,
			intensity: this.intensity,
			reduced: this.reduced,
			rand: this.rand,
		});
		if (painted) this.renderer.present();

		const settled = this.intensity === this.target;
		if (settled && this.effect.idle() && (this.target === 0 || this.reduced)) return;
		this.raf = requestAnimationFrame(this.tick);
	};
}
