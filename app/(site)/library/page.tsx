import type { Metadata } from "next";
import { BackLink } from "@ui-kit/BackLink";
import type { Book } from "@ui-kit/book-shelf/types";
import { PanelRow } from "@ui-kit/PanelRow";
import { getLibrary, type TimelineEntry } from "@/lib/timeline";
import { LibraryPanel } from "../../LibraryPanel";

export const metadata: Metadata = {
	title: "Library",
	description: "Every book PG Gonni has read, with ratings and reviews.",
	alternates: { canonical: "/library" },
	openGraph: {
		title: "Library | PG Gonni",
		description: "Every book PG Gonni has read, with ratings and reviews.",
		images: "/og-image.jpg",
	},
};

function toBook(entry: TimelineEntry): Book {
	return {
		id: entry.slug,
		title: entry.title,
		author: entry.author ?? "",
		cover: entry.cover ?? "",
		spineColor: entry.spineColor ?? "#3a3f47",
		rating: entry.rating ?? 0,
		href: entry.hasPage && !entry.draft ? `/p/${entry.slug}` : undefined,
	};
}

export default function LibraryPage() {
	const library = getLibrary();
	const reading = library.filter((entry) => entry.reading).map(toBook);
	const entries = library.filter((entry) => !entry.reading);

	const years = new Map<string, Book[]>();
	for (const entry of entries) {
		const year = entry.date.slice(0, 4);
		years.set(year, [...(years.get(year) ?? []), toBook(entry)]);
	}

	return (
		<>
			<PanelRow className="md:px-8 px-3 py-3">
				<BackLink label="Home" />
			</PanelRow>
			<PanelRow className="flex flex-col gap-1 md:px-8 px-4 py-6">
				<h1 className="text-sm font-[550] tracking-tight text-gray-800">
					Library
				</h1>
				<p className="text-xs tracking-tight text-gray-500 tabular-nums">
					{entries.length} books read
				</p>
			</PanelRow>
			{reading.length > 0 && (
				<PanelRow className="md:px-8 px-4 pt-6 pb-4">
					<LibraryPanel title="Currently reading" books={reading} />
				</PanelRow>
			)}
			{[...years].map(([year, books]) => (
				<PanelRow key={year} className="md:px-8 px-4 pt-6 pb-4">
					<LibraryPanel
						title={`${year} · ${books.length} ${books.length === 1 ? "book" : "books"}`}
						books={books}
					/>
				</PanelRow>
			))}
		</>
	);
}
