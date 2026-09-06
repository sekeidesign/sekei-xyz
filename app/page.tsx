import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTimeline } from "@/lib/timeline";
import { TimelineFeed } from "./TimelineFeed";

// Without a canonical the apex and www hosts index as two separate pages.
export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default async function HomePage() {
	const timeline = getTimeline();

	// Inline entries compile their bodies here so the prose travels in the RSC
	// payload instead of shipping MDX to the client. Keyed off `inline`, not
	// `!hasPage`, so a half-written post can't spill into the feed.
	const bodies: Record<string, ReactNode> = {};
	const compiling: Promise<void>[] = [];
	for (const entry of timeline) {
		if (!entry.inline) continue;
		compiling.push(
			(async () => {
				const { default: Body } = await import(
					`../content/${entry.slug}/index.mdx`
				);
				bodies[entry.slug] = <Body />;
			})(),
		);
	}
	await Promise.all(
		compiling,
	);

	return <TimelineFeed entries={timeline} bodies={bodies} />;
}
