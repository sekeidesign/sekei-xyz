import { getTimeline } from "@/lib/timeline";
import { ExperimentDivider } from "./Experiment";
import { PostCard } from "./post/PostCard";

/**
 * Posts from the timeline, drawn as the feed draws them. A slug the timeline
 * doesn't carry — a draft in production — is left out rather than linked dead.
 */
export function TimelinePosts({ slugs }: { slugs: string[] }) {
	const timeline = getTimeline();
	const entries = slugs.flatMap((slug) => {
		const entry = timeline.find((candidate) => candidate.slug === slug);
		return entry ? [entry] : [];
	});

	return (
		// Out by the card's own padding, so its text lines up with the page's.
		<ul className="-mx-2 flex flex-col md:-mx-8">
			{entries.map((entry, index) => (
				<li key={entry.slug}>
					<PostCard entry={entry} as="article" />
					{index < entries.length - 1 && <ExperimentDivider inline />}
				</li>
			))}
		</ul>
	);
}
