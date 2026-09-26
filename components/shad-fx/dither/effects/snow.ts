import {
	type DitherEffect,
	type DitherFrame,
	type RgbInput,
	toRgb,
} from "../engine";
import { arms, twinkle } from "./particles";

export interface SnowOptions {
	color?: RgbInput;
	/** Flakes aloft at once. */
	flakes?: number;
	/** Fall speed of the nearest flakes as a fraction of the height per second. */
	speed?: number;
	/** Sideways wander as a fraction of the fall speed. */
	sway?: number;
	/** Depth the snow settles to along the floor, as a fraction of the height. 0 for none. */
	settle?: number;
}

interface Flake {
	x: number;
	y: number;
	/** 0–1 nearness: near flakes fall faster, paint brighter and sparkle. */
	size: number;
	phase: number;
}

const TAU = Math.PI * 2;

/**
 * Snow: flakes drifting down on their own sway and a slow shared gust, the
 * near ones winking as they go, settling into a drift along the floor that
 * smooths itself as it builds. Fully intensity-driven, like beam: the whole
 * scene fades with the ease and clears the moment it lands on zero.
 */
export function snow({
	color: colorInput = [209, 213, 220],
	flakes = 40,
	speed = 0.12,
	sway = 0.6,
	settle = 0.12,
}: SnowOptions = {}): DitherEffect {
	const color = toRgb(colorInput);
	let cols = 0;
	let rows = 0;
	let rand: () => number = Math.random;
	let aloft: Flake[] = [];
	let ground = new Float32Array(0);
	let dark = true;
	let still = false;

	const fallSpeed = (f: Flake) => speed * rows * (0.4 + 0.6 * f.size);

	function flake(y: number): Flake {
		return { x: rand() * cols, y, size: rand(), phase: rand() * TAU };
	}

	function seed() {
		aloft = Array.from({ length: flakes }, () => flake(rand() * rows));
		ground = new Float32Array(cols);
	}

	function land(x: number) {
		if (settle <= 0) return;
		const cap = settle * rows;
		// Sized against the column count so a drift builds at the same pace on
		// any grid, and spread to the neighbours so it mounds rather than spikes.
		const inc = (0.5 * cols) / Math.max(1, flakes);
		for (const [dx, share] of [[0, 1], [-1, 0.5], [1, 0.5]] as const) {
			const i = x + dx;
			if (i < 0 || i >= cols) continue;
			ground[i] = Math.min(cap, ground[i] + inc * share);
		}
	}

	function smooth(dt: number) {
		if (settle <= 0 || cols < 3) return;
		const k = Math.min(1, dt * 2);
		let prev = ground[0];
		for (let x = 1; x < cols - 1; x++) {
			const cur = ground[x];
			ground[x] += ((prev + ground[x + 1]) / 2 - cur) * k;
			prev = cur;
		}
	}

	function drift(dt: number, t: number) {
		const gust = Math.sin(t * 0.25) * 0.3;
		for (const f of aloft) {
			const vy = fallSpeed(f);
			f.y += vy * dt;
			f.x += (Math.sin(t * 0.9 + f.phase) + gust) * sway * vy * dt;
			if (f.x < -1) f.x += cols + 2;
			else if (f.x > cols + 1) f.x -= cols + 2;
			const xi = Math.min(cols - 1, Math.max(0, Math.round(f.x)));
			if (f.y >= rows - 1 - ground[xi]) {
				land(xi);
				Object.assign(f, flake(-1 - rand() * 3));
			}
		}
	}

	function paint({ px, t, intensity, reduced }: DitherFrame) {
		px.clear();
		for (let x = 0; x < cols; x++) {
			const h = ground[x];
			if (h <= 0.05) continue;
			const top = rows - h;
			const ty = Math.floor(top);
			// The surface cell at the alpha of its coverage, so a dusting reads
			// before it is a whole cell deep.
			px.blend(x, ty, color, (ty + 1 - top) * 0.85 * intensity);
			for (let y = ty + 1; y < rows; y++) {
				const d = (y - top) / Math.max(h, 1);
				px.dither(x, y, 0.45 + 0.5 * Math.min(1, d), color, intensity);
			}
		}
		for (const f of aloft) {
			const tw = reduced ? 0.6 : twinkle(t, f.phase, 0.5);
			const a = (0.4 + 0.6 * f.size) * (0.7 + 0.3 * tw) * intensity;
			const x = Math.round(f.x);
			const y = Math.round(f.y);
			if (f.size > 0.55) px.glint(x, y, color, a, reduced ? 0 : arms(tw) * 0.7);
			else px.blend(x, y, color, a * 0.8);
		}
	}

	return {
		resize(c, r, random) {
			cols = c;
			rows = r;
			rand = random;
			seed();
			dark = true;
			still = false;
		},
		step(frame) {
			const { px, dt, t, intensity, reduced } = frame;
			if (intensity <= 0.002) {
				if (dark) return false;
				px.clear();
				seed();
				dark = true;
				return true;
			}
			if (reduced) {
				if (!still) {
					seed();
					// Under reduce the drift is already there: a low mound with
					// the shape a settled fall would have.
					const a = rand() * TAU;
					const b = rand() * TAU;
					for (let x = 0; x < cols; x++) {
						const wave =
							0.55 + 0.25 * Math.sin(x * 0.09 + a) + 0.2 * Math.sin(x * 0.23 + b);
						ground[x] = settle * rows * wave;
					}
					still = true;
				}
				dark = false;
				paint(frame);
				return true;
			}
			if (still) {
				seed();
				still = false;
			}
			dark = false;
			drift(dt, t);
			smooth(dt);
			paint(frame);
			return true;
		},
		idle: () => true,
	};
}
