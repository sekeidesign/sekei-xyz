import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExperimentDivider } from "@ui-kit/Experiment";
import { PanelRow } from "@ui-kit/PanelRow";
import { PostCard } from "@ui-kit/post/PostCard";
import { QuotedProse } from "@ui-kit/post/QuotedProse";
import { TagRow } from "@ui-kit/TagRow";
import { bookCardEntry } from "@/lib/og/book-card";
import { getTimeline } from "@/lib/timeline";

export function generateStaticParams() {
	const params: { slug: string }[] = [];
	for (const entry of getTimeline()) {
		if (entry.hasPage) params.push({ slug: entry.slug });
	}
	return params;
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const entry = getTimeline().find((item) => item.slug === slug);
	if (!entry || !entry.hasPage) return {};

	const title = `${entry.title} | PG Gonni`;
	const description =
		entry.kind === "book"
			? `Thoughts on ${entry.title} by PG Gonni`
			: entry.excerpt;
	return {
		// The root layout templates the tab title, so this passes the bare entry
		// title and keeps the full string for OG, which isn't templated.
		title: entry.title,
		description,
		alternates: { canonical: `/p/${slug}` },
		openGraph: {
			title,
			description,
			// Books draw their own card in opengraph-image.tsx; an image set here
			// would win over that file. The rest get the site card rather than
			// their own cover, half of which are WebP that LinkedIn won't render.
			...(bookCardEntry(slug) ? {} : { images: "/og-image.jpg" }),
		},
	};
}

export default async function PostPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const entry = getTimeline().find((item) => item.slug === slug);
	// A note has no page of its own — the feed shows it in full.
	if (!entry || !entry.hasPage) notFound();

	// Only the body compiles here — the feed never reaches this import.
	const { default: Body } = await import(
		`../../../content/${slug}/index.mdx`
	);

	return (
		<>
			<PostCard entry={entry} eager linked={false} heading="h1" />

			<ExperimentDivider inline />

			<PanelRow className="flex flex-col gap-6 md:p-8 p-4">
				<article>
					{entry.kind === "book" ? (
						<QuotedProse>
							<Body />
						</QuotedProse>
					) : (
						<Body />
					)}
				</article>
				{entry.tags.length > 0 && <TagRow tags={entry.tags} />}
			</PanelRow>
		</>
	);
}
