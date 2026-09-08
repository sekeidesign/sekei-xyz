export type Rgb = readonly [number, number, number];

/** 4×4 Bayer thresholds in 0–1, indexed by `((y & 3) << 2) | (x & 3)`. */
export const BAYER4: readonly number[] = [
	0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5,
].map((v) => (v + 0.5) / 16);

export const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

/**
 * A point as fractions of the canvas box. A getter is read on every resize, so
 * an effect can anchor to something measured from the DOM.
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

/** xorshift32: a seeded stream so an effect replays identically for a given seed. */
export function xorshift32(seed: number): () => number {
	let s = seed || 0x9e3779b9;
	return () => {
		s ^= s << 13;
		s >>>= 0;
		s ^= s >>> 17;
		s ^= s << 5;
		s >>>= 0;
		return s / 0x100000000;
	};
}

/**
 * Pixel writer over one ImageData. Every write lands in a Uint32 view and the
 * frame is blitted with a single putImageData, which is what keeps a few
 * thousand cells a frame cheap — one fillRect per cell would not be.
 */
export class Painter {
	readonly image: ImageData;
	private readonly px: Uint32Array;

	constructor(
		readonly cols: number,
		readonly rows: number,
	) {
		this.image = new ImageData(cols, rows);
		this.px = new Uint32Array(this.image.data.buffer);
	}

	clear() {
		this.px.fill(0);
	}

	threshold(x: number, y: number) {
		return BAYER4[((y & 3) << 2) | (x & 3)];
	}

	inside(x: number, y: number) {
		return x >= 0 && y >= 0 && x < this.cols && y < this.rows;
	}

	set(x: number, y: number, [r, g, b]: Rgb, alpha: number) {
		if (!this.inside(x, y) || alpha <= 0) return;
		const a = Math.round(clamp01(alpha) * 255);
		this.px[y * this.cols + x] = ((a << 24) | (b << 16) | (g << 8) | r) >>> 0;
	}

	/** Source-over onto whatever is already in the cell. */
	blend(x: number, y: number, [r, g, b]: Rgb, alpha: number) {
		if (!this.inside(x, y) || alpha <= 0) return;
		const i = y * this.cols + x;
		const d = this.px[i];
		const da = (d >>> 24) / 255;
		const sa = clamp01(alpha);
		if (da === 0) {
			this.set(x, y, [r, g, b], sa);
			return;
		}
		const oa = sa + da * (1 - sa);
		const w = sa / oa;
		const nr = r * w + (d & 255) * (1 - w);
		const ng = g * w + ((d >>> 8) & 255) * (1 - w);
		const nb = b * w + ((d >>> 16) & 255) * (1 - w);
		const a = Math.round(oa * 255);
		this.px[i] = ((a << 24) | (nb << 16) | (ng << 8) | nr) >>> 0;
	}

	/**
	 * Ordered dither in one colour. A cell that clears the Bayer threshold is
	 * "lit"; one that doesn't keeps a faint tint of the same colour rather than
	 * a hole, so the falloff reads smooth and the background never punches
	 * through as white specks.
	 */
	dither(x: number, y: number, density: number, color: Rgb, gain = 1) {
		if (density <= 0.004) return;
		const d = clamp01(density);
		const lit = d > this.threshold(x, y);
		const alpha = (lit ? 0.35 + 0.65 * d : 0.12 * d) * gain;
		this.blend(x, y, color, alpha);
	}

	/** A sparkle: the centre pixel plus four arms that flare in at `arms` (0–1). */
	glint(x: number, y: number, color: Rgb, alpha: number, arms = 0) {
		this.blend(x, y, color, alpha);
		if (arms <= 0) return;
		const a = alpha * arms;
		this.blend(x - 1, y, color, a);
		this.blend(x + 1, y, color, a);
		this.blend(x, y - 1, color, a);
		this.blend(x, y + 1, color, a);
	}
}

export interface DitherFrame {
	px: Painter;
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

export interface DitherEffect {
	resize(cols: number, rows: number, rand: () => number): void;
	/** Advance and paint. Return true when the painter holds a new frame. */
	step(frame: DitherFrame): boolean;
	/** True once nothing is left to animate at the current intensity. */
	idle(): boolean;
}

export interface EngineOptions {
	/** CSS px per dither cell. */
	cell?: number;
	seed?: number;
	maxCols?: number;
	maxRows?: number;
}

/**
 * Owns the backing canvas for one effect: sizes it from the CSS box, eases
 * `intensity` toward its target and runs the effect on requestAnimationFrame
 * only while something is changing. An idle effect costs nothing.
 */
export class DitherEngine {
	private painter: Painter | null = null;
	private readonly ctx: CanvasRenderingContext2D;
	private readonly bloomCtx: CanvasRenderingContext2D | null;
	private readonly cell: number;
	private readonly maxCols: number;
	private readonly maxRows: number;
	private readonly rand: () => number;
	private raf = 0;
	private last = 0;
	private t = 0;
	private intensity = 0;
	private target = 0;
	private reduced = false;

	constructor(
		private readonly canvas: HTMLCanvasElement,
		bloom: HTMLCanvasElement | null,
		private effect: DitherEffect,
		{ cell = 3, seed = 1, maxCols = 640, maxRows = 400 }: EngineOptions = {},
	) {
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("DitherEngine: 2d context unavailable");
		this.ctx = ctx;
		this.bloomCtx = bloom?.getContext("2d") ?? null;
		this.cell = cell;
		this.maxCols = maxCols;
		this.maxRows = maxRows;
		this.rand = xorshift32(seed);
	}

	resize(width: number, height: number) {
		const cols = Math.min(this.maxCols, Math.max(4, Math.round(width / this.cell)));
		const rows = Math.min(this.maxRows, Math.max(4, Math.round(height / this.cell)));
		if (this.painter && this.painter.cols === cols && this.painter.rows === rows) return;
		this.canvas.width = cols;
		this.canvas.height = rows;
		if (this.bloomCtx) {
			this.bloomCtx.canvas.width = cols;
			this.bloomCtx.canvas.height = rows;
		}
		this.painter = new Painter(cols, rows);
		this.effect.resize(cols, rows, this.rand);
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

	setEffect(effect: DitherEffect) {
		this.effect = effect;
		if (this.painter) effect.resize(this.painter.cols, this.painter.rows, this.rand);
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
		const px = this.painter;
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
		if (painted) {
			this.ctx.putImageData(px.image, 0, 0);
			if (this.bloomCtx) {
				this.bloomCtx.clearRect(0, 0, px.cols, px.rows);
				this.bloomCtx.drawImage(this.canvas, 0, 0);
			}
		}

		const settled = this.intensity === this.target;
		if (settled && this.effect.idle() && (this.target === 0 || this.reduced)) return;
		this.raf = requestAnimationFrame(this.tick);
	};
}
