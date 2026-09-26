export type Rgb = readonly [number, number, number];

export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/**
 * A point as fractions of the canvas box. A getter is re-read every frame, so
 * an effect can follow something that moves — a drag handle, a hovered element
 * — without being rebuilt and losing what it has already simulated.
 */
export type Anchor = readonly [number, number] | (() => readonly [number, number]);

export const resolveAnchor = (anchor: Anchor) =>
	typeof anchor === "function" ? anchor() : anchor;

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

export interface FxEffect {
	resize(cols: number, rows: number, rand: () => number): void;
	/** Advance and paint. Return true when the surface holds a new frame. */
	step(frame: FxFrame): boolean;
	/** True once nothing is left to animate at the current intensity. */
	idle(): boolean;
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
 * changing. An idle effect costs nothing.
 */
export class FxEngine {
	private surface: Surface | null = null;
	private readonly rand: () => number;
	private raf = 0;
	private last = 0;
	private t = 0;
	private intensity = 0;
	private target = 0;
	private reduced = false;

	constructor(
		private readonly renderer: Renderer,
		private effect: FxEffect,
		{ seed = 1 }: { seed?: number } = {},
	) {
		this.rand = seededRandom(seed);
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

	setEffect(effect: FxEffect) {
		this.effect = effect;
		if (this.surface) effect.resize(this.surface.cols, this.surface.rows, this.rand);
		this.wake();
	}

	destroy() {
		if (this.raf) cancelAnimationFrame(this.raf);
		this.raf = 0;
	}

	private wake() {
		if (this.raf) return;
		this.last = 0;
		this.raf = requestAnimationFrame(this.tick);
	}

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
