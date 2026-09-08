export interface Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	age: number;
	life: number;
	phase: number;
}

/** 0–1 wink: a slow sine per particle, offset by its own phase. */
export const twinkle = (t: number, phase: number, hz = 1.6) =>
	(Math.sin(t * hz * Math.PI * 2 + phase) + 1) / 2;

/** Arms flare only across the top of the wink, so the plus is a flash, not a shape. */
export const arms = (tw: number) => Math.max(0, (tw - 0.8) * 5);
