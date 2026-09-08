"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Module scope, so it survives soft navigation and resets on a document load —
// exactly the lifetime of the history entries router.back() can reach.
let lastPath: string | null = null;
let depth = 0;

/**
 * Counts distinct paths visited in this document. Mounted once at the root,
 * above every route, so it keeps counting while pages come and go.
 */
export function NavigationTracker() {
	const pathname = usePathname();

	useEffect(() => {
		// Counting paths rather than effect runs: StrictMode fires this twice on
		// mount, and a repeat of the same path is not a new entry.
		if (pathname === lastPath) return;
		lastPath = pathname;
		depth += 1;
	}, [pathname]);

	return null;
}

/**
 * Whether the previous history entry belongs to this app. On a cold load it is
 * whatever site sent the user here, or nothing at all, and router.back() would
 * take them off the site.
 */
export function canGoBack() {
	return depth > 1;
}
