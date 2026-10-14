import { blendOver, clamp01, type Renderer, type Rgb, type Surface } from "../engine";

/** The system monospace, so nothing is downloaded. Tailwind's `font-mono` stack. */
export const SYSTEM_MONO =
	'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

/** Lightest to densest, for a glyph whose two halves are about equally lit. */
export const ASCII_RAMP = ".:-=+*#%@";

// Atlas slots: 0 is blank, then the half-lit shapes, the two glints, and the ramp.
const SHAPES = "'\"._+*";
const TOP_LIGHT = 1;
const TOP_HEAVY = 2;
const BOTTOM_LIGHT = 3;
const BOTTOM_HEAVY = 4;
const GLINT_SMALL = 5;
const GLINT_BIG = 6;
const RAMP_START = 7;

const glyphString = (ramp: string) => ` ${SHAPES}${ramp}`;

/**
 * Glyph opacity by coverage. The glyph already carries density, so a square
 * root keeps faint glyphs readable while still fading to nothing.
 */
const OPACITY = Uint8Array.from({ length: 256 }, (_, a) => Math.round(255 * Math.sqrt(a / 255)));

/**
 * Glyph index for every pair of half coverages, each quantised to 16 levels:
 * `lut[(top >> 4) << 4 | (bottom >> 4)]`.
 */
export function glyphTable(ramp: string): Uint8Array {
	const n = ramp.length;
	const lut = new Uint8Array(256);
	const level = (q: number) => (q === 0 ? 0 : (q + 0.5) / 16);
	for (let qt = 0; qt < 16; qt++) {
		for (let qb = 0; qb < 16; qb++) {
			const t = level(qt);
			const b = level(qb);
			const hi = Math.max(t, b);
			if (hi === 0) continue;
			let k: number;
			if (Math.min(t, b) < hi * 0.25) {
				// One half carries the cell, so say which: `'` above the middle, `.` below.
				k = t > b ? (hi < 0.5 ? TOP_LIGHT : TOP_HEAVY) : hi < 0.5 ? BOTTOM_LIGHT : BOTTOM_HEAVY;
			} else {
				k = RAMP_START + Math.min(n - 1, Math.floor(((t + b) / 2) * n));
			}
			lut[(qt << 4) | qb] = k;
		}
	}
	return lut;
}

/**
 * The surface an effect paints into, at two square samples per glyph, one
 * per half. Glyphs are about twice as tall as wide, so this keeps the
 * effect's cells square, and the two halves let a glyph take a shape.
 */
export class AsciiPainter implements Surface {
	/** Sample rows: two per glyph row. */
	readonly rows: number;
	readonly px: Uint32Array;
	/** A `glint`'s glyph per glyph cell, 0 where there is none. */
	readonly marks: Uint8Array;

	constructor(
		readonly cols: number,
		/** Glyph rows. */
		readonly lines: number,
	) {
		this.rows = lines * 2;
		this.px = new Uint32Array(cols * this.rows);
		this.marks = new Uint8Array(cols * lines);
	}

	clear() {
		this.px.fill(0);
		this.marks.fill(0);
	}

	/** Source-over onto whatever is already in the sample. */
	blend(x: number, y: number, color: Rgb, alpha: number) {
		if (x < 0 || y < 0 || x >= this.cols || y >= this.rows || alpha <= 0) return;
		blendOver(this.px, y * this.cols + x, color, alpha);
	}

	/** Density is coverage: the glyph ramp does the dithering. */
	dither(x: number, y: number, density: number, color: Rgb, gain = 1) {
		if (density <= 0.004) return;
		this.blend(x, y, color, clamp01(density) * gain);
	}

	/** A sparkle is a glyph: as the arms flare it turns into `+`, then `*`. */
	glint(x: number, y: number, color: Rgb, alpha: number, arms = 0) {
		this.blend(x, y, color, alpha);
		if (arms <= 0 || x < 0 || y < 0 || x >= this.cols || y >= this.rows) return;
		const i = (y >> 1) * this.cols + x;
		const k = arms > 0.5 ? GLINT_BIG : GLINT_SMALL;
		if (k > this.marks[i]) this.marks[i] = k;
	}

