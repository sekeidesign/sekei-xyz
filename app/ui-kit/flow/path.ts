import type { Point } from "./elk";

const distance = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y);

const toward = (from: Point, to: Point, length: number): Point => {
	const total = distance(from, to);
	if (total === 0) return from;
	return {
		x: from.x + ((to.x - from.x) / total) * length,
		y: from.y + ((to.y - from.y) / total) * length,
	};
};

function dedupe(points: Point[]) {
	return points.filter(
		(point, index) => index === 0 || distance(point, points[index - 1]) > 0.5,
	);
}

export function pathLength(points: Point[]) {
	let length = 0;
	for (let index = 1; index < points.length; index++) {
		length += distance(points[index - 1], points[index]);
	}
	return length;
}

/** Pulls the last point back so a line stops at an arrowhead's base, not its tip. */
export function trimEnd(points: Point[], length: number) {
	const clean = dedupe(points);
	if (clean.length < 2 || length <= 0) return clean;
	const last = clean[clean.length - 1];
	const before = clean[clean.length - 2];
	const cut = Math.min(length, distance(before, last));
	return [...clean.slice(0, -1), toward(last, before, cut)];
}

export function roundedPath(points: Point[], radius: number) {
	const clean = dedupe(points);
	if (clean.length === 0) return "";

	let d = `M${clean[0].x},${clean[0].y}`;
	for (let index = 1; index < clean.length - 1; index++) {
		const previous = clean[index - 1];
		const corner = clean[index];
		const next = clean[index + 1];
		// Half of each neighbouring segment at most, so two corners on a short
		// segment meet in the middle instead of overlapping.
		const r = Math.min(
			radius,
			distance(previous, corner) / 2,
			distance(corner, next) / 2,
		);
		const start = toward(corner, previous, r);
		const end = toward(corner, next, r);
		d += ` L${start.x},${start.y} Q${corner.x},${corner.y} ${end.x},${end.y}`;
	}
	const last = clean[clean.length - 1];
	return `${d} L${last.x},${last.y}`;
}

/** A triangle pointing along the path's last segment, its tip on the last point. */
export function arrowHead(points: Point[], length: number, width: number) {
	const clean = dedupe(points);
	if (clean.length < 2) return "";
	const tip = clean[clean.length - 1];
	const before = clean[clean.length - 2];
	const base = toward(tip, before, length);
	const angle = Math.atan2(tip.y - before.y, tip.x - before.x) + Math.PI / 2;
	const dx = (Math.cos(angle) * width) / 2;
	const dy = (Math.sin(angle) * width) / 2;
	return `M${tip.x},${tip.y} L${base.x + dx},${base.y + dy} L${base.x - dx},${base.y - dy}Z`;
}
