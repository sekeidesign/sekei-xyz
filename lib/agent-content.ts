import { siteUrl } from "./site";
import type { TimelineEntry } from "./timeline";
import { FILTER_LABELS, KIND_FILTER } from "./timeline-filters";

export const SITE_DESCRIPTION =
	"PG Gonni is a design engineer in Montréal building interface experiments, apps and case studies. A running timeline of what he ships, reads and writes.";

export const SAME_AS = [
	"https://github.com/sekeidesign",
	"https://www.threads.com/@sekeidesign",
];

export function personJsonLd() {
	return {
		"@context": "https://schema.org",
		"@type": "Person",
		"@id": `${siteUrl}/#person`,
		name: "PG Gonni",
		jobTitle: "Design Engineer",
		description: SITE_DESCRIPTION,
		url: `${siteUrl}/`,
		image: `${siteUrl}/avatar.jpg`,
		address: {
			"@type": "PostalAddress",
			addressLocality: "Montréal",
			addressRegion: "QC",
			addressCountry: "CA",
		},
		knowsAbout: [
			"Design engineering",
			"Interface design",
			"React",
			"Next.js",
			"SwiftUI",
		],
		sameAs: SAME_AS,
	};
}

/** Safe inside <script>: JSON can't close the tag it sits in. */
export function serializeJsonLd(data: unknown): string {
	return JSON.stringify(data).replace(/</g, "\\u003c");
}

function entryUrl(entry: TimelineEntry): string | undefined {
	if (entry.hasPage) return `${siteUrl}/p/${entry.slug}`;
	return entry.link;
}

export function homeMarkdown(entries: TimelineEntry[]): string {
	const items = entries.map((entry) => {
		const url = entryUrl(entry);
		const title = url ? `[${entry.title}](${url})` : entry.title;
		const meta = [entry.date, FILTER_LABELS[KIND_FILTER[entry.kind]]];
		if (entry.author) meta.push(`by ${entry.author}`);
		const excerpt = entry.excerpt ? `: ${entry.excerpt}` : "";
		return `- ${title} (${meta.join(", ")})${excerpt}`;
	});

	return `# PG Gonni — building software in Montréal

> ${SITE_DESCRIPTION}

- [Agent guide (llms.txt)](${siteUrl}/llms.txt)
- [shad-fx agent guide](${siteUrl}/shad-fx/agents.md)
- [Sitemap](${siteUrl}/sitemap.xml)
${SAME_AS.map((url) => `- [${new URL(url).hostname}](${url})`).join("\n")}

## Timeline

Newest first: launches, books, craft experiments, work updates and essays.

${items.join("\n")}
`;
}

export function notFoundMarkdown(pathname: string): string {
	return `# Not found

There is no page at \`${pathname}\` on sekei.design. It may have moved or never existed.

- [Home](${siteUrl}/): the timeline of work, case studies and reading notes
- [llms.txt](${siteUrl}/llms.txt): what this site covers and when to use it
- [Sitemap](${siteUrl}/sitemap.xml): every public page
`;
}
