"use client";

import { m } from "motion/react";
import type {
	MouseEventHandler,
	PointerEventHandler,
	ReactNode,
} from "react";
import { cn } from "./cn";

export function PanelRow({
	as = "div",
	children,
	className,
	id,
	onClick,
	onPointerEnter,
	onPointerLeave,
}: {
	/** `article` for a card that stands on its own, e.g. a post in the feed. */
	as?: "div" | "article";
	children: ReactNode;
	className?: string;
	/** Anchor target, so a post can be linked with /timeline#slug. */
	id?: string;
	onClick?: MouseEventHandler<HTMLElement>;
	onPointerEnter?: PointerEventHandler<HTMLElement>;
	onPointerLeave?: PointerEventHandler<HTMLElement>;
}) {
	const Root = as === "article" ? m.article : m.div;

	return (
		// The click is a redundant target for the title link inside the card,
		// which is the keyboard and screen-reader path — so a plain box carries no
		// semantics of its own and needs no key handler of its own. An article's
		// own role has to survive that, hence the `as` check.
		// react-doctor-disable-next-line click-events-have-key-events
		<Root
			id={id}
			role={as === "div" && onClick ? "presentation" : undefined}
			onClick={onClick}
			onPointerEnter={onPointerEnter}
			onPointerLeave={onPointerLeave}
			className={cn("w-full scroll-mt-20", className)}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.2, ease: "easeInOut" }}
		>
			{children}
		</Root>
	);
}
