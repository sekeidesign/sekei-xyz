"use client";

import type { HighlightOptions, PaletteName } from "@highlighters/react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	ControlPanel,
	ControlRow,
	ControlSection,
} from "@ui-kit/controls/ControlPanel";
import { Select } from "@ui-kit/controls/Select";
import { Slider } from "@ui-kit/controls/Slider";
import { TextAreaField, TextField } from "@ui-kit/controls/TextField";
import { PEN_STILL } from "@ui-kit/quote-pen";
import {
	type CardFormat,
	copyImage,
	download,
	encode,
	renderCard,
} from "@ui-kit/quote-card/capture";
import {
	CARD_WIDTH,
	type CardSurface,
	QuoteCard,
} from "@ui-kit/quote-card/QuoteCard";
import { toggleMark } from "@ui-kit/quote-card/quote-marks";

export interface BookOption {
	slug: string;
	title: string;
	author?: string;
	rating?: number;
	cover?: string;
}

const ASPECTS = [
	{ value: "fit", label: "Fit to quote" },
	{ value: "1.7778", label: "16:9" },
	{ value: "1.5", label: "3:2" },
	{ value: "1.3333", label: "4:3" },
	{ value: "1", label: "1:1" },
	{ value: "0.8", label: "4:5" },
];

const SWATCHES = ["yellow", "green", "blue", "pink", "orange", "purple"];

const PALETTES: PaletteName[] = [
	"mild",
	"fluorescent",
	"vintage",
	"neutral",
	"calm",
];

const SAMPLE =
	'"Make it lickable," Jobs had told Jony Ive. And Ive had delivered — ==a screen you wanted to put your tongue on==.';

function fileSlug(title: string) {
	return (
		title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "") || "quote"
	);
}

