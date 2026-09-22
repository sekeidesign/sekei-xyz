"use client";

import { m, useSpring, useTransform } from "motion/react";
import { useMemo, useRef } from "react";
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

// The same spring as the ProfileCard in the sidebar, so the two float the same
// way. The tilt is shallower: this card is three times as wide, and at the
// sidebar card's angle its far edge would swing much further in depth.
const MAX_TILT = 6;
const SPRING = { stiffness: 350, damping: 20 };

/**
 * The canvas sits behind the card's surface, so it slides against the tilt:
 * turn the right edge away and what is behind the surface drifts left, as
 * through a window. PARALLAX is px per degree; at the full MAX_TILT / 2 of
 * rotateY that is 7px, and BLEED is how far the canvas runs past each side to
 * cover it. Only the x axis moves — fire seeds its bottom row, rain splashes
 * on it and snow drifts onto it, so the floor stays flush with the card's edge
 * rather than hidden behind a vertical bleed.
 */
const PARALLAX = 2.4;
const BLEED = 12;

export function EffectCard({
	name,
	summary,
}: {
	name: EffectName;
	summary: string;
}) {
	const effect = useMemo(() => FACTORIES[name](), [name]);
	const ref = useRef<HTMLElement>(null);
	const z = useSpring(0);
	const rotateX = useSpring(0, SPRING);
	const rotateY = useSpring(0, SPRING);
	const shiftX = useTransform(rotateY, (deg) => -deg * PARALLAX);

	const settle = () => {
		rotateX.set(0);
		rotateY.set(0);
		z.set(0);
	};

	return (
		<m.figure
			ref={ref}
			style={{ transformPerspective: 500, z, rotateX, rotateY }}
			onPointerMove={(event) => {
				if (event.pointerType !== "mouse" || !ref.current) return;
				const rect = ref.current.getBoundingClientRect();
				const xPercent = (event.clientX - rect.left) / rect.width;
				const yPercent = (event.clientY - rect.top) / rect.height;
				rotateX.set(MAX_TILT * (0.5 - yPercent));
				rotateY.set(MAX_TILT * (xPercent - 0.5));
			}}
			onPointerEnter={(event) => {
				if (event.pointerType === "mouse") z.set(10);
			}}
			onPointerLeave={settle}
			onPointerCancel={settle}
			onPointerDown={(event) => {
				if (event.pointerType === "mouse") z.set(-10);
			}}
			onPointerUp={(event) => {
				if (event.pointerType === "mouse") z.set(10);
			}}
			className={cn(
				"relative rounded-xl hover:will-change-transform",
				"transition-shadow duration-300 ease-out hover:shadow-lg",
				SURFACE_OUTER,
			)}
		>
			<div className={cn("relative h-64 rounded-lg", SURFACE_INNER)}>
				<m.div
					aria-hidden
					style={{ x: shiftX, left: -BLEED, right: -BLEED }}
					className="absolute inset-y-0"
				>
					<DitherCanvas effect={effect} />
				</m.div>
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
		</m.figure>
	);
}
