"use client";

import { useMemo } from "react";
import {
	beam,
	bolt,
	DitherCanvas,
	type DitherEffect,
	fire,
	fluid,
	rain,
	rings,
	snow,
} from "@/components/dither-fx";
import { cn } from "@ui-kit/cn";
import { SURFACE_INNER, SURFACE_OUTER } from "@ui-kit/post/surface";

const FACTORIES = {
	fire: () => fire(),
	bolt: () => bolt(),
	rings: () => rings(),
	fluid: () => fluid(),
	beam: () => beam(),
	rain: () => rain(),
	snow: () => snow(),
} satisfies Record<string, () => DitherEffect>;

export type EffectName = keyof typeof FACTORIES;

/** A banner of the effect at its defaults, named and summarised in the corner. */
export function EffectCard({
	name,
	summary,
}: {
	name: EffectName;
	summary: string;
}) {
	const effect = useMemo(() => FACTORIES[name](), [name]);

	return (
		<figure className={cn("relative rounded-xl", SURFACE_OUTER)}>
			<div className={cn("relative h-64 rounded-lg", SURFACE_INNER)}>
				<DitherCanvas effect={effect} />
				<div
					aria-hidden
					className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-white/90 to-white/0"
				/>
			</div>
			<figcaption className="absolute inset-x-1 top-1 z-10 flex flex-col gap-0.5 p-4">
				<span className="font-mono text-[12px] font-[450] text-gray-900">
					{name}()
				</span>
				<span className="text-[13px] leading-[1.45] font-[420] text-gray-500">
					{summary}
				</span>
			</figcaption>
		</figure>
	);
}
