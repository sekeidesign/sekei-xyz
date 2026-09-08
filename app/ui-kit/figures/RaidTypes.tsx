"use client";

import { Fragment, useMemo, useRef, useState } from "react";
import { cn } from "../cn";
import { KIND } from "../covers/raid-log";
import type { BloomInput } from "../dither/bloom";
import { DitherCanvas } from "../dither/DitherCanvas";
import { SURFACE_INNER, SURFACE_OUTER } from "../post/surface";
import { Disc } from "./Disc";
import { RAID_KINDS } from "./kinds";
import { type RaidEffectTweaks, type RaidKind, raidEffect } from "./raid-effects";

export interface RaidTypesTweaks extends RaidEffectTweaks {
	cell?: number;
	bloom?: BloomInput;
	/** Run effects without a pointer: every one, or a single type. */
	active?: "hover" | "all" | RaidKind;
}

export function RaidTypes({ tweaks }: { tweaks?: RaidTypesTweaks }) {
	const [hovered, setHovered] = useState<RaidKind | null>(null);
	const { cell = 2, bloom = "soft", active = "hover" } = tweaks ?? {};

	return (
		<div className={cn("my-6 w-full cursor-default rounded-xl", SURFACE_OUTER)}>
			<div
				className={cn(
					"flex h-48 sm:h-60 items-stretch rounded-lg",
					SURFACE_INNER,
					"bg-gray-50",
				)}
			>
				{RAID_KINDS.map(({ kind }, index) => (
					<Fragment key={kind}>
						{index > 0 && <span className="w-px shrink-0 bg-gray-500/10" />}
						<RaidCell
							kind={kind}
							seed={index + 1}
							cell={cell}
							bloom={bloom}
							tweaks={tweaks}
							active={active === "all" || active === kind || hovered === kind}
							onHover={(over) =>
								setHovered((current) =>
									over ? kind : current === kind ? null : current,
								)
							}
						/>
					</Fragment>
				))}
			</div>
		</div>
	);
}

function RaidCell({
	kind,
	seed,
	cell,
	bloom,
	tweaks,
	active,
	onHover,
}: {
	kind: RaidKind;
	seed: number;
	cell: number;
	bloom: BloomInput;
	tweaks?: RaidEffectTweaks;
	active: boolean;
	onHover: (over: boolean) => void;
}) {
	const cellRef = useRef<HTMLDivElement>(null);
	const discRef = useRef<HTMLSpanElement>(null);
	const { label, wash } = RAID_KINDS.find((entry) => entry.kind === kind) ?? RAID_KINDS[0];
	const { Icon, tint } = KIND[kind];

	const effect = useMemo(() => {
		const anchor = (): readonly [number, number] => {
			const box = cellRef.current?.getBoundingClientRect();
			const disc = discRef.current?.getBoundingClientRect();
			if (!box || !disc || !box.width || !box.height) return [0.5, 0.43];
			return [
				(disc.left + disc.width / 2 - box.left) / box.width,
				(disc.top + disc.height / 2 - box.top) / box.height,
			];
		};
		return raidEffect(kind, anchor, tweaks);
	}, [kind, tweaks]);

	return (
		<div
			ref={cellRef}
			className="relative flex flex-1 items-center justify-center"
			onPointerEnter={() => onHover(true)}
			onPointerLeave={() => onHover(false)}
		>
			<DitherCanvas effect={effect} active={active} cell={cell} seed={seed} bloom={bloom} />
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
