import { getTimeline, type TimelineEntry } from "@/lib/timeline";

/**
 * Which generated share card a post gets, if any. The page's metadata has to
 * leave `openGraph.images` unset for these — a config-set image wins over the
 * opengraph-image file and would suppress the generated card.
 *
 * Each card is drawn for its subject rather than filled from a template, so
 * this is a short list by design, not a lookup waiting to be generalised.
 */
export type ShareCard = "book" | "raid";

export function shareCard(
	slug: string,
): { entry: TimelineEntry; card: ShareCard } | undefined {
	const entry = getTimeline().find((item) => item.slug === slug);
	if (!entry?.hasPage) return undefined;
	if (entry.kind === "book" && entry.cover) return { entry, card: "book" };
	if (slug === "raid-2-0") return { entry, card: "raid" };
	return undefined;
}
