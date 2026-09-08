import { type DitherEffect, type DitherFrame, mix, type Rgb } from "../engine";
import { arms, type Particle, twinkle } from "./particles";

export interface FireOptions {
	/** Cold → hot: the tips, the body, the base. */
	colors?: readonly [Rgb, Rgb, Rgb];
	/** Fraction of the height the flames reach at full intensity. */
	height?: number;
	/** Simulation steps per second; lower reads chunkier. */
	rate?: number;
	/** Embers aloft at once, at full intensity. */
	embers?: number;
}

/**
 * The Doom fire: a heat field seeded along the bottom row, each cell pulling
 * from a randomly jittered cell below it with a random loss. Intensity drives
 * the source row, so easing it out lets the flames burn away upward instead of
 * fading as a sheet.
 */
export function fire({
	colors = [
		[229, 52, 58],
		[240, 81, 0],
		[252, 187, 0],
	],
	height = 0.5,
	rate = 36,
	embers = 8,
}: FireOptions = {}): DitherEffect {
	const [cold, warm, hot] = colors;
	let cols = 0;
	let rows = 0;
	let heat = new Float32Array(0);
	let rand: () => number = Math.random;
	let acc = 0;
	let alive = false;
	let warmed = false;
	let sparks: Particle[] = [];
	let lastReduced = false;

	const ramp = (h: number): Rgb =>
		h < 0.45 ? mix(cold, warm, h / 0.45) : mix(warm, hot, (h - 0.45) / 0.55);

	function simulate(intensity: number, t: number) {
		const loss = 1 / (rows * height);
		const base = (rows - 1) * cols;
		for (let x = 0; x < cols; x++) {
			const flicker =
				0.7 + 0.3 * Math.sin(t * 5 + x * 0.8) * Math.sin(t * 3.1 - x * 0.5);
			heat[base + x] = intensity * flicker * (0.8 + 0.2 * rand());
		}
		for (let y = 1; y < rows; y++) {
			const src = y * cols;
			const dst = src - cols;
			for (let x = 0; x < cols; x++) {
				const r = rand();
				const jitter = r < 0.3 ? -1 : r < 0.6 ? 1 : 0;
				const sx = Math.min(cols - 1, Math.max(0, x + jitter));
				const h = heat[src + sx] - loss * rand() * 2;
				heat[dst + x] = h > 0 ? h : 0;
			}
		}
	}

	function spawn(intensity: number) {
		if (sparks.length >= embers * intensity || rand() > 0.3) return;
		const x = Math.floor(rand() * cols);
		for (let y = 0; y < rows - 2; y++) {
			if (heat[y * cols + x] > 0.3) {
				sparks.push({
					x,
					y: y + 1,
					vx: (rand() - 0.5) * rows * 0.06,
					vy: -rows * (0.12 + rand() * 0.14),
					age: 0,
					life: 0.7 + rand() * 0.7,
					phase: rand() * Math.PI * 2,
				});
				return;
			}
		}
	}

	function paint({ px, t, intensity, reduced }: DitherFrame) {
		px.clear();
		alive = false;
		const gain = reduced ? intensity : 1;
		for (let i = 0, y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++, i++) {
				const h = heat[i];
				if (h <= 0.01) continue;
				alive = true;
				px.dither(x, y, h ** 0.85, ramp(h), gain);
			}
		}
		for (const s of sparks) {
			alive = true;
			const tw = twinkle(t, s.phase, 1.5);
			const fade = 1 - s.age / s.life;
			px.glint(
				Math.round(s.x),
				Math.round(s.y),
				hot,
				(0.4 + 0.6 * tw) * fade,
				arms(tw),
			);
		}
	}

	return {
		resize(c, r, random) {
			cols = c;
			rows = r;
			rand = random;
			heat = new Float32Array(c * r);
			sparks = [];
			warmed = false;
			acc = 0;
		},
		step(frame) {
			const { dt, t, intensity, reduced } = frame;
			lastReduced = reduced;
			if (reduced) {
				if (!warmed) {
					for (let i = 0; i < rows * 2; i++) simulate(1, i / rate);
					warmed = true;
				}
				sparks = [];
				paint(frame);
				return true;
			}
			warmed = false;
			acc += dt;
			let stepped = false;
			while (acc >= 1 / rate) {
				acc -= 1 / rate;
				simulate(intensity, t);
				spawn(intensity);
				stepped = true;
			}
			for (const s of sparks) {
				s.x += s.vx * dt;
				s.y += s.vy * dt;
				s.age += dt;
			}
			sparks = sparks.filter((s) => s.age < s.life && s.y > -1);
			if (!stepped && sparks.length === 0) return false;
			paint(frame);
			return true;
		},
		idle: () => lastReduced || !alive,
	};
}
