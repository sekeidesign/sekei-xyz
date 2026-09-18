import type { DitherEffect, DitherFrame, Rgb } from "../engine";
import { arms, type Particle, twinkle } from "./particles";

export interface FluidOptions {
	color?: Rgb;
	/** Resting depth as a fraction of the height, at full intensity. */
	level?: number;
	/** How far the surface tilts at either edge, as a fraction of the height. */
	slosh?: number;
	/** Slosh cycles per second. */
	tempo?: number;
	/** Bubbles rising at once, at full intensity. */
	bubbles?: number;
}

const TAU = Math.PI * 2;

/**
 * A liquid pooled along the floor, sloshing side to side around a level that
 * never changes: mass shifts left, then right, and the mean holds. The body is
 * densest at the floor and dissolves toward the surface line, which carries
 * the wave.
 */
export function fluid({
	color = [48, 128, 255],
	level = 0.2,
	slosh = 0.09,
	tempo = 0.15,
	bubbles = 12,
}: FluidOptions = {}): DitherEffect {
	let cols = 0;
	let rows = 0;
	let rand: () => number = Math.random;
	let surface = new Float32Array(0);
	let bubs: Particle[] = [];
	let glints: Particle[] = [];
	let dark = true;

	function bubble(): Particle {
		return {
			x: rand() * cols,
			y: rows - 1,
			vx: 0,
			vy: -rows * (0.06 + rand() * 0.08),
			age: 0,
			life: 0,
			phase: rand() * TAU,
		};
	}

	function shape(t: number, intensity: number, reduced: boolean) {
		const depth = level * rows * intensity;
		const phase = t * tempo * TAU;
		const tilt = reduced ? 0 : Math.sin(phase) * slosh * rows;
		for (let x = 0; x < cols; x++) {
			const u = (x + 0.5) / cols - 0.5;
			const lag = reduced
				? 0
				: Math.sin(phase - u * 1.2) * slosh * rows * 0.25;
			const ripple = reduced
				? 0
				: Math.sin(x * 0.45 - t * 2.6) * 0.5 + Math.sin(x * 0.23 + t * 1.7) * 0.4;
			surface[x] = rows - depth + (tilt * u * 2 + lag + ripple) * intensity;
		}
		return depth;
	}

	function paint({ px, t, intensity, reduced }: DitherFrame, depth: number) {
		px.clear();
		for (let x = 0; x < cols; x++) {
			const top = surface[x];
			const ty = Math.round(top);
			for (let y = Math.max(ty, 0); y < rows; y++) {
				const d = (y - top) / Math.max(depth, 1);
				px.dither(x, y, 0.25 + 0.65 * (d > 1 ? 1 : d), color);
			}
			px.blend(x, ty, color, 0.75 * intensity);
			px.blend(x, ty + 1, color, 0.35 * intensity);
		}
		if (reduced) return;
		for (const b of bubs) {
			const tw = twinkle(t, b.phase, 1.2);
			px.glint(Math.round(b.x), Math.round(b.y), color, intensity * (0.5 + 0.5 * tw), arms(tw));
		}
		for (const g of glints) {
			const x = Math.round(g.x);
			const tw = twinkle(t, g.phase);
			px.glint(x, Math.round(surface[x] ?? rows) - 1, color, intensity * tw, arms(tw));
		}
	}

	return {
		resize(c, r, random) {
			cols = c;
			rows = r;
			rand = random;
			surface = new Float32Array(c);
			bubs = [];
			glints = Array.from({ length: 4 }, () => ({
				x: rand() * c,
				y: 0,
				vx: 0,
				vy: 0,
				age: 0,
				life: 0,
				phase: rand() * TAU,
			}));
			dark = true;
		},
		step(frame) {
			const { px, dt, t, intensity, reduced } = frame;
			if (intensity <= 0.002) {
				if (dark) return false;
				px.clear();
				bubs = [];
				dark = true;
				return true;
			}
			dark = false;
			const depth = shape(t, intensity, reduced);
			if (!reduced) {
				if (bubs.length < bubbles * intensity && rand() < 0.08) bubs.push(bubble());
				for (const b of bubs) {
					b.y += b.vy * dt;
					b.x += Math.sin(t * 3 + b.phase) * rows * 0.02 * dt;
				}
				bubs = bubs.filter((b) => b.y > (surface[Math.round(b.x)] ?? 0) + 1);
				const drift = Math.cos(t * tempo * TAU) * cols * 0.12;
				for (const g of glints) {
					g.x += drift * dt;
					if (g.x < 0) g.x += cols;
					if (g.x >= cols) g.x -= cols;
				}
			}
			paint(frame, depth);
			return true;
		},
		idle: () => true,
	};
}
