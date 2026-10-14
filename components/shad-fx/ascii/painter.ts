import { clamp01, type Renderer, type Rgb, type Surface } from "../engine";

/**
 * The default font: whatever monospace the system already has, so nothing is
 * downloaded. The same stack as Tailwind's `font-mono`.
 */
export const SYSTEM_MONO =
	'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

/** Lightest to densest, for a glyph whose two halves are about equally lit. */
export const ASCII_RAMP = ".:-=+*#%@";

/**
 * Glyph indices fixed ahead of the ramp: 0 is a blank cell, then the four
 * shapes a half-lit glyph takes, then the two a `glint` takes. The ramp
 * follows from `RAMP_START`.
 */
const SHAPES = "'\"._+*";
const TOP_LIGHT = 1;
const TOP_HEAVY = 2;
const BOTTOM_LIGHT = 3;
const BOTTOM_HEAVY = 4;
const GLINT_SMALL = 5;
const GLINT_BIG = 6;
const RAMP_START = 7;

/** The atlas, in glyph-index order. */
const glyphString = (ramp: string) => ` ${SHAPES}${ramp}`;

/**
 * Glyph opacity by coverage byte. The glyph already says how dense the cell
 * is, so a square root lifts faint glyphs enough to read while still fading
 * to nothing, rather than popping out at the bottom of the ramp.
 */
const OPACITY = Uint8Array.from({ length: 256 }, (_, a) => Math.round(255 * Math.sqrt(a / 255)));

/**
 * Glyph index for every pair of half coverages, each quantised to 16 levels:
 * `lut[(top >> 4) << 4 | (bottom >> 4)]`. A frame then picks each glyph with
 * one table read.
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
				// One half carries the cell: say which, so a drop's head reads as
				// `'` above the cell's middle and `.` below it.
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
 * The surface an effect paints into, at two square samples per glyph: one for
 * its top half, one for its bottom. A glyph is about twice as tall as it is
 * wide, so this keeps cells square in the effect's terms (rings stay round,
 * rain keeps its slant) with no change to any effect, and the two samples
 * are what lets a glyph take a shape rather than only a density.
 *
 * Samples are straight RGBA in a Uint32 view, as in the dither `Painter`;
 * `compose` folds each pair into a glyph and a colour.
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
	blend(x: number, y: number, [r, g, b]: Rgb, alpha: number) {
		if (x < 0 || y < 0 || x >= this.cols || y >= this.rows || alpha <= 0) return;
		const i = y * this.cols + x;
		const d = this.px[i];
		const da = (d >>> 24) / 255;
		const sa = clamp01(alpha);
		if (da === 0) {
			this.px[i] = ((Math.round(sa * 255) << 24) | (b << 16) | (g << 8) | r) >>> 0;
			return;
		}
		const oa = sa + da * (1 - sa);
		const w = sa / oa;
		const nr = r * w + (d & 255) * (1 - w);
		const ng = g * w + ((d >>> 8) & 255) * (1 - w);
		const nb = b * w + ((d >>> 16) & 255) * (1 - w);
		this.px[i] = ((Math.round(oa * 255) << 24) | (nb << 16) | (ng << 8) | nr) >>> 0;
	}

	/**
	 * Density is coverage. The glyph ramp is the dither here, so there is no
	 * threshold matrix: a field falls off through `@#*+=-:.` on its own.
	 */
	dither(x: number, y: number, density: number, color: Rgb, gain = 1) {
		if (density <= 0.004) return;
		this.blend(x, y, color, clamp01(density) * gain);
	}

	/**
	 * A sparkle is a glyph, not a cross of cells: the centre lights the sample,
	 * and the arms, once they flare, turn its glyph into `+` and then `*`.
	 */
	glint(x: number, y: number, color: Rgb, alpha: number, arms = 0) {
		this.blend(x, y, color, alpha);
		if (arms <= 0 || x < 0 || y < 0 || x >= this.cols || y >= this.rows) return;
		const i = (y >> 1) * this.cols + x;
		const k = arms > 0.5 ? GLINT_BIG : GLINT_SMALL;
		if (k > this.marks[i]) this.marks[i] = k;
	}

	/**
	 * Folds each glyph's two samples into a glyph index from `lut` and one
	 * colour: the halves mixed by their coverage, at the opacity of the denser
	 * one. Writes every cell of `glyphs` and the lit cells of `colors`; the
	 * colour of a blank cell is never read. Returns how many cells are lit.
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
	/** CSS px. Sets the glyph cell: one advance wide, two advances tall. */
	fontSize?: number;
	/** A canvas font family, already resolved: no `var()`. */
	fontFamily?: string;
	/** Lightest to densest. */
	ramp?: string;
	/** Ceiling on the glyph grid, so a large box can't cost a large frame. */
	maxCols?: number;
	maxRows?: number;
}

