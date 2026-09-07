"use client";

import type { ReactNode } from "react";
import { LivePreview } from "../LivePreview";
import { OutboundLink } from "../OutboundLink";
import { SocialBar } from "../social/SocialBar";
import { Post } from "./Post";
import { PostHeader } from "./PostHeader";
import type { TimelineEntry } from "@/lib/timeline";

interface PostCardProps {
	entry: TimelineEntry;
	/** First item is above the fold; skip the scroll gate to avoid a blank box. */
	eager?: boolean;
	/** Links the card to its post. Off on the post's own page, where the same card is the header. */
	linked?: boolean;
	/** h1 on the post's own page, where this card is the page's leading title. */
	heading?: "h1" | "h2";
	/** `article` for a card in the feed, which stands on its own. */
	as?: "div" | "article";
	/** Rendered MDX body, for entries that show in full in the feed. */
	children?: ReactNode;
}

export function PostCard({
	entry,
	eager,
	linked = true,
	heading = "h2",
	as,
	children,
}: PostCardProps) {
	const href = linked && entry.hasPage ? `/p/${entry.slug}` : undefined;

	const media = entryMedia(entry, eager);
	const aside = entry.kind === "book" || entry.kind === "launch";
	const layout = media && aside ? "aside" : "column";

	return (
		<Post as={as} id={entry.slug} href={href} layout={layout}>
			<Post.Body>
				{/* Entries without a page of their own show their whole body in place
				    of the excerpt, already styled by mdx-components. */}
				{children ? (
					<>
						<Post.Meta kind={entry.kind} date={entry.date} draft={entry.draft} />
						<Post.Title
							as={heading}
							subtitle={entry.subtitle}
							icon={entry.kind === "note" ? entry.icon : undefined}
							iconAlt={entry.subtitle ?? entry.title}
						>
							{entry.title}
						</Post.Title>
						{children}
					</>
				) : (
					<PostHeader entry={entry} heading={heading} href={href} />
				)}

				{entry.preview === "live" && (
					<LivePreview
						slug={entry.slug}
						previewCost={entry.previewCost}
						previewHeight={entry.previewHeight}
						className={entry.previewClassName}
						eager={eager}
					/>
				)}

				{layout === "column" && media}

				<PostCardFooter entry={entry} href={href} />
			</Post.Body>

			{layout === "aside" && media}
		</Post>
	);
}

/**
 * Ordered by kind, and the order matters: a launch with no cover falls through
 * to the generic branch so its icon still gets a frame.
 */
function entryMedia(entry: TimelineEntry, eager?: boolean) {
	if (entry.kind === "book") {
		if (!entry.cover) return null;
		return (
			<Post.BookCover
				book={{
					id: entry.slug,
					title: entry.title,
					author: entry.author ?? "",
					cover: entry.cover,
					spineColor: entry.spineColor ?? "#4a5568",
					rating: entry.rating ?? 0,
				}}
			/>
		);
	}

	if (entry.kind === "launch" && entry.cover) {
		// Too wide for a narrow column — PostHeader's Title shows the app's own
		// icon there instead, so this only needs room at md and up.
		return (
			<div className="hidden md:block">
				<Post.PhoneMedia src={entry.cover} alt={entry.title} priority={eager} />
			</div>
		);
	}

	if (entry.kind === "experiment" || entry.kind === "note") return null;
	if (!entry.cover && !entry.icon) return null;

	return (
		<Post.Media
			src={entry.cover}
			alt={entry.title}
			badge={entry.icon}
			badgeAlt={entry.subtitle ?? entry.title}
			priority={eager}
			aspect={entry.coverAspect}
		/>
	);
}

function PostCardFooter({
	entry,
	href,
}: {
	entry: TimelineEntry;
	href?: string;
}) {
	return (
		<Post.Footer>
			<div className="flex items-center gap-2">
				<SocialBar
					slug={entry.slug}
					// Notes have no page of their own, so their link points at the feed.
					sharePath={href ?? `/timeline#${entry.slug}`}
				/>
				{entry.kind === "launch" && entry.link && (
					<OutboundLink href={entry.link} label={entry.linkLabel} />
				)}
			</div>
			{entry.kind === "experiment" && entry.sourceUrl && (
				<Post.CodeLink href={entry.sourceUrl} />
			)}
		</Post.Footer>
	);
}
