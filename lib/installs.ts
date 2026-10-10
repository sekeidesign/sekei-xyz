import { createHash } from "node:crypto";
import { redis } from "@/lib/social";

const ENV = process.env.VERCEL_ENV ?? "local";

const totalKey = `installs:${ENV}:total`;
const dayKey = (day: string) => `installs:${ENV}:day:${day}`;
const seenKey = (day: string) => `installs:${ENV}:seen:${day}`;

const today = () => new Date().toISOString().slice(0, 10);

/**
 * One count per item, per IP, per day. The day is part of the hash so the
 * stored value can't be linked across days or reversed by brute-forcing IPv4.
 */
export async function recordInstall(item: string, ip: string) {
	if (!redis) return;

	const day = today();
	const visitor = createHash("sha256")
		.update(`${day}:${ip}`)
		.digest("hex")
		.slice(0, 16);

	const isNew = await redis.sadd(seenKey(day), `${item}:${visitor}`);
	if (!isNew) return;

	const pipeline = redis.pipeline();
	pipeline.expire(seenKey(day), 60 * 60 * 48);
	pipeline.zincrby(totalKey, 1, item);
	pipeline.hincrby(dayKey(day), item, 1);
	await pipeline.exec();
}

export async function readInstalls(): Promise<Record<string, number>> {
	if (!redis) return {};

	const flat = await redis.zrange<(string | number)[]>(totalKey, 0, -1, {
		withScores: true,
	});
	const out: Record<string, number> = {};
	for (let i = 0; i < flat.length; i += 2) {
		out[String(flat[i])] = Number(flat[i + 1]);
	}
	return out;
}

export async function readDailyInstalls(
	days: number,
): Promise<{ day: string; counts: Record<string, number> }[]> {
	const dates = Array.from({ length: days }, (_, i) => {
		const d = new Date();
		d.setUTCDate(d.getUTCDate() - (days - 1 - i));
		return d.toISOString().slice(0, 10);
	});
	if (!redis) return dates.map((day) => ({ day, counts: {} }));

	const pipeline = redis.pipeline();
	for (const day of dates) pipeline.hgetall<Record<string, number>>(dayKey(day));
	const results = (await pipeline.exec()) as (Record<string, number> | null)[];

	return dates.map((day, i) => ({
		day,
		counts: Object.fromEntries(
			Object.entries(results[i] ?? {}).map(([k, v]) => [k, Number(v)]),
		),
	}));
}
