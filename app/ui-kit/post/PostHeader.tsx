import { StarRating } from "../StarRating";
import { Post } from "./Post";
import type { TimelineEntry } from "@/lib/timeline";

/**
 * The identity block for a post: kind, date, title and copy. Shared so a feed
 * card and the top of its own page can't drift apart.
 */
export function PostHeader({
	entry,
	heading = "h2",
	href,
}: {
	entry: TimelineEntry;
	/** h1 when the post is the page, h2 for a card in the feed. */
	heading?: "h1" | "h2";
	/** Makes the title a link. Omit on the page — it's already there. */
	href?: string;
}) {
	const isBook = entry.kind === "book";
	const isLaunch = entry.kind === "launch";

	const meta = <Post.Meta kind={entry.kind} date={entry.date} draft={entry.draft} />;

	const title = (
		<Post.Title
			href={href}
			as={heading}
			byline={isBook && entry.author ? `by ${entry.author}` : undefined}
			subtitle={entry.subtitle}
			// Work posts show their mark inline; other kinds badge it on the media.
			icon={entry.kind === "note" ? entry.icon : undefined}
			iconAlt={entry.subtitle ?? entry.title}
		>
			{entry.title}
		</Post.Title>
	);

	return (
		<>
			{isLaunch && entry.icon ? (
				// Grouped with meta so the icon sits against their combined height — against
				// the title's single line the row stretched. PhoneMedia takes over at md and up.
				<div className="flex items-center gap-3 self-stretch">
					<div className="flex-1 min-w-0 flex flex-col gap-2.5">
						{meta}
						{title}
					</div>
					<div className="md:hidden">
						<Post.AppIcon src={entry.icon} alt={entry.title} />
					</div>
				</div>
			) : (
				<>
					{meta}
					{title}
				</>
			)}

			{isBook && entry.rating !== undefined && (
				<StarRating rating={entry.rating} className="mb-2" />
			)}

			{entry.excerpt && !isBook && (
				<Post.Description clamp={entry.kind === "launch" ? 2 : 3}>
					{entry.excerpt}
				</Post.Description>
			)}
		</>
	);
}
