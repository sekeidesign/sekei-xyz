import type { EntryKind } from "./timeline";

/**
 * Filters live in a query param so several can be active at once:
 * /?kind=launch,craft,work. No param means everything.
 */
export const FILTER_PARAM = "kind";

export const FILTER_KINDS = {
	launch: "launch",
	book: "book",
	craft: "experiment",
	work: "note",
	essay: "writing",
} as const satisfies Record<string, EntryKind>;

export type FilterSlug = keyof typeof FILTER_KINDS;

/** Tab order from the design, independent of how many entries each kind has. */
export const FILTER_ORDER: FilterSlug[] = [
	"launch",
	"book",
	"craft",
	"work",
	"essay",
];

export const FILTER_LABELS: Record<FilterSlug, string> = {
	launch: "Launch",
	book: "Book",
	craft: "Craft",
	work: "Work",
	essay: "Essay",
};

/** Reverse lookup, for deciding whether an entry passes the current filter. */
export const KIND_FILTER = Object.fromEntries(
	Object.entries(FILTER_KINDS).map(([slug, kind]) => [kind, slug]),
) as Record<EntryKind, FilterSlug>;

/** Slugs that were renamed, so links shared under the old name keep working. */
const RENAMED: Record<string, FilterSlug> = {
	apps: "launch",
	launches: "launch",
	books: "book",
	experiments: "craft",
	writing: "essay",
};

export function isFilterSlug(value: string): value is FilterSlug {
	return value in FILTER_KINDS;
}

/** Unknown slugs are dropped rather than 404ing — a stale link still works. */
export function parseFilters(value: string | null): Set<FilterSlug> {
	if (!value) return new Set();
	return new Set(
		value
			.split(",")
			.map((s) => RENAMED[s.trim()] ?? s.trim())
			.filter(isFilterSlug),
	);
}

/** Serialised in FILTER_ORDER so the same selection always gives the same URL. */
export function serializeFilters(selected: Set<FilterSlug>): string {
	return FILTER_ORDER.filter((slug) => selected.has(slug)).join(",");
}
