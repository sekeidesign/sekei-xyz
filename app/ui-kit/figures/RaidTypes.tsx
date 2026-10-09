"use client";

import { useEffect, useRef, useState } from "react";
import { DitherCanvas } from "@/components/shad-fx/dither/dither-canvas";
import { useFx } from "@/components/shad-fx/use-fx";
import { KIND } from "../covers/raid-log";
import { Disc } from "./Disc";
import { RAID_KINDS } from "./kinds";
import { type RaidEffectTweaks, type RaidKind, raidEffect } from "./raid-effects";
import { Surface } from "../Surface";

export interface RaidTypesTweaks extends RaidEffectTweaks {
	cell?: number;
	/** Run effects without a pointer: every one, or a single type. */
	active?: "hover" | "all" | RaidKind;
}

export function RaidTypes({ tweaks }: { tweaks?: RaidTypesTweaks }) {
	const [hovered, setHovered] = useState<RaidKind | null>(null);
	const { cell = 2, active = "hover" } = tweaks ?? {};

	return (
		<Surface className="my-6 w-full cursor-default" inner={{ className: "bg-gray-50" }}>
			<div className="grid grid-cols-2 gap-px bg-gray-500/10 sm:flex sm:h-60">
				{RAID_KINDS.map(({ kind }, index) => (
					<RaidCell
						key={kind}
						kind={kind}
						seed={index + 1}
						cell={cell}
						tweaks={tweaks}
						active={active === "all" || active === kind || hovered === kind}
						onHover={(over) =>
							setHovered((current) =>
								over ? kind : current === kind ? null : current,
							)
						}
					/>
				))}
			</div>
		</Surface>
	);
}

function RaidCell({
	kind,
	seed,
	cell,
	tweaks,
	active,
	onHover,
}: {
	kind: RaidKind;
	seed: number;
	cell: number;
	tweaks?: RaidEffectTweaks;
	active: boolean;
	onHover: (over: boolean) => void;
}) {
	const cellRef = useRef<HTMLDivElement>(null);
	const discRef = useRef<HTMLSpanElement>(null);
	const { label, wash } = RAID_KINDS.find((entry) => entry.kind === kind) ?? RAID_KINDS[0];
	const { Icon, tint } = KIND[kind];

	const { factory, options, anchor } = raidEffect(kind, tweaks);
	const fx = useFx(factory, options);
	const measured = anchor && !(anchor in options) ? anchor : undefined;

	useEffect(() => {
		const box = cellRef.current;
		const disc = discRef.current;
		if (!measured || !box || !disc) return;
		const measure = () => {
			const b = box.getBoundingClientRect();
			const d = disc.getBoundingClientRect();
			if (!b.width || !b.height) return;
			fx.set({
				[measured]: [
					(d.left + d.width / 2 - b.left) / b.width,
					(d.top + d.height / 2 - b.top) / b.height,
				],
			});
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(box);
		return () => observer.disconnect();
	}, [fx, measured]);

	return (
		<div
			ref={cellRef}
			className="relative flex h-40 flex-1 items-center justify-center bg-gray-50 sm:h-auto"
			onPointerEnter={() => onHover(true)}
			onPointerLeave={() => onHover(false)}
		>
			<DitherCanvas effect={fx} active={active} cell={cell} seed={seed} />
			<div className="relative flex flex-col items-center gap-4">
				<span ref={discRef} className="flex">
					<Disc wash={wash}>
						<Icon size={24} className={tint} />
					</Disc>
				</span>
				<span className="font-mono text-[10px] sm:text-xs uppercase whitespace-nowrap text-gray-400">
					{label}
				</span>
			</div>
		</div>
	);
}
