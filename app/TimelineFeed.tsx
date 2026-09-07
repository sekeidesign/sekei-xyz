"use client";

import type { ReactNode } from "react";
import { ExperimentDivider } from "@ui-kit/Experiment";
import { useFilters } from "@ui-kit/filters/FilterContext";
import { PostCard } from "@ui-kit/post/PostCard";
import type { TimelineEntry } from "@/lib/timeline";
import { KIND_FILTER } from "@/lib/timeline-filters";

export function TimelineFeed({
	entries,
	bodies,
}: {
	entries: TimelineEntry[];
	/** Server-rendered MDX for entries that show inline (notes). */
	bodies: Record<string, ReactNode>;
}) {
	const { selected } = useFilters();

	const visible =
		selected.size === 0
			? entries
			: entries.filter((entry) => selected.has(KIND_FILTER[entry.kind]));

	return (
		<ul className="flex flex-col">
			{visible.map((entry, index) => (
				<li key={entry.slug}>
					<PostCard entry={entry} eager={index === 0} as="article">
						{bodies[entry.slug]}
					</PostCard>
					{/* Dividers sit between posts, so the feed doesn't end on one. */}
					{index < visible.length - 1 && <ExperimentDivider inline />}
				</li>
			))}
		</ul>
	);
}
