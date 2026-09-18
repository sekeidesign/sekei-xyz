import {
	type Anchor,
	type DitherEffect,
	type DitherFrame,
	resolveAnchor,
	type Rgb,
} from "../engine";
import { arms, type Particle, twinkle } from "./particles";

export interface BeamOptions {
	color?: Rgb;
	/** Only the x of the anchor is used: the column the light falls along. */
	origin?: Anchor;
	/** Half-width at the bottom edge as a fraction of the width. */
	spread?: number;
	/** Dust motes drifting in the light. */
	motes?: number;
}

/**
 * A cone of light from above the top edge, dissolving toward the floor, with
 * slow dust winking inside it. Fully intensity-driven: there is no simulation
 * to run down, so it goes dark the moment the ease lands on zero.
 */
export function beam({
	color = [48, 128, 255],
	origin = [0.5, 0.5],
	spread = 0.5,
	motes = 16,
}: BeamOptions = {}): DitherEffect {
	let cols = 0;
	let rows = 0;
	let rand: () => number = Math.random;
	let ox = 0.5;
	let dust: Particle[] = [];
	let dark = true;

	const halfWidth = (y: number) => ((y + rows * 0.2) / (rows * 1.2)) * spread * cols;

	function mote(y: number): Particle {
		const hw = halfWidth(y);
		return {
			x: cols * ox + (rand() * 2 - 1) * hw * 0.9,
			y,
			vx: 0,
			vy: rows * (0.02 + rand() * 0.035),
			age: 0,
			life: 0,
			phase: rand() * Math.PI * 2,
		};
	}

	function paint({ px, t, intensity, reduced }: DitherFrame) {
		px.clear();
		const time = reduced ? 0 : t;
		const cx = cols * ox + Math.sin(time * 0.5) * cols * 0.02;
		for (let y = 0; y < rows; y++) {
			const hw = halfWidth(y);
			const fall = (1 - y / rows) ** 1.1;
			const x0 = Math.max(0, Math.floor(cx - hw));
			const x1 = Math.min(cols - 1, Math.ceil(cx + hw));
			for (let x = x0; x <= x1; x++) {
				const e = Math.abs(x + 0.5 - cx) / hw;
				if (e >= 1) continue;
				const profile = (1 - e * e) ** 1.3;
				const shimmer = reduced
					? 1
					: 0.85 + 0.15 * Math.sin(time * 1.7 + x * 0.35 + y * 0.1);
				px.dither(x, y, profile * fall * shimmer * 0.85 * intensity, color);
			}
		}
		for (const m of dust) {
			const tw = reduced ? 0.7 : twinkle(time, m.phase);
			px.glint(
				Math.round(m.x),
				Math.round(m.y),
				color,
				intensity * (0.45 + 0.55 * tw),
				reduced ? 0 : arms(tw),
			);
		}
	}

	return {
		resize(c, r, random) {
			cols = c;
			rows = r;
			rand = random;
			ox = resolveAnchor(origin)[0];
			dust = Array.from({ length: motes }, () => mote(rand() * r));
			dark = true;
		},
		step(frame) {
			const { px, dt, t, intensity, reduced } = frame;
			if (intensity <= 0.002) {
				if (dark) return false;
				px.clear();
				dark = true;
				return true;
			}
			dark = false;
			if (!reduced) {
				const cx = cols * ox;
				for (let i = 0; i < dust.length; i++) {
					const m = dust[i];
					m.y += m.vy * dt;
					m.x += Math.sin(t * 0.8 + m.phase) * rows * 0.01 * dt;
					if (m.y > rows || Math.abs(m.x - cx) > halfWidth(m.y)) dust[i] = mote(-1);
				}
			}
			paint(frame);
			return true;
		},
		idle: () => true,
	};
}
