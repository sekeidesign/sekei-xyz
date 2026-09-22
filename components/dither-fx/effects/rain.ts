import {
	type DitherEffect,
	type DitherFrame,
	type RgbInput,
	toRgb,
} from "../engine";

export interface RainOptions {
	color?: RgbInput;
	/** Drops in flight at once, at full intensity. */
	drops?: number;
	/** Fall speed of the nearest drops as a fraction of the height per second. */
	speed?: number;
	/**
	 * Cells drifted sideways per cell fallen; negative blows left. A getter is
	 * re-read every frame, so the slant can be steered without rebuilding.
	 */
	slant?: number | (() => number);
	/** Streak length of the nearest drops, in cells. */
	length?: number;
}

interface Drop {
	x: number;
	y: number;
	/** 0–1 nearness: near drops fall faster and paint longer and brighter. */
	depth: number;
}

interface Splash {
	x: number;
	age: number;
	life: number;
	bright: number;
}

/**
 * Rain: streaks on a shared slant that gusts a little, near drops faster and
 * brighter than far ones, each ending in a splash on the floor. Intensity
 * drives how many are aloft, so easing out lets the ones in flight land
 * instead of fading them as a sheet.
 */
export function rain({
	color: colorInput = [190, 219, 255],
	drops = 64,
	speed = 1.4,
	slant = 0.25,
	length = 6,
}: RainOptions = {}): DitherEffect {
	const color = toRgb(colorInput);
	const slantNow = () => (typeof slant === "function" ? slant() : slant);
	let cols = 0;
	let rows = 0;
	let rand: () => number = Math.random;
	let live: Drop[] = [];
	let splashes: Splash[] = [];
	let alive = false;
	let lastReduced = false;
	let still = false;

	const wind = (t: number) => slantNow() * (0.85 + 0.15 * Math.sin(t * 0.7));

	const fallSpeed = (d: Drop) => speed * rows * (0.55 + 0.45 * d.depth);

	function drop(y: number): Drop {
		// Slanted rain enters from a side as well as the top, so the spawn span
		// is widened upwind by how far a drop drifts on its way down.
		const drift = slantNow() * rows;
		return {
			x: Math.min(0, -drift) + rand() * (cols + Math.abs(drift)),
			y,
			depth: 0.35 + 0.65 * rand(),
		};
	}

	function spawn(intensity: number, dt: number) {
		const want = drops * intensity;
		// Spawned anywhere within half a crossing above the top, and capped per
		// frame: a landed drop otherwise comes straight back at the top edge, and
		// the rain arrives in curtains.
		let budget = Math.ceil(want * dt * 4);
		while (live.length < want && budget-- > 0) {
			live.push(drop(-1 - rand() * rows * 0.5));
		}
	}

	function fall(dt: number, t: number) {
		const w = wind(t);
		const kept: Drop[] = [];
		for (const d of live) {
			const vy = fallSpeed(d);
			d.y += vy * dt;
			d.x += vy * w * dt;
			if (d.y < rows - 1) {
				kept.push(d);
				continue;
			}
			if (d.x >= 0 && d.x < cols) {
				splashes.push({
					x: d.x,
					age: 0,
					life: 0.16 + rand() * 0.12,
					bright: 0.45 + 0.55 * d.depth,
				});
			}
		}
		live = kept;
	}

	function paint({ px, t, intensity, reduced }: DitherFrame) {
		px.clear();
		alive = false;
		const gain = reduced ? intensity : 1;
		const w = reduced ? slantNow() : wind(t);
		const norm = Math.hypot(w, 1);
		const sx = -w / norm;
		const sy = -1 / norm;
		for (const d of live) {
			alive = true;
			const len = Math.max(1, Math.round(length * (0.6 + 0.4 * d.depth)));
			const bright = 0.45 + 0.55 * d.depth;
			px.blend(Math.round(d.x), Math.round(d.y), color, bright * gain);
			// Solid for most of its length and dithered only at the tail: a streak
			// dithered throughout breaks into dots once its density drops below
			// the Bayer threshold, and stops reading as a line.
			for (let k = 1; k <= len; k++) {
				const fade = 1 - k / (len + 1);
				const x = Math.round(d.x + sx * k);
				const y = Math.round(d.y + sy * k);
				if (k <= len * 0.6) px.blend(x, y, color, fade * bright * gain);
				else px.dither(x, y, fade * bright * 1.6, color, gain);
			}
		}
		const floor = rows - 1;
		for (const s of splashes) {
			alive = true;
			const p = s.age / s.life;
			const x = Math.round(s.x);
			const a = (1 - p) * s.bright * gain;
			px.blend(x, floor, color, a);
			// The crown: two droplets kicked up and out, wider the older the splash.
			const reach = 1 + Math.round(p * 2);
			px.blend(x - reach, floor - 1, color, a * 0.7);
			px.blend(x + reach, floor - 1, color, a * 0.7);
		}
	}

	return {
		resize(c, r, random) {
			cols = c;
			rows = r;
			rand = random;
			live = [];
			splashes = [];
			still = false;
		},
		step(frame) {
			const { dt, t, intensity, reduced } = frame;
			lastReduced = reduced;
			if (reduced) {
				if (!still) {
					live = Array.from({ length: drops }, () => drop(rand() * rows));
					splashes = [];
					still = true;
				}
				paint(frame);
				return true;
			}
			if (still) {
				live = [];
				still = false;
			}
			spawn(intensity, dt);
			fall(dt, t);
			for (const s of splashes) s.age += dt;
			splashes = splashes.filter((s) => s.age < s.life);
			if (live.length === 0 && splashes.length === 0 && !alive) return false;
			paint(frame);
			return true;
		},
		idle: () => lastReduced || !alive,
	};
}
