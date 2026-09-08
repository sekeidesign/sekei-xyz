import {
	type Anchor,
	type DitherEffect,
	type DitherFrame,
	resolveAnchor,
	type Rgb,
} from "../engine";
import { arms, type Particle, twinkle } from "./particles";

export interface BoltOptions {
	color?: Rgb;
	/** Seconds between strikes at full intensity, as a [min, max] range. */
	interval?: readonly [number, number];
	/** What the strikes aim for; they land just short of it or on it. */
	target?: Anchor;
	rate?: number;
}

/**
 * Lightning from the top edge: a random walk down that steers toward a target
 * column, throwing short branches, lighting the sky and bursting sparks at the
 * tip. The strike lives in a flash field that decays quickly, which is what
 * gives it an afterimage instead of a hard cut.
 */
export function bolt({
	color = [252, 187, 0],
	interval = [0.6, 1.4],
	target = [0.5, 0.43],
	rate = 30,
}: BoltOptions = {}): DitherEffect {
	let cols = 0;
	let rows = 0;
	let flash = new Float32Array(0);
	let tx = 0;
	let ty = 0;
	let rand: () => number = Math.random;
	let acc = 0;
	let alive = false;
	let until = 0.12;
	let sky = 0;
	let sparks: Particle[] = [];
	let crackle: Particle[] = [];
	let lastReduced = false;
	let staticBolt = false;

	const mark = (x: number, y: number, v: number) => {
		if (x < 0 || x >= cols || y < 0 || y >= rows) return;
		const i = y * cols + x;
		if (flash[i] < v) flash[i] = v;
	};

	function branch(x0: number, y0: number, dir: number) {
		let x = x0;
		let y = y0;
		const len = 3 + Math.floor(rand() * 6);
		for (let i = 0; i < len; i++) {
			if (rand() < 0.7) x += dir;
			if (rand() < 0.8) y += 1;
			mark(x, y, 0.65);
		}
	}

	function strike(burst: boolean) {
		let x = Math.round(tx + (rand() - 0.5) * cols * 0.5);
		const aim = Math.round(tx + (rand() - 0.5) * cols * 0.15);
		const endY = Math.round(ty * (0.7 + rand() * 0.3));
		for (let y = 0; y < endY; y++) {
			mark(x, y, 1);
			mark(x - 1, y, 0.35);
			mark(x + 1, y, 0.35);
			const r = rand();
			if (r < 0.28) x -= 1;
			else if (r < 0.56) x += 1;
			if ((y & 3) === 0 && rand() < 0.6) x += Math.sign(aim - x);
			if (rand() < 0.07) branch(x, y, rand() < 0.5 ? -1 : 1);
		}
		sky = 1;
		if (!burst) return;
		for (let i = 0; i < 7; i++) {
			const a = rand() * Math.PI * 2;
			const speed = rows * (0.15 + rand() * 0.25);
			sparks.push({
				x,
				y: endY,
				vx: Math.cos(a) * speed,
				vy: Math.sin(a) * speed * 0.6 - rows * 0.05,
				age: 0,
				life: 0.35 + rand() * 0.4,
				phase: rand() * Math.PI * 2,
			});
		}
	}

	function simulate(intensity: number) {
		for (let i = 0; i < flash.length; i++) {
			const f = flash[i] * 0.84;
			flash[i] = f < 0.01 ? 0 : f;
		}
		sky *= 0.78;
		until -= 1 / rate;
		if (intensity > 0.4) {
			if (until <= 0) {
				strike(true);
				until = interval[0] + rand() * (interval[1] - interval[0]);
			}
		} else if (until < 0.12) until = 0.12;
		if (rand() < 0.5 * intensity) {
			crackle.push({
				x: Math.floor(rand() * cols),
				y: Math.floor(rand() * rows * 0.55),
				vx: 0,
				vy: 0,
				age: 0,
				life: 0.2 + rand() * 0.35,
				phase: rand() * Math.PI * 2,
			});
		}
	}

	function paint({ px, t, intensity, reduced }: DitherFrame) {
		px.clear();
		alive = false;
		const gain = reduced ? intensity : 1;
		const depth = rows * 0.35;
		if (sky > 0.01) {
			alive = true;
			for (let y = 0; y < depth; y++) {
				const d = sky * 0.3 * (1 - y / depth);
				for (let x = 0; x < cols; x++) px.dither(x, y, d, color, gain);
			}
		}
		for (let i = 0, y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++, i++) {
				const f = flash[i];
				if (f <= 0.01) continue;
				alive = true;
				if (f >= 0.98) px.blend(x, y, color, gain);
				else px.dither(x, y, f ** 0.8, color, gain);
			}
		}
		for (const s of sparks) {
			alive = true;
			const tw = twinkle(t, s.phase, 2);
			const fade = 1 - s.age / s.life;
			px.glint(Math.round(s.x), Math.round(s.y), color, fade, arms(tw));
		}
		for (const c of crackle) {
			alive = true;
			const tw = Math.sin((c.age / c.life) * Math.PI);
			px.glint(c.x, c.y, color, tw * 0.9, arms(tw));
		}
	}

	return {
		resize(c, r, random) {
			cols = c;
			rows = r;
			rand = random;
			const [fx, fy] = resolveAnchor(target);
			tx = c * fx;
			ty = r * fy;
			flash = new Float32Array(c * r);
			sparks = [];
			crackle = [];
			sky = 0;
			acc = 0;
			until = 0.12;
			staticBolt = false;
		},
		step(frame) {
			const { dt, intensity, reduced } = frame;
			lastReduced = reduced;
			if (reduced) {
				if (!staticBolt) {
					flash.fill(0);
					strike(false);
					sky = 0;
					sparks = [];
					crackle = [];
					staticBolt = true;
				}
				paint(frame);
				return true;
			}
			if (staticBolt) {
				flash.fill(0);
				staticBolt = false;
			}
			acc += dt;
			let stepped = false;
			while (acc >= 1 / rate) {
				acc -= 1 / rate;
				simulate(intensity);
				stepped = true;
			}
			for (const s of sparks) {
				s.x += s.vx * dt;
				s.y += s.vy * dt;
				s.vy += rows * 0.3 * dt;
				s.age += dt;
			}
			for (const c of crackle) c.age += dt;
			sparks = sparks.filter((s) => s.age < s.life);
			crackle = crackle.filter((c) => c.age < c.life);
			if (!stepped && sparks.length === 0 && crackle.length === 0) return false;
			paint(frame);
			return true;
		},
		idle: () => lastReduced || !alive,
	};
}
