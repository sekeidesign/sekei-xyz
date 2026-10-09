"use client";

import { useInView } from "motion/react";
import { type ComponentType, useEffect, useRef, useState } from "react";
import {
	beam,
	bolt,
	DitherCanvas,
	type FxFactory,
	fire,
	rain,
	useFx,
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
	factory: FxFactory<unknown>;
	options?: unknown;
	Icon: IconComponent;
	tint: string;
	wash: string;
}[] = [
	{
		name: "fire",
		factory: fire as FxFactory<unknown>,
		Icon: FilledFire,
		tint: "text-orange-600",
		wash: "bg-red-100 shadow-orange-500/20",
	},
	{
		name: "rain",
		factory: rain as FxFactory<unknown>,
		Icon: RainIcon,
		tint: "text-sky-500",
		wash: "bg-sky-100 shadow-sky-500/20",
	},
	{
		name: "bolt",
		factory: bolt as FxFactory<unknown>,
		options: { target: CENTER },
		Icon: ActionIcon,
		tint: "text-amber-400",
		wash: "bg-amber-100 shadow-amber-500/20",
	},
	{
		name: "beam",
		factory: beam as FxFactory<unknown>,
		options: { origin: CENTER },
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
export function ShadFxCover({
	cell,
	hold = HOLD_MS,
	fireRate,
	icon = 24,
}: {
	/** Dither cell size in CSS px; the canvas's own default when left out. */
	cell?: number;
	/** How long each effect stays on before handing over, in ms. */
	hold?: number;
	/** Fire's simulation steps per second; higher flickers faster. */
	fireRate?: number;
	/** The icon's size in px; the disc around it keeps the same 8px margin. */
	icon?: number;
} = {}) {
	const ref = useRef<HTMLDivElement>(null);
	const inView = useInView(ref, { amount: 0.3 });
	const [tick, setTick] = useState(0);
	const current = tick % EFFECTS.length;

	useEffect(() => {
		if (!inView) return;
		const id = setInterval(() => setTick((count) => count + 1), hold);
		return () => clearInterval(id);
	}, [inView, hold]);

	return (
		<div ref={ref} className="absolute inset-0 overflow-hidden bg-white">
			{EFFECTS.map(({ name, factory, options }, index) => (
				<Layer
					key={name}
					factory={factory}
					options={name === "fire" && fireRate !== undefined ? { rate: fireRate } : options}
					cell={cell}
					active={inView && index === current}
				/>
			))}
			<div className="absolute inset-0 flex items-center justify-center">
				<span className="flex rounded-full bg-white p-1 ring-1 ring-gray-500/10 shadow-sm">
					<span className="relative" style={{ width: icon + 16, height: icon + 16 }}>
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
									<Icon size={icon} className={tint} />
								</DitherReveal>
							</span>
						))}
					</span>
				</span>
			</div>
		</div>
	);
}

function Layer({
	factory,
	options,
	cell,
	active,
}: {
	factory: FxFactory<unknown>;
	options?: unknown;
	cell?: number;
	active: boolean;
}) {
	const fx = useFx(factory, options);
	return <DitherCanvas effect={fx} cell={cell} active={active} />;
}
