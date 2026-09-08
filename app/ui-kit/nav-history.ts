"use client";

// Module scope, so it survives soft navigation and resets on a document load —
// exactly the lifetime of the history entries router.back() can reach.
let lastPath: string | null = null;
let depth = 0;

/**
 * Counts a path the moment it differs from the one before it: StrictMode fires
 * the tracker's effect twice on mount, and a repeat is not a new entry.
 */
export function markPath(path: string) {
	if (path === lastPath) return;
	lastPath = path;
	depth += 1;
}

/**
 * Whether the previous history entry belongs to this app. On a cold load it is
 * whatever site sent the user here, or nothing at all, and router.back() would
 * take them off the site.
 */
export function canGoBack() {
	return depth > 1;
}
