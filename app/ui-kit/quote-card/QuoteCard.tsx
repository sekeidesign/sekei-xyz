"use client";

import type { HighlightOptions } from "@highlighters/react";
import { Highlight } from "@highlighters/react";
import { useState } from "react";
import { SparkleDivider } from "../SparkleDivider";
import { StarRating } from "../StarRating";
import { parseQuote } from "./quote-marks";
import { useEmbeddedImage } from "./use-embedded-image";

export const CARD_WIDTH = 640;

const PAD = 36;
const COVER_WIDTH = 100;
/** Sits the plate a touch above the title's cap line rather than level with it. */
const COVER_RISE = 6;
const COPY_PAD = 10;
const FADE_HEIGHT = 80;
const MIN_HEIGHT = 300;

export type CardSurface = "paper" | "white";

const SURFACE: Record<CardSurface, { color: string; rgb: string }> = {
	paper: { color: "#f3f4f6", rgb: "243, 244, 246" },
	white: { color: "#ffffff", rgb: "255, 255, 255" },
};

export interface QuoteCardProps {
	quote: string;
	title: string;
	author?: string;
	rating?: number;
	cover?: string;
	pen: HighlightOptions;
	quoteSize: number;
	/** Fixed card height in px. Left off, the card hugs the quote. */
	height?: number;
	surface?: CardSurface;
}

export function QuoteCard({
	quote,
	title,
	author,
	rating = 0,
	cover,
	pen,
	quoteSize,
	height,
	surface = "paper",
}: QuoteCardProps) {
	// The pen draws into a layer it appends to its host, so the host has to be
	// the card itself — left to default it lands on document.body, outside
	// anything the exporter serialises.
	const [host, setHost] = useState<HTMLDivElement | null>(null);
	const coverSrc = useEmbeddedImage(cover);
	const lines = parseQuote(quote);
	const { color, rgb } = SURFACE[surface];

	return (
		<div
			ref={setHost}
			style={{
				width: CARD_WIDTH,
				height,
				minHeight: height ? undefined : MIN_HEIGHT,
				padding: PAD,
				backgroundColor: color,
			}}
			className="relative flex flex-col justify-between gap-8 overflow-hidden"
		>
			<blockquote
				style={{ fontSize: quoteSize, lineHeight: 1.35 }}
				className="relative z-10 border-l-2 border-gray-300 pl-6 font-pixel text-gray-800"
			>
				{lines.map((line) => (
					<p key={line.id} className="mb-5 last:mb-0">
						{line.segments.map((segment) =>
							segment.marked ? (
								<Highlight key={segment.id} options={pen} host={host}>
									{segment.text}
								</Highlight>
							) : (
								<span key={segment.id}>{segment.text}</span>
							),
						)}
					</p>
				))}
			</blockquote>

			<div className="flex flex-col gap-6">
				<SparkleDivider className="relative z-10" />
				<div className="relative">
					<div
						style={{ paddingBlock: COPY_PAD }}
						className="relative z-10"
					>
						<p className="text-[17px] leading-snug font-[550] text-gray-900">
							{title}
						</p>
						{author && (
							<p className="text-[14px] leading-snug font-[420] text-gray-500">
								{author}
							</p>
						)}
						{rating > 0 && (
							<StarRating rating={rating} size={14} className="mt-3" />
						)}
					</div>
					{coverSrc && (
						<div
							style={{
								top: COPY_PAD - COVER_RISE,
								width: COVER_WIDTH,
								height: Math.round(COVER_WIDTH * 1.5),
							}}
							className="absolute right-0 overflow-hidden rounded-[3px] bg-gray-200 ring ring-gray-500/15 shadow-[0_12px_20px_rgba(15,23,42,0.16),0_4px_8px_rgba(15,23,42,0.12)]"
						>
							{/* react-doctor-disable-next-line nextjs-no-img-element -- the cover is a data URL so the exporter can read the canvas back */}
							{/* biome-ignore lint/performance/noImgElement: the cover is a data URL so the exporter can read the canvas back */}
							{/* eslint-disable-next-line @next/next/no-img-element -- the cover is a data URL so the exporter can read the canvas back */}
							<img src={coverSrc} alt="" className="size-full object-cover" />
						</div>
					)}
				</div>
			</div>

			{/* Last child so it lies over the plate, which runs off the bottom edge.
			    Alpha-zero surface rather than `transparent`, which would interpolate
			    through black. */}
			{coverSrc && (
				<div
					style={{
						height: FADE_HEIGHT,
						backgroundImage: `linear-gradient(to bottom, rgba(${rgb}, 0) 0%, rgba(${rgb}, 0.72) 46%, ${color} 100%)`,
					}}
					className="pointer-events-none absolute inset-x-0 bottom-0"
				/>
			)}
		</div>
	);
}