	/**
	 * Folds each pair of samples into a glyph from `lut` and one colour, the
	 * halves mixed by coverage. Blank cells leave `colors` untouched. Returns
	 * how many cells are lit.
	 */
	compose(lut: Uint8Array, glyphs: Uint8Array, colors: Uint32Array): number {
		const { cols, lines, px, marks } = this;
		let lit = 0;
		for (let gy = 0, i = 0; gy < lines; gy++) {
			let s = gy * 2 * cols;
			for (let gx = 0; gx < cols; gx++, i++, s++) {
				const top = px[s];
				const bottom = px[s + cols];
				const at = top >>> 24;
				const ab = bottom >>> 24;
				let k = lut[((at >> 4) << 4) | (ab >> 4)];
				if (k === 0) {
					glyphs[i] = 0;
					continue;
				}
				if (marks[i]) k = marks[i];
				glyphs[i] = k;
				lit++;
				let rgb: number;
				if (ab === 0) rgb = top & 0xffffff;
				else if (at === 0) rgb = bottom & 0xffffff;
				else {
					const sum = at + ab;
					const r = ((top & 255) * at + (bottom & 255) * ab) / sum;
					const g = (((top >>> 8) & 255) * at + ((bottom >>> 8) & 255) * ab) / sum;
					const b = (((top >>> 16) & 255) * at + ((bottom >>> 16) & 255) * ab) / sum;
					rgb = (b << 16) | (g << 8) | r;
				}
				colors[i] = ((OPACITY[at > ab ? at : ab] << 24) | rgb) >>> 0;
			}
		}
		return lit;
	}
}

export interface AsciiOptions {
	/** CSS px. A glyph cell is one advance wide and two tall. */
	fontSize?: number;
	/** A resolved family: no `var()`. */
	fontFamily?: string;
	/** Lightest to densest. */
	ramp?: string;
	maxCols?: number;
	maxRows?: number;
}

/**
 * Draws an `AsciiPainter` as glyphs. Each glyph is rendered once, white, into
 * an atlas; a frame blits one slot per lit cell, then tints them all at once
 * with a one-pixel-per-glyph colour canvas scaled over them, `source-in`.
 */
export class AsciiRenderer implements Renderer {
	private painter: AsciiPainter | null = null;
	private readonly ctx: CanvasRenderingContext2D;
	private readonly atlas: HTMLCanvasElement;
	private readonly atlasCtx: CanvasRenderingContext2D;
	private readonly tint: HTMLCanvasElement;
	private readonly tintCtx: CanvasRenderingContext2D;
	private colors: ImageData | null = null;
	private colors32 = new Uint32Array(0);
	private glyphs = new Uint8Array(0);
	private lut: Uint8Array = new Uint8Array(0);
	private ramp = "";
	private fontFamily: string;
	private fontSize: number;
	private readonly maxCols: number;
	private readonly maxRows: number;
	/** Glyph cell in device px, and the ratio it was measured at. 0 until measured. */
	private cw = 0;
	private ch = 0;
	private dpr = 0;

	constructor(
		private readonly canvas: HTMLCanvasElement,
		{ fontSize = 10, fontFamily = SYSTEM_MONO, ramp = "", maxCols = 320, maxRows = 160 }: AsciiOptions = {},
	) {
		this.atlas = document.createElement("canvas");
		this.tint = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const atlasCtx = this.atlas.getContext("2d");
		const tintCtx = this.tint.getContext("2d");
		if (!ctx || !atlasCtx || !tintCtx) throw new Error("AsciiRenderer: 2d context unavailable");
		this.ctx = ctx;
		this.atlasCtx = atlasCtx;
		this.tintCtx = tintCtx;
		this.fontSize = fontSize;
		this.fontFamily = fontFamily;
		this.maxCols = maxCols;
		this.maxRows = maxRows;
		this.setRamp(ramp);
	}

	/** The CSS font string, for `document.fonts`. */
	get font() {
		return `${this.fontSize}px ${this.fontFamily}`;
	}

