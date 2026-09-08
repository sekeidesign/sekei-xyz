"use client";

import Link from "next/link";
import type { PointerEventHandler, ReactNode } from "react";
import type { EntryKind } from "@/lib/timeline";
import { cn } from "../cn";
import { FramedIcon } from "./FramedIcon";
import { KIND_META } from "./kind-meta";
import { CodeLink } from "./PostCodeLink";
import {
	AppIcon,
	BookCover,
	Media,
	PhoneMedia,
	SquareMedia,
} from "./PostMedia";
import { PostRow } from "./PostRow";

/**
 * How a card arranges its copy and its artwork.
 *
 * `aside` — artwork beside the copy at every width, for a book cover or a phone.
 * `column` — one column at every width; a screenshot runs full width inside
 *   it, in the slot a live demo occupies on an experiment.
 * `split` — a case study: the square cover sits beside the copy at md and up,
 *   and stacks under it on a phone, where the card carries the post page's own
 *   full-width cover instead.
 */
export type PostLayout = "aside" | "column" | "split";

export function Post({
	as,
	children,
	className,
	id,
	/** Post page, if it has one. Makes the whole card a click target. */
	href,
	layout = "column",
	onPointerEnter,
	onPointerLeave,
}: {
	as?: "div" | "article";
	children: ReactNode;
	className?: string;
	id?: string;
	href?: string;
	layout?: PostLayout;
	onPointerEnter?: PointerEventHandler<HTMLElement>;
	onPointerLeave?: PointerEventHandler<HTMLElement>;
}) {
	return (
		<PostRow
			as={as}
			id={id}
			href={href}
			onPointerEnter={onPointerEnter}
			onPointerLeave={onPointerLeave}
			className={cn(
				"p-2 md:p-8",
				layout === "aside" && "flex flex-row items-center gap-6 md:gap-8",
				// No items-start: the body has to fill the card's width, or a live demo
				// or cover inside it shrink-wraps to its own copy.
				layout === "column" && "flex flex-col gap-2.5",
				layout === "split" &&
					"flex flex-col gap-2.5 md:flex-row md:items-center md:gap-8",
				className,
			)}
		>
			{children}
		</PostRow>
	);
}

/** min-w-0 so long words can't push the media off the card. */
function Body({ children }: { children: ReactNode }) {
	return (
		<div className="flex-1 min-w-0 flex flex-col items-start gap-2.5">
			{children}
		</div>
	);
}

/**
 * Short month name rather than dateStyle: "short" — all-numeric dates are hard
 * to tell apart in a list. UTC, since a post's date is a plain yyyy-mm-dd and
 * parsing it locally would shift it a day west of Greenwich.
 */
const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	year: "numeric",
	timeZone: "UTC",
});

function Meta({
	kind,
	date,
	draft,
}: {
	kind: EntryKind;
	date: string;
	draft?: boolean;
}) {
	const { label, Icon } = KIND_META[kind];

	return (
		<div className="flex items-center gap-1 self-stretch text-gray-400">
			<Icon filled />
			<span className="text-[13px] leading-[1.43] font-[500]">{label}</span>
			<span className="px-1 text-[13px] leading-[1.43] font-[500]">•</span>
			<time
				dateTime={date}
				className="shrink-0 text-[13px] leading-[1.43] font-[500]"
			>
				{DATE_FORMAT.format(new Date(`${date}T00:00:00Z`))}
			</time>
			{/* Dev only, since drafts never reach production — but without it there's no
			    way to tell a draft from a published post while working. */}
			{draft && (
				<span className="ml-auto shrink-0 text-[12px] leading-[1.33] font-mono font-[450] text-[#FF5500]">
					Draft
				</span>
			)}
		</div>
	);
}

interface TitleProps {
	children: ReactNode;
	href?: string;
	/** h2 on a card in the feed, h1 when the post is the page. */
	as?: "h1" | "h2";
	/** "lg" for a page's leading title. */
	size?: "md" | "lg";
	/** Sits inline after the title, e.g. a book's "by Patrick McGee". */
	byline?: ReactNode;
	/** Sits under the title, e.g. the company on a work post. */
	subtitle?: ReactNode;
	/** Square artwork to the right of the title, e.g. a company mark. */
	icon?: string;
	iconAlt?: string;
}

function Title({
	children,
	href,
	as: Heading = "h2",
	size = "md",
	byline,
	subtitle,
	icon,
	iconAlt,
}: TitleProps) {
	const heading = (
		<Heading
			className={cn(
				"font-[550] text-gray-900",
				size === "lg"
					? "text-[28px] leading-[1.25]"
					: "text-[20px] leading-[1.375]",
			)}
		>
			{children}
		</Heading>
	);

	return (
		<div className="flex items-center gap-3 self-stretch">
			{icon && <FramedIcon src={icon} alt={iconAlt ?? ""} size={40} />}
			<div className="flex-1 min-w-0 flex flex-col items-start justify-center">
				<div className="flex items-baseline gap-1.5 flex-wrap">
					{href ? (
						<Link href={href} className="hover:text-gray-700">
							{heading}
						</Link>
					) : (
						heading
					)}
					{byline && (
						<span className="text-[13px] leading-[1.43] font-[420] text-gray-500">
							{byline}
						</span>
					)}
				</div>
				{subtitle && (
					<span className="text-[13px] leading-[1.43] font-[420] text-gray-500">
						{subtitle}
					</span>
				)}
			</div>
		</div>
	);
}

function Description({
	children,
	clamp = 3,
}: {
	children: ReactNode;
	/** Lines before truncating. null leaves it unclamped. */
	clamp?: 2 | 3 | null;
}) {
	return (
		<p
			className={cn(
				"self-stretch text-[15px] leading-[1.625] font-[420] text-gray-500",
				clamp === 2 && "line-clamp-2",
				clamp === 3 && "line-clamp-3",
			)}
		>
			{children}
		</p>
	);
}

function Footer({ children }: { children: ReactNode }) {
	return (
		<div className="flex items-center justify-between self-stretch">
			{children}
		</div>
	);
}

// Statics rather than `Object.assign`: an assigned namespace hides every part
// from the module's export surface, which costs Fast Refresh the whole file and
// leaves the parts unfindable from outside it.
Post.Body = Body;
Post.Meta = Meta;
Post.Title = Title;
Post.Description = Description;
Post.Media = Media;
Post.SquareMedia = SquareMedia;
Post.PhoneMedia = PhoneMedia;
Post.AppIcon = AppIcon;
Post.BookCover = BookCover;
Post.Footer = Footer;
Post.CodeLink = CodeLink;
