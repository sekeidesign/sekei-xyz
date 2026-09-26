"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import "slot-text/style.css";
import { SlotText } from "slot-text/react";
import { Book3D } from "./ui-kit/book-shelf/Book3D";
import { BOOK_OPEN_SHIFT } from "./ui-kit/book-shelf/constants";
import { BOOKS } from "./ui-kit/book-shelf/books";
import { useHoverGroup } from "./ui-kit/HoverContext";
import { StarRating } from "./ui-kit/StarRating";

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
