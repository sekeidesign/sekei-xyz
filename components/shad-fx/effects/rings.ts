import {
	type Anchor,
	type FxEffect,
	type FxFrame,
	resolveAnchor,
	type RgbInput,
	toRgb,
} from "../engine";
import { arms, twinkle } from "./particles";

export interface RingsOptions {
	color?: RgbInput;
	origin?: Anchor;
	/** Seconds between rings. */
	interval?: number;
	/** Expansion speed as a fraction of the height per second. */
	speed?: number;
	/** Ring thickness in cells. */
	width?: number;
}

interface Ring {
	r: number;
	phase: number;
}

const TAU = Math.PI * 2;

/**
 * Sonar rings pulsing out from a point, each a gaussian band that thins as it
 * grows, with four glints riding its wavefront. Rings only spawn while active,
 * so easing out lets the ones in flight finish.
 */
export function rings({
	color: colorInput = [172, 75, 255],
	origin = [0.5, 0.42],
	interval = 1.15,
	speed = 0.45,
	width = 2.6,
}: RingsOptions = {}): FxEffect {
	const color = toRgb(colorInput);
	let cols = 0;
	let rows = 0;
	let ax = Number.NaN;
	let ay = Number.NaN;
	let cx = 0;
	let cy = 0;
	let reach = 1;
	let dist = new Float32Array(0);
	let rand: () => number = Math.random;
	let live: Ring[] = [];
	let until = 0.05;
	let alive = false;
	let lastReduced = false;

	/**
	 * Caches every cell's distance from the origin, which is what lets a frame
	 * be one subtraction per cell. Rebuilt when the box or the anchor changes,
	 * never per frame.
	 */
	function place(fx: number, fy: number) {
		ax = fx;
		ay = fy;
		cx = cols * fx;
		cy = rows * fy;
		if (dist.length !== cols * rows) dist = new Float32Array(cols * rows);
		reach = 0;
		for (let i = 0, y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++, i++) {
				dist[i] = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
				if (dist[i] > reach) reach = dist[i];
			}
		}
		reach *= 0.95;
	}

	function paint({ px, t, intensity, reduced }: FxFrame, set: Ring[]) {
		px.clear();
		const gain = reduced ? intensity : 1;
		for (let i = 0, y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++, i++) {
				let a = 0;
				for (const ring of set) {
					const e = (dist[i] - ring.r) / width;
					if (e > 2.5 || e < -2.5) continue;
					const fade = (1 - ring.r / reach) ** 1.2;
					const g = Math.exp(-e * e) * fade;
					if (g > a) a = g;
				}
				px.dither(x, y, a * 0.85, color, gain);
			}
		}
		if (reduced) return;
		for (const ring of set) {
			const fade = 1 - ring.r / reach;
			for (let k = 0; k < 4; k++) {
				const angle = ring.phase + (k * TAU) / 4 + ring.r * 0.05;
				const x = Math.round(cx + Math.cos(angle) * ring.r);
				const y = Math.round(cy + Math.sin(angle) * ring.r);
				const tw = twinkle(t, ring.phase + k * 2);
				px.glint(x, y, color, fade * (0.5 + 0.5 * tw), arms(tw));
			}
		}
	}

	return {
		resize(c, r, random) {
			cols = c;
			rows = r;
			rand = random;
			place(...resolveAnchor(origin));
			live = [];
			until = 0.05;
		},
		step(frame) {
			const { dt, intensity, reduced } = frame;
			lastReduced = reduced;
			const [fx, fy] = resolveAnchor(origin);
			if (fx !== ax || fy !== ay) place(fx, fy);
			if (reduced) {
				paint(
					frame,
					[0.25, 0.55, 0.85].map((f) => ({ r: reach * f, phase: 0 })),
				);
				return true;
			}
			until -= dt;
			if (intensity > 0.3) {
				if (until <= 0) {
					live.push({ r: 1.5, phase: rand() * TAU });
					until = interval;
				}
			} else if (until > 0.05) until = 0.05;
			for (const ring of live) ring.r += speed * rows * dt;
			live = live.filter((ring) => ring.r < reach);
			if (live.length === 0 && !alive) return false;
			alive = live.length > 0;
			paint(frame, live);
			return true;
		},
		idle: () => lastReduced || !alive,
	};
}
