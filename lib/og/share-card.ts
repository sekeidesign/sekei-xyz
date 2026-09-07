import { getTimeline, type TimelineEntry } from "@/lib/timeline";

/**
 * The page's metadata has to leave `openGraph.images` unset for these — a
 * config-set image wins over the opengraph-image file and suppresses the card.
 * Each card is drawn for its subject, so the list stays short by design.
 */
export type ShareCard = "book" | "raid" | "wiki";

export function shareCard(
	slug: string,
): { entry: TimelineEntry; card: ShareCard } | undefined {
	const entry = getTimeline().find((item) => item.slug === slug);
	if (!entry?.hasPage) return undefined;
	if (entry.kind === "book" && entry.cover) return { entry, card: "book" };
	if (slug === "raid-2-0") return { entry, card: "raid" };
	if (slug === "customer-knowledge-base") return { entry, card: "wiki" };
	return undefined;
}
