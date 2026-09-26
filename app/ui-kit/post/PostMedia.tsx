"use client";

import { m } from "motion/react";
import Image from "next/image";
import { type ReactNode, useState } from "react";
import { BOOK_HEIGHT, BOOK_WIDTH } from "../book-shelf/constants";
import type { Book } from "../book-shelf/types";
import { cn } from "../cn";
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
				// Named container: a drawn cover sizes itself off this box, which the
				// sidebar leaves narrow at md as well as on a phone.
				className={cn(
					"@container/media relative w-full rounded-lg",
					SURFACE_INNER,
					className,
				)}
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

/** A cover cropped square, beside the copy — the artwork column every aside card shares. */
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
const PHONE = { width: 120, height: 257, top: 16, fade: 79 };

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
		<div
			style={{ width: MEDIA_SIZE, height: MEDIA_SIZE }}
			className={cn("shrink-0 rounded-xl", SURFACE_OUTER)}
		>
			<div className={cn("relative size-full rounded-lg", SURFACE_INNER)}>
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
				    colour-coupled to the surface behind, hence white. */}
				<div
					style={{
						height: PHONE.fade,
						bottom: 0,
						backgroundImage:
							"linear-gradient(to bottom, transparent, var(--color-white))",
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
 * Geist's Book binding: white highlights and dark creases that, overlaid on the
 * cover's left edge, read as the fold of a bound spine.
 */
const BIND =
	"linear-gradient(90deg, #fff0 0%, #fff0 12%, #ffffff40 29.25%, #fff0 50.5%, #fff0 75.25%, #ffffff40 91%, #fff0 100%), linear-gradient(90deg, #00000008 0%, #0000001a 12%, #0000 30%, #00000005 50%, #0003 73.5%, #00000080 75.25%, #00000026 85.25%, #0000 100%)";

/**
 * Screen-blended highlights either side of BIND's crease. Overlay leaves black
 * as black, so on a dark cover the binding needs a layer that can only lighten;
 * on a light one screen adds next to nothing.
 */
const BIND_SHINE =
	"linear-gradient(90deg, #fff0 0%, #fff0 14%, #ffffff4d 29.25%, #fff0 46%, #fff0 80%, #ffffff4d 91%, #fff0 100%)";

/** Cloth wrapped round a rounded spine: dark at both folds, lit just off the left. */
const SPINE_SHADE =
	"linear-gradient(90deg, #0000001f 0%, #ffffff66 14%, #ffffff1a 34%, #0000 56%, #0000000d 82%, #00000024 100%)";

/**
 * Paper grain from an SVG noise filter, inlined so it costs no request. Gray
 * noise under hard-light nudges each pixel lighter or darker without shifting
 * its colour, which is what Geist's texture image does.
 */
const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>',
)}")`;

/**
 * Wood grain from the same noise, stretched: a tiny horizontal frequency
 * against a large vertical one draws the noise out into long streaks.
 */
const WOOD_GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" width="480" height="48"><filter id="w"><feTurbulence type="fractalNoise" baseFrequency="0.008 0.45" numOctaves="3" seed="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#w)"/></svg>',
)}")`;

/** Grey grain overlaid on the wood colour, so the tint needs no second layer. */
function Shelf() {
	const wood = {
		backgroundImage: WOOD_GRAIN,
		backgroundBlendMode: "overlay",
	} as const;

	return (
		<div
			aria-hidden
			className="relative z-10 self-stretch shadow-[0_6px_8px_-4px_#0000002e]"
		>
			<div
				style={{ ...wood, backgroundColor: "#dcc49c" }}
				className="h-1"
			/>
			<div
				style={{ ...wood, backgroundColor: "#c7a877" }}
				className="h-2.5 shadow-[inset_0_1px_0_#0000001a,inset_0_-1px_0_#0000001f]"
			/>
		</div>
	);
}

function Grain({ className }: { className?: string }) {
	return (
		<div
			style={{ backgroundImage: GRAIN }}
			className={cn(
				"pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-hard-light",
				className,
			)}
		/>
	);
}

const SPINE_TONE = "#e3e5e8";

const TURN_SPRING = { type: "spring", duration: 0.6, bounce: 0.25 } as const;

/** Opacity by distance from the book, nearest first. */
const SPINE_FADE = [1, 0.7, 0.4];
const FRONT_FADE = [0.55, 0.3, 0.12];

const COVER_RADIUS = "rounded-[3px_2px_2px_3px]";
const COVER_SHADOW =
	"shadow-[0_1px_1px_#00000005,0_4px_8px_-4px_#0000001a,0_16px_24px_-8px_#00000008]";

/** The printed front: artwork, grain and the bound left edge. */
function CoverFace({ book, width }: { book: Book; width: number }) {
	return (
		<>
			<Image
				src={book.cover}
				alt={book.coverAlt ?? book.title}
				fill
				sizes={`${width}px`}
				className="object-cover"
			/>
			<Grain className="opacity-15" />
			<div
				style={{ background: BIND }}
				className="absolute inset-y-0 left-0 w-[8.2%] mix-blend-overlay"
			/>
			<div
				style={{ background: BIND_SHINE }}
				className="absolute inset-y-0 left-0 w-[8.2%] mix-blend-screen"
			/>
		</>
	);
}