export function QuoteStudio({ books }: { books: BookOption[] }) {
	const [book, setBook] = useState(books[0]?.slug ?? "");
	const [quote, setQuote] = useState(SAMPLE);
	const [title, setTitle] = useState(books[0]?.title ?? "");
	const [author, setAuthor] = useState(books[0]?.author ?? "");
	const [rating, setRating] = useState(books[0]?.rating ?? 0);
	const [cover, setCover] = useState(books[0]?.cover ?? "");

	const [quoteSize, setQuoteSize] = useState(26);
	const [palette, setPalette] = useState<PaletteName>("mild");
	const [swatch, setSwatch] = useState("green");
	const [opacity, setOpacity] = useState(0.8);
	const [surface, setSurface] = useState<CardSurface>("paper");
	const [aspect, setAspect] = useState("fit");

	const [scale, setScale] = useState(2);
	const [format, setFormat] = useState<CardFormat>("webp");
	const [status, setStatus] = useState("");
	const [busy, setBusy] = useState(false);

	const quoteRef = useRef<HTMLTextAreaElement>(null);
	const [node, setNode] = useState<HTMLDivElement | null>(null);
	const [cardHeight, setCardHeight] = useState(0);

	useEffect(() => {
		if (!node) return;
		const observer = new ResizeObserver(() =>
			setCardHeight(node.offsetHeight),
		);
		observer.observe(node);
		return () => observer.disconnect();
	}, [node]);

	const pen = useMemo<HighlightOptions>(
		() => ({
			...PEN_STILL,
			color: { palette, swatch },
			opacity,
			// The exporter serialises the DOM, so the marks have to be real SVG
			// rather than the CSS or Highlight API tiers the pen would otherwise pick.
			renderer: "svg",
		}),
		[palette, swatch, opacity],
	);

	const height = aspect === "fit" ? undefined : Math.round(CARD_WIDTH / Number(aspect));

	const selectBook = (slug: string) => {
		setBook(slug);
		const picked = books.find((entry) => entry.slug === slug);
		if (!picked) return;
		setTitle(picked.title);
		setAuthor(picked.author ?? "");
		setRating(picked.rating ?? 0);
		setCover(picked.cover ?? "");
	};

	const markSelection = () => {
		const field = quoteRef.current;
		if (!field) return;
		const edit = toggleMark(quote, field.selectionStart, field.selectionEnd);
		if (!edit) {
			setStatus("Select some words in the quote first.");
			return;
		}
		setQuote(edit.source);
		requestAnimationFrame(() => {
			field.focus();
			field.setSelectionRange(edit.start, edit.end);
		});
	};

	const run = async (action: "save" | "copy") => {
		if (!node) return;
		setBusy(true);
		setStatus("");
		try {
			const canvas = await renderCard(node, scale);
			if (action === "copy") {
				const copied = await copyImage(canvas, format);
				setStatus(
					copied === format
						? `${copied.toUpperCase()} copied — paste it into a tweet.`
						: "Clipboard only takes PNG, so a PNG went across instead.",
				);
			} else {
				const blob = await encode(canvas, format);
				download(blob, `${fileSlug(title)}-quote.${format}`);
				setStatus(`Saved ${Math.round(blob.size / 1024)} KB.`);
			}
		} catch (error) {
			setStatus(error instanceof Error ? error.message : String(error));
		} finally {
			setBusy(false);
		}
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="overflow-x-auto rounded-xl bg-gray-500/5 p-4 ring ring-gray-500/10">
				<div ref={setNode} className="w-fit mx-auto shadow-skew">
					<QuoteCard
						quote={quote}
						title={title}
						author={author}
						rating={rating}
						cover={cover || undefined}
						pen={pen}
						quoteSize={quoteSize}
						height={height}
						surface={surface}
					/>
				</div>
			</div>

			<ControlPanel title="Quote card">
				<ControlSection label="Content" />
				<Select
					label="Book"
					value={book}
					options={books.map((entry) => ({
						value: entry.slug,
						label: entry.title,
					}))}
					onChange={selectBook}
				/>
				<TextAreaField
					label="Quote"
					value={quote}
					rows={5}
					placeholder="Paste the passage. Wrap a phrase in == to run the pen over it."
					onChange={setQuote}
					ref={quoteRef}
				/>
				<ControlRow label="Pen">
					<button
						type="button"
						onClick={markSelection}
						className="rounded-md bg-white px-2.5 py-1 text-[13px] leading-[1.43] font-[450] text-gray-900 ring ring-gray-500/15 shadow-skew cursor-pointer hover:bg-gray-50"
					>
						Highlight selection
					</button>
				</ControlRow>
				<TextField label="Title" value={title} onChange={setTitle} />
				<TextField label="Author" value={author} onChange={setAuthor} />
				<Slider
					label="Rating"
					value={rating}
					min={0}
					max={5}
					step={1}
					onChange={setRating}
				/>
				<TextField
					label="Cover"
					value={cover}
					placeholder="/covers/x.png or an absolute URL"
					onChange={setCover}
				/>

				<ControlSection label="Look" />
				<Slider
					label="Quote size"
					value={quoteSize}
					min={14}
					max={44}
					step={1}
					unit="px"
					onChange={setQuoteSize}
				/>
				<Select
					label="Palette"
					value={palette}
					options={PALETTES.map((name) => ({ value: name, label: name }))}
					onChange={(value) => setPalette(value as PaletteName)}
				/>
				<Select
					label="Ink"
					value={swatch}
					options={SWATCHES.map((name) => ({ value: name, label: name }))}
					onChange={setSwatch}
				/>
				<Slider
					label="Opacity"
					value={opacity}
					min={0.2}
					max={1}
					step={0.05}
					onChange={setOpacity}
				/>
				<Select
					label="Surface"
					value={surface}
					options={[
						{ value: "paper", label: "Paper" },
						{ value: "white", label: "White" },
					]}
					onChange={(value) => setSurface(value as CardSurface)}
				/>
				<Select
					label="Shape"
					value={aspect}
					options={ASPECTS}
					onChange={setAspect}
				/>

				<ControlSection label="Export" />
				<Select
					label="Scale"
					value={String(scale)}
					options={[1, 2, 3].map((value) => ({
						value: String(value),
						label: `${value}× — ${CARD_WIDTH * value} × ${cardHeight * value}`,
					}))}
					onChange={(value) => setScale(Number(value))}
				/>
				<Select
					label="Format"
					value={format}
					options={[
						{ value: "webp", label: "WebP" },
						{ value: "png", label: "PNG" },
					]}
					onChange={(value) => setFormat(value as CardFormat)}
				/>
				<ControlRow label="Save" value={status ? "" : undefined}>
					<div className="flex items-center gap-2">
						<button
							type="button"
							disabled={busy}
							onClick={() => void run("save")}
							className="rounded-md bg-gray-900 px-3 py-1 text-[13px] leading-[1.43] font-[450] text-white shadow-skew cursor-pointer hover:bg-gray-800 disabled:opacity-50"
						>
							{busy ? "Rendering…" : `Save ${format.toUpperCase()}`}
						</button>
						<button
							type="button"
							disabled={busy}
							onClick={() => void run("copy")}
							className="rounded-md bg-white px-3 py-1 text-[13px] leading-[1.43] font-[450] text-gray-900 ring ring-gray-500/15 shadow-skew cursor-pointer hover:bg-gray-50 disabled:opacity-50"
						>
							Copy
						</button>
						{status && (
							<span className="text-[12px] leading-[1.33] font-[420] text-gray-500">
								{status}
							</span>
						)}
					</div>
				</ControlRow>
			</ControlPanel>
		</div>
	);
}
