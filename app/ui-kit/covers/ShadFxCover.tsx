"use client";

import { useInView } from "motion/react";
import { type ComponentType, useEffect, useMemo, useRef, useState } from "react";
import {
	beam,
	bolt,
	DitherCanvas,
	type FxEffect,
	fire,
	rain,
} from "@/components/shad-fx";
import { cn } from "../cn";
import { WASH } from "../figures/Disc";
import { ActionIcon } from "../icons/ActionIcon";
import { FireIcon } from "../icons/FireIcon";
import { LampIcon } from "../icons/LampIcon";
import { RainIcon } from "../icons/RainIcon";
import { DitherReveal } from "./DitherReveal";

type IconComponent = ComponentType<{ size?: number; className?: string }>;

/** Where the disc sits, so a bolt lands on it and the beam shines from it. */
const CENTER = [0.5, 0.5] as const;

const FilledFire: IconComponent = (props) => <FireIcon filled {...props} />;

const EFFECTS: {
	name: string;
	make: () => FxEffect;
	Icon: IconComponent;
	tint: string;
	wash: string;
}[] = [
	{
		name: "fire",
		make: () => fire(),
		Icon: FilledFire,
		tint: "text-orange-600",
		wash: "bg-red-100 shadow-orange-500/20",
	},
	{
		name: "rain",
		make: () => rain(),
		Icon: RainIcon,
		tint: "text-sky-500",
		wash: "bg-sky-100 shadow-sky-500/20",
	},
	{
		name: "bolt",
		make: () => bolt({ target: CENTER }),
		Icon: ActionIcon,
		tint: "text-amber-400",
		wash: "bg-amber-100 shadow-amber-500/20",
	},
	{
		name: "beam",
		make: () => beam({ origin: CENTER }),
		Icon: LampIcon,
		tint: "text-blue-500",
		wash: "bg-blue-100 shadow-blue-500/20",
	},
];

const HOLD_MS = 2000;

/**
 * Every effect keeps its own canvas, stacked, and only one is active at a
 * time. `active` eases an engine's intensity in and out, so the handoff is a
 * crossfade rather than a cut, and an inactive engine stops its frame loop once
 * it has faded out. The disc in front swaps in step: its wash crossfades as in
 * the RAID flow, and its icon dithers through.
 */
export function ShadFxCover() {
	const ref = useRef<HTMLDivElement>(null);
	const inView = useInView(ref, { amount: 0.3 });
	const effects = useMemo(() => EFFECTS.map(({ make }) => make()), []);
	const [tick, setTick] = useState(0);
	const current = tick % EFFECTS.length;

	useEffect(() => {
		if (!inView) return;
		const id = setInterval(() => setTick((count) => count + 1), HOLD_MS);
		return () => clearInterval(id);
	}, [inView]);

	return (
		<div ref={ref} className="absolute inset-0 overflow-hidden bg-white">
			{effects.map((effect, index) => (
				<DitherCanvas
					key={EFFECTS[index].name}
					effect={effect}
					active={inView && index === current}
				/>
			))}
			<div className="absolute inset-0 flex items-center justify-center">
				<span className="flex rounded-full bg-white p-1 ring-1 ring-gray-500/10 shadow-sm">
					<span className="relative size-10">
						{EFFECTS.map(({ name, wash }, index) => (
							<span
								key={name}
								className={cn(
									"absolute inset-0 rounded-full bg-linear-to-b from-white to-transparent ring-1 ring-gray-500/10 shadow-sm",
									wash,
									WASH,
									index === current ? "opacity-100" : "opacity-0",
								)}
							/>
						))}
						{EFFECTS.map(({ name, Icon, tint }, index) => (
							<span
								key={name}
								className="absolute inset-0 flex items-center justify-center"
							>
								<DitherReveal visible={index === current}>
									<Icon size={24} className={tint} />
								</DitherReveal>
							</span>
						))}
					</span>
				</span>
			</div>
		</div>
	);
}
