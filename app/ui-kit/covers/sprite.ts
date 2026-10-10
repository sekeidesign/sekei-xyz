import {
	clamp01,
	type FxEffect,
	type FxFrame,
	type RgbInput,
	toRgb,
} from "@/components/shad-fx";

export interface SpriteOptions {
	/** A one-row sprite sheet, frames laid out left to right. */
	src: string;
	frames: number;
	fps?: number;
	color?: RgbInput;
	fit?: "contain" | "cover";
	/** Light pixels read as dense instead of dark ones. */
	invert?: boolean;
	/** Density below this is dropped, so a near-white ground paints nothing. */
	threshold?: number;
}

/**
 * Plays a sprite sheet through the dither surface. Each frame is sampled to the
 * grid once per resize and kept as a density field, so a frame costs one pass
 * of `dither` calls and nothing is read back from a canvas while it plays.
 */
export function sprite({
	src,
	frames,
	fps = 10,
	color: colorInput = [31, 36, 48],
	fit = "contain",
	invert = false,
	threshold = 0.08,
}: SpriteOptions): FxEffect {
	const color = toRgb(colorInput);
	let cols = 0;
	let rows = 0;
	let sheet: ImageBitmap | null = null;
	let loading = false;
	let failed = false;
	let fields: Float32Array[] = [];
	let shown = -1;
	let shownIntensity = -1;
	let lastIntensity = 0;
	let lastReduced = false;

	// Deferred to the first resize, which only happens in the browser: the
	// factory also runs during SSR, where there is nothing to fetch into.
	function load() {
		if (loading || sheet || failed) return;
		loading = true;
		fetch(src)
			.then((res) => {
				if (!res.ok) throw new Error(`sprite: ${res.status} ${src}`);
				return res.blob();
			})
			.then((blob) => createImageBitmap(blob))
			.then((bitmap) => {
				sheet = bitmap;
				sample();
			})
			.catch((error) => {
				failed = true;
				console.error(error);
			})
			.finally(() => {
				loading = false;
			});
	}

	function sample() {
		const bitmap = sheet;
		if (!bitmap || cols === 0 || rows === 0) return;
		const frameW = bitmap.width / frames;
		const frameH = bitmap.height;
		const scale =
			fit === "contain"
				? Math.min(cols / frameW, rows / frameH)
				: Math.max(cols / frameW, rows / frameH);
		const w = frameW * scale;
		const h = frameH * scale;
		const dx = (cols - w) / 2;
		const dy = (rows - h) / 2;

		const canvas = new OffscreenCanvas(cols, rows);
		const ctx = canvas.getContext("2d", { willReadFrequently: true });
		if (!ctx) return;
		ctx.imageSmoothingQuality = "high";

		fields = Array.from({ length: frames }, (_, index) => {
			ctx.clearRect(0, 0, cols, rows);
			ctx.drawImage(bitmap, index * frameW, 0, frameW, frameH, dx, dy, w, h);
			const { data } = ctx.getImageData(0, 0, cols, rows);
			const field = new Float32Array(cols * rows);
			for (let i = 0; i < field.length; i++) {
				const o = i * 4;
				const luma =
					(0.2126 * data[o] + 0.7152 * data[o + 1] + 0.0722 * data[o + 2]) / 255;
				const raw = (invert ? luma : 1 - luma) * (data[o + 3] / 255);
				field[i] = clamp01((raw - threshold) / (1 - threshold));
			}
			return field;
		});
		shown = -1;
	}

	function paint({ px }: FxFrame, field: Float32Array, intensity: number) {
		px.clear();
		for (let i = 0, y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++, i++) {
				px.dither(x, y, field[i] * intensity, color);
			}
		}
	}

	return {
		resize(c, r) {
			cols = c;
			rows = r;
			if (sheet) sample();
			else load();
		},
		step(frame) {
			const { t, intensity, reduced } = frame;
			lastIntensity = intensity;
			lastReduced = reduced;
			if (fields.length === 0) return false;
			const index = reduced ? 0 : Math.floor(t * fps) % frames;
			if (index === shown && intensity === shownIntensity) return false;
			shown = index;
			shownIntensity = intensity;
			paint(frame, fields[index], intensity);
			return true;
		},
		// Busy until the sheet arrives, so the engine keeps stepping and paints
		// the first frame the moment there is one; nothing else would wake it.
		idle: () => {
			if (failed) return true;
			if (fields.length === 0) return false;
			return lastIntensity === 0 || (lastReduced && shown === 0);
		},
	};
}
