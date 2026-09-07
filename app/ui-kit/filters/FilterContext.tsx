"use client";

import { usePathname, useRouter } from "next/navigation";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import {
	FILTER_PARAM,
	type FilterSlug,
	parseFilters,
	serializeFilters,
} from "@/lib/timeline-filters";

interface FilterContextValue {
	selected: Set<FilterSlug>;
	toggle: (slug: FilterSlug) => void;
	clear: () => void;
	/**
	 * Whether the filters apply to what's on screen. False anywhere but the feed,
	 * where nothing is filtered and every tab reads unselected.
	 */
	active: boolean;
}

/** The one route the filters describe. */
const FEED_PATH = "/";

const FilterContext = createContext<FilterContextValue | null>(null);

/**
 * Multi-select filter state, mirrored to the URL.
 *
 * Read from the URL after mount rather than through useSearchParams, which
 * would opt this static route into dynamic rendering. pushState rather than
 * router.replace, so toggling a tab doesn't refetch — back/forward via popstate.
 */
export function FilterProvider({ children }: { children: ReactNode }) {
	const [selected, setSelected] = useState<Set<FilterSlug>>(new Set());
	const [routed, setRouted] = useState(false);
	const router = useRouter();
	// usePathname, not useSearchParams: the route stays static, and the param
	// itself is read from window.location once the client is running.
	const pathname = usePathname();

	// The build prerenders this layout without a pathname, so the first client
	// render has to reach the same answer or React keeps the server's class — a
	// hydration mismatch it warns about but never patches, and the re-render
	// after it diffs clean. Assuming the feed puts the one route the tabs act on
	// right at first paint; anywhere else corrects on mount.
	useEffect(() => setRouted(true), []);
	const onFeed = routed ? pathname === FEED_PATH : true;

	useEffect(() => {
		// Leaving the feed drops the selection rather than carrying it along —
		// a lit tab beside a post would claim the post was one of N results.
		if (!onFeed) {
			setSelected(new Set());
			return;
		}

		const read = () =>
			setSelected(
				parseFilters(
					new URLSearchParams(window.location.search).get(FILTER_PARAM),
				),
			);
		read();
		window.addEventListener("popstate", read);
		return () => window.removeEventListener("popstate", read);
	}, [onFeed]);

	const write = useCallback(
		(next: Set<FilterSlug>) => {
			setSelected(next);
			const value = serializeFilters(next);

			// Off the feed there are no existing params worth preserving and no feed
			// to re-filter in place, so this is a real navigation.
			if (!onFeed) {
				router.push(value ? `${FEED_PATH}?${FILTER_PARAM}=${value}` : FEED_PATH);
				return;
			}

			const params = new URLSearchParams(window.location.search);
			if (value) params.set(FILTER_PARAM, value);
			else params.delete(FILTER_PARAM);
			const query = params.toString();
			window.history.pushState(
				null,
				"",
				query ? `?${query}` : window.location.pathname,
			);
		},
		[onFeed, router],
	);

	const toggle = useCallback(
		(slug: FilterSlug) => {
			const next = new Set(selected);
			if (next.has(slug)) next.delete(slug);
			else next.add(slug);
			write(next);
		},
		[selected, write],
	);

	const clear = useCallback(() => write(new Set()), [write]);

	const value = useMemo(
		() => ({ selected, toggle, clear, active: onFeed }),
		[selected, toggle, clear, onFeed],
	);

	return (
		<FilterContext.Provider value={value}>{children}</FilterContext.Provider>
	);
}

export function useFilters() {
	const ctx = useContext(FilterContext);
	if (!ctx) {
		throw new Error("useFilters must be used inside a FilterProvider");
	}
	return ctx;
}
