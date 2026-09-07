"use client";

import { m } from "motion/react";
import Image from "next/image";
import type { ReactNode } from "react";
import { Book3D } from "../book-shelf/Book3D";
import type { Book } from "../book-shelf/types";
import { cn } from "../cn";
import {
	BOOK_BOX_HEIGHT,
	BOOK_BOX_WIDTH,
	BOOK_PIVOT_X,
	BOOK_PIVOT_Y,
	BOOK_SCALE,
	BOOK_SHADOW,
	BOOK_TILT,
} from "./book-geometry";
import { FramedIcon } from "./FramedIcon";
import {
	COLUMN_INNER,
	MEDIA_SIZE,
	SURFACE_INNER,
	SURFACE_OUTER,
} from "./surface";

/**
 * The artwork slots a post card can fill: a full-width image, a square one, a
 * phone mockup, an app icon, or a book off the shelf. One per card — they are
 * alternatives, not layers, which is why they live together.
 */

/** A cover or screenshot at its own ratio, full width — the slot an experiment fills with its live demo. */
export function Media({
	src,
	alt,
	badge,
	badgeAlt,
	priority,
	/** The image's own ratio as CSS aspect-ratio, e.g. "2000 / 1374". */
	aspect,
	/** On the box the ratio sizes, for a floor under it. */
	className,
	/** A cover drawn in code, in place of an image. */
	children,
}: {
	src?: string;
	alt: string;
	badge?: string;
	badgeAlt?: string;
	priority?: boolean;
	aspect?: string;
	className?: string;
	children?: ReactNode;
}) {
	return (
		<div className={cn("self-stretch w-full rounded-xl my-2", SURFACE_OUTER)}>
			<div
				style={{ aspectRatio: aspect }}
				className={cn("relative w-full rounded-lg", SURFACE_INNER, className)}
			>
				{children}
				{!children && src && (
					<Image
						src={src}
						alt={alt}
						fill
						// The column caps at screen-md and the card spends 64px of it on
						// padding, so a cover never needs more than what is left.
						sizes={`(min-width: 768px) ${COLUMN_INNER}px, 100vw`}
						priority={priority}
						className="object-cover"
					/>
				)}
				{badge && (
					<div className="absolute top-[5px] right-[5px]">
						<FramedIcon src={badge} alt={badgeAlt ?? ""} size={24} />
					</div>
				)}
			</div>
		</div>
	);
}

/** Inner width after the frame's p-1, for sizing the image inside it. */
const MEDIA_INNER = MEDIA_SIZE - 8;

/** A cover cropped square, beside the copy — the artwork column a book and a phone also stand in. */
export function SquareMedia({
	src,
	alt,
	badge,
	badgeAlt,
	priority,
	/** A cover drawn in code, in place of an image. */
	children,
}: {
	src?: string;
	alt: string;
	badge?: string;
	badgeAlt?: string;
	priority?: boolean;
	children?: ReactNode;
}) {
	return (
		<div
			style={{ width: MEDIA_SIZE, height: MEDIA_SIZE }}
			className={cn("shrink-0 rounded-xl", SURFACE_OUTER)}
		>
			<div className={cn("relative size-full rounded-lg", SURFACE_INNER)}>
				{children}
				{!children && src && (
					<Image
						src={src}
						alt={alt}
						fill
						sizes={`${MEDIA_INNER}px`}
						priority={priority}
						className="object-cover"
					/>
				)}
				{badge && (
					<div className="absolute top-[5px] right-[5px]">
						<FramedIcon src={badge} alt={badgeAlt ?? ""} size={24} />
					</div>
				)}
			</div>
		</div>
	);
}

/**
 * Phone geometry from the design. Taller than the square on purpose: the device
 * runs off the bottom and a gradient dissolves it into the surface.
 */
const PHONE = { width: 120, height: 257, top: 1, fade: 79 };

export function PhoneMedia({
	src,
	alt,
	priority,
}: {
	src: string;
	alt: string;
	priority?: boolean;
}) {
	return (
		// No surface behind a phone: the device carries its own outline and
		// shadow, and the card's own background reads as the space around it.
		<div
			style={{ width: MEDIA_SIZE, height: MEDIA_SIZE }}
			className="relative shrink-0 overflow-clip rounded-xl"
		>
			<div className="absolute inset-0">
				<div
					style={{
						width: PHONE.width,
						height: PHONE.height,
						top: PHONE.top,
						boxShadow:
							"0 8px 24px #99a1af1a, 0 4px 12px #99a1af1a, 0 2px 3px #99a1af1a",
					}}
					className="absolute left-1/2 -translate-x-1/2 overflow-clip rounded-xl outline outline-1 outline-gray-400/15 bg-white"
				>
					<Image
						src={src}
						alt={alt}
						fill
						sizes={`${PHONE.width}px`}
						priority={priority}
						className="object-cover"
					/>
				</div>

				{/* A layer over the top, not a mask on the device: a mask applies to the
				    element's whole rendering, box-shadow included. The cost is being
				    colour-coupled to the card behind, hence gray-100. */}
				<div
					style={{
						height: PHONE.fade,
						bottom: 0,
						// --post-bg is set by the card and follows its hover state; the
						// fallback covers a card that never hovers, like a post page.
						backgroundImage:
							"linear-gradient(to bottom, transparent, var(--post-bg, var(--color-gray-100)))",
					}}
					className="absolute inset-x-0"
				/>
			</div>
		</div>
	);
}

/**
 * An app's own icon, as Title's trailingIcon on a launch post: PhoneMedia's
 * mockup is too wide for a narrow column, so mobile drops it for the icon
 * inline with the title.
 */
export function AppIcon({ src, alt }: { src: string; alt: string }) {
	return (
		<div className="relative shrink-0 size-12 overflow-hidden rounded-[14px] shadow-xl shadow-blue-600/25 ring ring-slate-500/15">
			<Image src={src} alt={alt} fill sizes="48px" className="object-cover" />
		</div>
	);
}

/**
 * The shelf's 3D book, pulled open and shrunk into a plain box with no surface,
 * ring or background. No hover openMore — the page-edge face is a flat,
 * untextured strip.
 */
export function BookCover({ book }: { book: Book }) {
	return (
		<div
			style={{ width: BOOK_BOX_WIDTH, height: BOOK_BOX_HEIGHT }}
			className="relative shrink-0"
		>
			{/* Positioned so BOOK_PIVOT sits at the box's center, then scaled and tilted
			    around that point. The travel lives on the inner m.div so Motion's
			    transform doesn't fight the static one. pointer-events-none because Book3D
			    is a <button> and would otherwise swallow the card's hover and click. */}
			<div
				className="absolute pointer-events-none"
				style={{
					left: BOOK_BOX_WIDTH / 2 - BOOK_PIVOT_X,
					top: BOOK_BOX_HEIGHT / 2 - BOOK_PIVOT_Y,
					transformOrigin: `${BOOK_PIVOT_X}px ${BOOK_PIVOT_Y}px`,
					transform: `scale(${BOOK_SCALE}) rotate(${BOOK_TILT}deg)`,
					filter: BOOK_SHADOW,
				}}
			>
				<m.div
					initial={{ y: 40, opacity: 0 }}
					whileInView={{ y: 0, opacity: 1 }}
					viewport={{ once: true, amount: 0.4 }}
					transition={{ type: "spring", duration: 0.6, bounce: 0.25 }}
				>
					<Book3D book={book} open />
				</m.div>
			</div>
		</div>
	);
}
