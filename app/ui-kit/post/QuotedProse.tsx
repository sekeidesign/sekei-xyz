"use client";

import { useHighlight } from "@highlighters/react";
import { type ReactNode, useMemo, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { PEN, PEN_STILL, QUOTATION } from "../quote-pen";

export function QuotedProse({ children }: { children: ReactNode }) {
	// State, not a ref: the hook reads the target in a layout effect, and a ref
	// set during render is still null by then.
	const [root, setRoot] = useState<HTMLElement | null>(null);
	const reducedMotion = usePrefersReducedMotion();

	// The hook keys its effect on target identity, so a fresh object each render
	// would tear the marks down and redraw them.
	const target = useMemo(
		() => (root ? { text: QUOTATION, root } : null),
		[root],
	);

	useHighlight(target, reducedMotion ? PEN_STILL : PEN);

	return <div ref={setRoot}>{children}</div>;
}
