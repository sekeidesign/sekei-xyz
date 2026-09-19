"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
	const query = window.matchMedia(QUERY);
	query.addEventListener("change", onChange);
	return () => query.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;

/**
 * Read through useSyncExternalStore rather than a state initializer or a ref:
 * the server has no `matchMedia`, so React renders against a stable `false`
 * snapshot and picks up the real value — and later changes to it — on the client.
 */
export function usePrefersReducedMotion() {
	return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