function Spine({
	bookWidth,
	bookHeight,
	opacity,
}: {
	bookWidth: number;
	bookHeight: number;
	opacity: number;
}) {
	return (
		<div
			style={{
				opacity,
				width: bookWidth * 0.17,
				height: bookHeight,
				backgroundColor: SPINE_TONE,
				backgroundImage: SPINE_SHADE,
			}}
			className="relative shrink-0 rounded-[2px] shadow-[0_1px_1px_#00000008,0_4px_8px_-4px_#0000001f] after:absolute after:inset-0 after:rounded-[inherit] after:border after:border-black/[0.07] after:shadow-[inset_0_1px_1px_#ffffff80]"
		>
			<Grain className="opacity-25" />
			<div className="absolute inset-x-0 top-[8%] h-px bg-black/10 shadow-[0_1px_0_#ffffff80]" />
			<div className="absolute inset-x-0 bottom-[8%] h-px bg-black/10 shadow-[0_1px_0_#ffffff80]" />
		</div>
	);
}

function Spines({
	side,
	bookWidth,
	bookHeight,
}: {
	side: "left" | "right";
	bookWidth: number;
	bookHeight: number;
}) {
	return (
		<div
			aria-hidden
			className={cn(
				"flex shrink-0 items-end gap-1",
				side === "left" ? "mr-2 flex-row-reverse" : "ml-2",
			)}
		>
			{SPINE_FADE.map((opacity, i) => (
				<Spine
					// biome-ignore lint/suspicious/noArrayIndexKey: a fixed, generated row
					key={i}
					bookWidth={bookWidth}
					bookHeight={bookHeight}
					opacity={opacity}
				/>
			))}
		</div>
	);
}

/** Other books face-out beside this one, greyed and fading so it stays the subject. */
function Fronts({
	side,
	books,
	bookWidth,
	bookHeight,
}: {
	side: "left" | "right";
	books: Book[];
	bookWidth: number;
	bookHeight: number;
}) {
	return (
		<div
			aria-hidden
			className={cn(
				"flex shrink-0 items-end gap-3",
				side === "left" ? "mr-4 flex-row-reverse" : "ml-4",
			)}
		>
			{books.slice(0, FRONT_FADE.length).map((book, i) => (
				<div
					key={book.id}
					style={{ width: bookWidth, height: bookHeight, opacity: FRONT_FADE[i] }}
					className={cn(
						"relative shrink-0 overflow-hidden bg-white grayscale",
						COVER_RADIUS,
						COVER_SHADOW,
					)}
				>
					<CoverFace book={book} width={bookWidth} />
				</div>
			))}
		</div>
	);
}

/**
 * A hardback standing face-on, after Geist's Book, on a shelf between three
 * spines a side — or between other books' fronts when `neighbours` is given.
 * It turns to show its pages while `turned` (the card's hover) or while hovered
 * itself, for a post page where there's no card to hover.
 */
export function BookCover({
	book,
	width = 84,
	turned = false,
	neighbours,
}: {
	book: Book;
	width?: number;
	turned?: boolean;
	/** Split between the two sides, nearest first. */
	neighbours?: Book[];
}) {
	const [hovered, setHovered] = useState(false);
	const height = (width * BOOK_HEIGHT) / BOOK_WIDTH;
	const depth = width * 0.29;
	const half = neighbours ? Math.ceil(neighbours.length / 2) : 0;
	const side = (which: "left" | "right") =>
		neighbours ? (
			<Fronts
				side={which}
				books={
					which === "left" ? neighbours.slice(0, half) : neighbours.slice(half)
				}
				bookWidth={width}
				bookHeight={height}
			/>
		) : (
			<Spines side={which} bookWidth={width} bookHeight={height} />
		);

	return (
		<m.div
			onHoverStart={() => setHovered(true)}
			onHoverEnd={() => setHovered(false)}
			className="flex size-full flex-col items-center justify-center perspective-[900px]"
		>
			<div className="flex items-end transform-3d">
				{side("left")}
				<m.div
					style={{ width, height }}
					initial={false}
					// Half Geist's nudge and none of its scale: just enough to pull the page
					// block back over the cover's footprint, so spines can stand beside it.
					// The lift reads as the book being picked off the shelf, which is what
					// lets it turn at all.
					animate={
						turned || hovered
							? { rotateY: -20, x: -4, y: -4 }
							: { rotateY: 0, x: 0, y: 0 }
					}
					transition={TURN_SPRING}
					className="relative shrink-0 transform-3d"
				>
					<div
						style={{
							height: height - 6,
							width: depth - 2,
							transform: `translateX(${width - depth / 2 - 3}px) rotateY(90deg) translateX(${depth / 2}px)`,
							background:
								"linear-gradient(90deg, #eaeaea 0%, #0000 70%), linear-gradient(#fff, #fafafa)",
						}}
						className="absolute top-[3px] left-0"
					/>
					<div
						style={{
							transform: `translateZ(${-depth}px)`,
							backgroundColor: book.spineColor,
						}}
						className={cn("absolute inset-0", COVER_RADIUS)}
					/>
					<div
						className={cn(
							"relative size-full overflow-hidden bg-white translate-z-0 after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border after:border-black/8 after:shadow-[inset_0_1px_2px_#ffffff4d]",
							COVER_RADIUS,
							COVER_SHADOW,
						)}
					>
						<CoverFace book={book} width={width} />
					</div>
				</m.div>
				{side("right")}
			</div>
			<Shelf />
		</m.div>
	);
}
