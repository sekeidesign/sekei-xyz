"use client";

import { useInView } from "motion/react";
import { useMemo, useRef } from "react";
import { DitherCanvas } from "@/components/shad-fx";
import { sprite } from "./sprite";

export function HorseCover() {
	const ref = useRef<HTMLDivElement>(null);
	const inView = useInView(ref, { amount: 0.3 });
	const effect = useMemo(
		() =>
			sprite({
				src: "/covers/on-building-faster-horses/horse.png",
				frames: 10,
				fps: 10,
			}),
		[],
	);

	return (
		<div ref={ref} className="absolute inset-0 overflow-hidden bg-white">
			<DitherCanvas effect={effect} active={inView} />
		</div>
	);
}