	resize(width: number, height: number) {
		const dpr = globalThis.devicePixelRatio || 1;
		const measured = dpr !== this.dpr || !this.cw;
		if (measured) {
			this.dpr = dpr;
			this.measure();
		}
		// Rounded up: the last glyph overhangs the box and is clipped, not a gap.
		const cols = Math.min(this.maxCols, Math.max(2, Math.ceil((width * dpr) / this.cw)));
		const lines = Math.min(this.maxRows, Math.max(2, Math.ceil((height * dpr) / this.ch)));
		const same = this.painter?.cols === cols && this.painter.lines === lines;
		if (measured || !same) this.fit(cols, lines);
		if (same) {
			// The effect keeps its state; repaint the canvas `fit` just cleared.
			if (measured) this.present();
			return null;
		}
		this.painter = new AsciiPainter(cols, lines);
		this.glyphs = new Uint8Array(cols * lines);
		this.tint.width = cols;
		this.tint.height = lines;
		this.colors = this.tintCtx.createImageData(cols, lines);
		this.colors32 = new Uint32Array(this.colors.data.buffer);
		return this.painter;
	}

	/** Re-measures on the next `resize` if the font changed, or with `force` once a web font loads. */
	setFont(family: string, size: number, force = false) {
		if (!force && family === this.fontFamily && size === this.fontSize) return;
		this.fontFamily = family;
		this.fontSize = size;
		this.cw = 0;
	}

	setRamp(ramp: string) {
		const next = ramp || ASCII_RAMP;
		if (next === this.ramp) return;
		this.ramp = next;
		this.lut = glyphTable(next);
		this.draw();
		this.present();
	}

	present() {
		const p = this.painter;
		const colors = this.colors;
		if (!p || !colors) return;
		const { ctx, atlas, cw, ch, glyphs } = this;
		const w = p.cols * cw;
		const h = p.lines * ch;
		ctx.globalCompositeOperation = "source-over";
		ctx.clearRect(0, 0, w, h);
		if (p.compose(this.lut, glyphs, this.colors32) === 0) return;
		for (let i = 0, y = 0; y < h; y += ch) {
			for (let x = 0; x < w; x += cw, i++) {
				const k = glyphs[i];
				if (k) ctx.drawImage(atlas, k * cw, 0, cw, ch, x, y, cw, ch);
			}
		}
		this.tintCtx.putImageData(colors, 0, 0);
		ctx.globalCompositeOperation = "source-in";
		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(this.tint, 0, 0, w, h);
		ctx.globalCompositeOperation = "source-over";
	}

	private get deviceFont() {
		return `${this.fontSize * this.dpr}px ${this.fontFamily}`;
	}

	/** Snaps the glyph cell to whole device px, so every blit lands on the grid. */
	private measure() {
		this.atlasCtx.font = this.deviceFont;
		this.cw = Math.max(1, Math.round(this.atlasCtx.measureText("M").width));
		this.ch = this.cw * 2;
		this.draw();
	}

	/** Every glyph once, centred and clipped to its own slot. */
	private draw() {
		const { atlas, atlasCtx: ctx, cw, ch } = this;
		if (!cw) return;
		const glyphs = glyphString(this.ramp);
		atlas.width = glyphs.length * cw; // resets the context
		atlas.height = ch;
		ctx.font = this.deviceFont;
		ctx.fillStyle = "#fff";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		for (let k = 1; k < glyphs.length; k++) {
			ctx.save();
			ctx.beginPath();
			ctx.rect(k * cw, 0, cw, ch);
			ctx.clip();
			ctx.fillText(glyphs[k], k * cw + cw / 2, ch / 2);
			ctx.restore();
		}
	}

	/** Sizing the backing store clears it. */
	private fit(cols: number, lines: number) {
		const w = cols * this.cw;
		const h = lines * this.ch;
		this.canvas.width = w;
		this.canvas.height = h;
		this.canvas.style.width = `${w / this.dpr}px`;
		this.canvas.style.height = `${h / this.dpr}px`;
	}
}
