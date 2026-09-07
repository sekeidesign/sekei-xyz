import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { getTimeline } from "@/lib/timeline";

export default function sitemap(): MetadataRoute.Sitemap {
	const entries = getTimeline().filter((entry) => entry.hasPage);

	return [
		{
			url: `${siteUrl}/`,
			lastModified: entries[0]?.date,
			changeFrequency: "weekly",
			priority: 1,
		},
		...entries.map((entry) => ({
			url: `${siteUrl}/p/${entry.slug}`,
			lastModified: entry.date,
			priority: 0.8,
		})),
	];
}
