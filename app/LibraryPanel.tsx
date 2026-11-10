"use client";

import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useState } from "react";
import "slot-text/style.css";
import { SlotText } from "slot-text/react";
import { Book3D } from "./ui-kit/book-shelf/Book3D";
import { BOOK_OPEN_SHIFT } from "./ui-kit/book-shelf/constants";
import type { Book } from "./ui-kit/book-shelf/types";
import { Button } from "./ui-kit/Button";
import { StarRating } from "./ui-kit/StarRating";

export function LibraryPanel({
	books,
	title,
}: {
	books: Book[];
	title?: string;
}) {
	const [activeIndex, setActiveIndex] = useState(0);
	const active = books[activeIndex];

	const goPrev = () =>
		setActiveIndex((i) => (i - 1 + books.length) % books.length);
	const goNext = () => setActiveIndex((i) => (i + 1) % books.length);

	return (
		<section className="flex flex-col gap-6 overflow-hidden">
			{title && (
				<h2 className="text-xs tracking-tight text-gray-500 tabular-nums">
					{title}
				</h2>
			)}
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
					{active.href && (
						<Button render={<Link href={active.href} />} className="mt-2">
							Read review
							<ArrowRightIcon className="size-4" />
						</Button>
					)}
				</div>
				{books.length > 1 && (
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
				)}
			</div>
			<div className="flex items-end gap-1.5 flex-1 pb-4 ml-7 -mb-11">
				{books.map((book, index) => (
					<Book3D
						key={book.id}
						book={book}
						open={index === activeIndex}
						onClick={() => setActiveIndex(index)}
						shiftX={index > activeIndex ? BOOK_OPEN_SHIFT : 0}
					/>
				))}
			</div>
		</section>
	);
}
