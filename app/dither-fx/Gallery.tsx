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

const TILES = [
	{
		name: "fire",
		build: () => fire(),
		summary: "Rising flame front with embers.",
	},
	{
		name: "bolt",
		build: () => bolt(),
		summary: "Lightning on a randomised interval.",
	},
	{
		name: "rings",
		build: () => rings(),
		summary: "Sonar rings pulsing from an anchor.",
	},
	{
		name: "fluid",
		build: () => fluid(),
		summary: "A sloshing level with rising bubbles.",
	},
	{
		name: "beam",
		build: () => beam(),
		summary: "A cone of light with drifting motes.",
	},
	{
		name: "rain",
		build: () => rain(),
		summary: "Slanted streaks, splashing on the floor.",
	},
	{
		name: "snow",
		build: () => snow(),
		summary: "Drifting flakes that settle into a drift.",
	},
];

function Tile({
	name,
	effect,
	summary,
}: {
	name: string;
	effect: DitherEffect;
	summary: string;
}) {
	return (
		<figure className="flex flex-col gap-2">
			<div className={cn("rounded-xl", SURFACE_OUTER)}>
				<div className={cn("relative h-40 rounded-lg", SURFACE_INNER)}>
					<DitherCanvas effect={effect} cell={3} />
				</div>
			</div>
			<figcaption className="flex flex-col gap-0.5 px-0.5">
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

export function Gallery() {
	const tiles = useMemo(
		() => TILES.map((tile) => ({ ...tile, effect: tile.build() })),
		[],
	);

	return (
		<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{tiles.map((tile) => (
				<Tile
					key={tile.name}
					name={tile.name}
					effect={tile.effect}
					summary={tile.summary}
				/>
			))}
		</div>
	);
}
