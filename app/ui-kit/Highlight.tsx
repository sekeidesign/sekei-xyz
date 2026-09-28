"use client";

import { Highlight as Mark } from "@highlighters/react";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { PEN, PEN_STILL } from "./quote-pen";

export function Highlight({ children }: { children: ReactNode }) {
	const reducedMotion = usePrefersReducedMotion();

	return <Mark options={reducedMotion ? PEN_STILL : PEN}>{children}</Mark>;
}
