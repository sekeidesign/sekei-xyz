"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

const loadFeatures = () => import("./features").then((mod) => mod.default);

/**
 * Every animated component here uses `m` rather than `motion`, which ships no
 * features of its own — they arrive through this provider, in a chunk of their
 * own rather than in the initial bundle.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
	return (
		<MotionConfig reducedMotion="user">
			<LazyMotion features={loadFeatures}>{children}</LazyMotion>
		</MotionConfig>
	);
}
