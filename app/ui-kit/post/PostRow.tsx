"use client";

import { useRouter } from "next/navigation";
import type { MouseEvent, PointerEventHandler, ReactNode } from "react";
import { cn } from "../cn";
import { PanelRow } from "../PanelRow";

/**
 * Makes the whole card a click target for its post.
 *
 * Deliberately NOT an <a> wrapping the card: it contains the reaction, copy-link
 * and source controls, and nesting interactive elements in an anchor breaks
 * them. The title stays a real link — the keyboard and screen-reader path — and
 * this adds a redundant click area that bows out for controls and selections.
 */
export function PostRow({
	as,
	href,
	id,
	className,
	children,
	onPointerEnter,
	onPointerLeave,
}: {
	as?: "div" | "article";
	href?: string;
	id?: string;
	className?: string;
	children: ReactNode;
	onPointerEnter?: PointerEventHandler<HTMLElement>;
	onPointerLeave?: PointerEventHandler<HTMLElement>;
}) {
	const router = useRouter();

	if (!href) {
		return (
			<PanelRow
				as={as}
				id={id}
				className={className}
				onPointerEnter={onPointerEnter}
				onPointerLeave={onPointerLeave}
			>
				{children}
			</PanelRow>
		);
	}

	const onClick = (event: MouseEvent<HTMLElement>) => {
		if (event.defaultPrevented) return;

		// Any real control wins: the reaction and copy-link buttons, the title
		// link, the source link, the book cover.
		if (
			(event.target as HTMLElement).closest(
				"a, button, input, textarea, select, [role='button'], [data-no-card-link]",
			)
		) {
			return;
		}

		// Don't navigate out from under someone selecting the excerpt.
		if (window.getSelection()?.toString()) return;

		// Match what a real link does with a modifier held.
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.button === 1) {
			window.open(href, "_blank", "noopener");
			return;
		}

		router.push(href);
	};

	return (
		<PanelRow
			as={as}
			id={id}
			onClick={onClick}
			onPointerEnter={onPointerEnter}
			onPointerLeave={onPointerLeave}
			// The hover fill is suppressed while the pointer is inside an opted-out
			// surface (a live demo), via :has() — no pointer state to track.
			className={cn("post-card cursor-pointer rounded-2xl", className)}
		>
			{children}
		</PanelRow>
	);
}
