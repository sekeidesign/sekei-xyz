import { clamp01, type Renderer, type Rgb, type Surface } from "../engine";

/**
 * 4×4 Bayer thresholds in 0–1, indexed by `((y & 3) << 2) | (x & 3)`.
 *
 * The ordered-dither rendering here — this matrix, the low-resolution backing
 * canvas scaled up pixelated, and the two-alpha-tier fill — derives from
 * dither-kit (MIT, https://github.com/Boring-Software-Inc/dither-kit). The shadcn
 * CLI drops a file's leading comment on install, so the notice lives here.
 * Full attribution: https://github.com/sekeidesign/shad-fx/blob/main/NOTICE.md
 */
export const BAYER4: readonly number[] = [
	0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5,
].map((v) => (v + 0.5) / 16);

/**
 * Pixel writer over one ImageData. Every write lands in a Uint32 view and the
 * frame is blitted with a single putImageData, which is what keeps a few
 * thousand cells a frame cheap — one fillRect per cell would not be.
 */
export class Painter implements Surface {
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
	 * Ordered dither in one colour, at two alpha tiers rather than one alpha and
	 * a hole. Every cell in range is painted; clearing the Bayer threshold only
	 * decides whether it lands at full strength or a faint one. Punching actual
	 * holes makes the falloff crawl, and on a pale surface the gaps read as
	 * white specks instead of a fade.
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

export interface DitherOptions {
	/** CSS px per dither cell. */
	cell?: number;
	maxCols?: number;
	maxRows?: number;
}

/**
 * Sizes a canvas's backing store to the CSS box divided by `cell`, so each
 * cell is one pixel scaled up without smoothing, and blits the `Painter` onto
 * it in one call.
 */
export class DitherRenderer implements Renderer {
	private painter: Painter | null = null;
	private readonly ctx: CanvasRenderingContext2D;
	private readonly cell: number;
	private readonly maxCols: number;
	private readonly maxRows: number;

	constructor(
		private readonly canvas: HTMLCanvasElement,
		{ cell = 2, maxCols = 640, maxRows = 400 }: DitherOptions = {},
	) {
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("DitherRenderer: 2d context unavailable");
		this.ctx = ctx;
		this.cell = cell;
		this.maxCols = maxCols;
		this.maxRows = maxRows;
	}

	resize(width: number, height: number) {
		const cols = Math.min(this.maxCols, Math.max(4, Math.round(width / this.cell)));
		const rows = Math.min(this.maxRows, Math.max(4, Math.round(height / this.cell)));
		if (this.painter && this.painter.cols === cols && this.painter.rows === rows) return null;
		this.canvas.width = cols;
		this.canvas.height = rows;
		this.painter = new Painter(cols, rows);
		return this.painter;
	}

	present() {
		if (this.painter) this.ctx.putImageData(this.painter.image, 0, 0);
	}
}