/**
 * Draws an `AsciiPainter` as glyphs on a canvas at device resolution.
 *
 * Every glyph is rendered once, white, into an atlas, so a frame never calls
 * `fillText`: it blits one atlas slot per lit glyph (blank cells cost
 * nothing), then colours all of them at once by drawing a one-pixel-per-glyph
 * colour canvas over them, scaled up without smoothing, with `source-in`.
 */
export class AsciiRenderer implements Renderer {
	private painter: AsciiPainter | null = null;
	private readonly ctx: CanvasRenderingContext2D;
	private readonly atlas: HTMLCanvasElement;
	private readonly tint: HTMLCanvasElement;
	private readonly tintCtx: CanvasRenderingContext2D;
	private colors: ImageData | null = null;
	private colors32 = new Uint32Array(0);
	private glyphs = new Uint8Array(0);
	private lut: Uint8Array;
	private ramp: string;
	private fontFamily: string;
	private readonly fontSize: number;
	private readonly maxCols: number;
	private readonly maxRows: number;
	/** Glyph cell in device px, and the ratio they were measured at. */
	private cw = 0;
	private ch = 0;
	private dpr = 0;
	private width = 0;
	private height = 0;

	constructor(
		private readonly canvas: HTMLCanvasElement,
		{
			fontSize = 10,
			fontFamily = SYSTEM_MONO,
			ramp = ASCII_RAMP,
			maxCols = 320,
			maxRows = 160,
		}: AsciiOptions = {},
	) {
		const ctx = canvas.getContext("2d");
		this.atlas = document.createElement("canvas");
		this.tint = document.createElement("canvas");
		const tintCtx = this.tint.getContext("2d");
		if (!ctx || !tintCtx) throw new Error("AsciiRenderer: 2d context unavailable");
		this.ctx = ctx;
		this.tintCtx = tintCtx;
		this.fontSize = fontSize;
		this.fontFamily = fontFamily;
		this.ramp = ramp || ASCII_RAMP;
		this.lut = glyphTable(this.ramp);
		this.maxCols = maxCols;
		this.maxRows = maxRows;
	}

	get family() {
		return this.fontFamily;
	}

	/** The canvas font string the atlas draws with, for `document.fonts.load`. */
	get font() {
		return `${this.fontSize}px ${this.fontFamily}`;
	}

	resize(width: number, height: number) {
		this.width = width;
		this.height = height;
		const dpr = globalThis.devicePixelRatio || 1;
		if (dpr !== this.dpr || !this.cw) {
			this.dpr = dpr;
			this.measure();
		}
		const cssW = this.cw / dpr;
		const cssH = this.ch / dpr;
		// Rounded up: the last column and row overhang the box by under a glyph
		// and are clipped by the wrapper, instead of leaving a gap.
		const cols = Math.min(this.maxCols, Math.max(2, Math.ceil(width / cssW)));
		const lines = Math.min(this.maxRows, Math.max(2, Math.ceil(height / cssH)));
		this.fit(cols, lines);
		if (this.painter && this.painter.cols === cols && this.painter.lines === lines) {
			// Same grid, new cell size (a font or zoom change): the effect keeps its
			// state, and the cleared backing store is repainted from it here.
			this.present();
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

	/**
	 * Swap the font family, once a web font has loaded or the family changes.
	 * Re-measures and re-renders the atlas; call `resize` after, since the
	 * glyph cell may have changed size.
	 */
	setFont(family: string) {
		this.fontFamily = family;
		this.cw = 0;
	}

	/** Swap the ramp in place. Cheap: one table, one atlas. */
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

	/** Snap the glyph cell to whole device px, so every blit lands on the grid. */
	private measure() {
		const ctx = this.atlas.getContext("2d");
		if (!ctx) return;
		ctx.font = `${this.fontSize * this.dpr}px ${this.fontFamily}`;
		this.cw = Math.max(1, Math.round(ctx.measureText("M").width));
		this.ch = this.cw * 2;
		this.draw();
	}

	/** Every glyph once, white, centred in its own clipped slot. */
	private draw() {
		const glyphs = glyphString(this.ramp);
		const { atlas, cw, ch } = this;
		if (!cw) return;
		atlas.width = glyphs.length * cw;
		atlas.height = ch;
		const ctx = atlas.getContext("2d");
		if (!ctx) return;
		ctx.font = `${this.fontSize * this.dpr}px ${this.fontFamily}`;
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

	private fit(cols: number, lines: number) {
		const w = cols * this.cw;
		const h = lines * this.ch;
		if (this.canvas.width !== w) this.canvas.width = w;
		if (this.canvas.height !== h) this.canvas.height = h;
		this.canvas.style.width = `${w / this.dpr}px`;
		this.canvas.style.height = `${h / this.dpr}px`;
	}
}
