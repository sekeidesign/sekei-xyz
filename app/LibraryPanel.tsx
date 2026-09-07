"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import "slot-text/style.css";
import { SlotText } from "slot-text/react";
import { Book3D } from "./ui-kit/book-shelf/Book3D";
import { BOOK_OPEN_SHIFT } from "./ui-kit/book-shelf/constants";
import type { Book } from "./ui-kit/book-shelf/types";
import { useHoverGroup } from "./ui-kit/HoverContext";
import { StarRating } from "./ui-kit/StarRating";

// Spine colors are picked per book, not taken from real covers. Ratings are placeholders.
const BOOKS: Book[] = [
	{
		id: "competing-against-luck",
		title: "Competing Against Luck",
		author: "Christensen et al.",
		cover: "https://covers.openlibrary.org/b/id/8138391-L.jpg",
		spineColor: "#4a5568",
		depth: 20,
		rating: 0,
	},
	{
		id: "apple-in-china",
		title: "Apple in China",
		author: "Patrick McGee",
		cover: "https://covers.openlibrary.org/b/id/15151586-L.jpg",
		spineColor: "#1f2430",
		depth: 26,
		rating: 5,
	},
	{
		id: "shoe-dog",
		title: "L'arte della vittoria",
		author: "Phil Knight",
		cover: "https://covers.openlibrary.org/b/id/8858487-L.jpg",
		spineColor: "#7c4430",
		depth: 30,
		rating: 3,
	},
	{
		id: "that-will-never-work",
		title: "That Will Never Work",
		author: "Marc Randolph",
		cover: "https://covers.openlibrary.org/b/id/10663066-L.jpg",
		spineColor: "#8a4a3a",
		depth: 22,
		rating: 5,
	},
	{
		id: "working-backwards",
		title: "Working Backwards",
		author: "Bryar & Carr",
		cover: "https://covers.openlibrary.org/b/id/10297403-L.jpg",
		spineColor: "#22344a",
		depth: 32,
		rating: 3,
	},
	{
		id: "street-fight",
		title: "Street Fight",
		author: "Sadik-Khan",
		cover: "https://covers.openlibrary.org/b/id/13079426-L.jpg",
		spineColor: "#3a3f47",
		depth: 24,
		rating: 5,
	},
	{
		id: "articulating-design-decisions",
		title: "Articulating Design Decisions",
		author: "Tom Greever",
		cover: "https://covers.openlibrary.org/b/id/8253809-L.jpg",
		spineColor: "#3f5a52",
		depth: 18,
		rating: 4,
	},
	{
		id: "the-mom-test",
		title: "The Mom Test",
		author: "Rob Fitzpatrick",
		cover: "https://covers.openlibrary.org/b/id/10660557-L.jpg",
		spineColor: "#E22973",
		depth: 16,
		rating: 5,
	},
	{
		id: "curbing-traffic",
		title: "Curbing Traffic",
		author: "Bruntlett & Bruntlett",
		cover: "https://covers.openlibrary.org/b/id/11606339-L.jpg",
		spineColor: "#7281B0",
		depth: 22,
		rating: 5,
	},
	{
		id: "well-designed",
		title: "Well-Designed",
		author: "Jon Kolko",
		cover: "https://covers.openlibrary.org/b/id/14385148-L.jpg",
		spineColor: "#6e4a52",
		depth: 20,
		rating: 4,
	},
	{
		id: "user-friendly",
		title: "User Friendly",
		author: "Kuang & Fabricant",
		cover: "https://covers.openlibrary.org/b/id/10174106-L.jpg",
		spineColor: "#453a5c",
		depth: 26,
		rating: 1,
	},
	{
		id: "atomic-habits",
		title: "Atomic Habits",
		author: "James Clear",
		cover: "https://covers.openlibrary.org/b/id/12539702-L.jpg",
		spineColor: "#B67A5A",
		depth: 24,
		rating: 5,
	},
];

export function LibraryPanel() {
	const reading = useHoverGroup("reading");
	// Only one book is open at a time; this one by default.
	const [activeIndex, setActiveIndex] = useState(0);
	const active = BOOKS[activeIndex];

	const goPrev = () =>
		setActiveIndex((i) => (i - 1 + BOOKS.length) % BOOKS.length);
	const goNext = () => setActiveIndex((i) => (i + 1) % BOOKS.length);

	return (
		<div
			className="flex-1 panel p-4 md:p-6 flex flex-col gap-6 overflow-hidden"
			onMouseEnter={reading.onMouseEnter}
			onMouseLeave={reading.onMouseLeave}
		>
			<div className="flex items-start justify-between gap-2">
				<div className="space-y-1 flex flex-col">
					<SlotText
						text={active.title}
						options={{
							direction: "down",
							bounce: 0.1,
							duration: 400,
							stagger: 20,
							skipUnchanged: false,
						}}
						className="text-sm font-[550] tracking-tight text-gray-800"
					/>
					<SlotText
						text={active.author}
						options={{
							direction: "down",
							bounce: 0.1,
							duration: 200,
							stagger: 10,
							skipUnchanged: false,
						}}
						className="text-xs tracking-tight text-gray-500"
					/>
					<StarRating rating={active.rating} />
				</div>
				<div className="flex gap-1 shrink-0">
					<button
						type="button"
						aria-label="Previous book"
						onClick={goPrev}
						className="p-1 rounded-sm text-gray-400 hover:text-gray-800 hover:bg-gray-200"
					>
						<ChevronLeftIcon className="size-4" />
					</button>
					<button
						type="button"
						aria-label="Next book"
						onClick={goNext}
						className="p-1 rounded-sm text-gray-400 hover:text-gray-800 hover:bg-gray-200"
					>
						<ChevronRightIcon className="size-4" />
					</button>
				</div>
			</div>
			<div className="flex items-end gap-1.5 flex-1 pb-4 ml-7 -mb-11">
				{BOOKS.map((book, index) => (
					<Book3D
						key={book.id}
						book={book}
						open={index === activeIndex}
						onClick={() => setActiveIndex(index)}
						shiftX={index > activeIndex ? BOOK_OPEN_SHIFT : 0}
					/>
				))}
			</div>
		</div>
	);
}
