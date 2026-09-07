import { notFound } from "next/navigation";
import { PanelRow } from "@ui-kit/PanelRow";
import { getTimeline } from "@/lib/timeline";
import { type BookOption, QuoteStudio } from "./QuoteStudio";

export const metadata = {
	title: "Quote card studio",
	robots: { index: false, follow: false },
};

export default function QuoteLabPage() {
	// Never on the live site; available locally and on preview deploys.
	if (process.env.VERCEL_ENV === "production") notFound();

	const books: BookOption[] = getTimeline()
		.filter((entry) => entry.kind === "book")
		.map(({ slug, title, author, rating, cover }) => ({
			slug,
			title,
			author,
			rating,
			cover,
		}));

	return (
		<PanelRow className="flex flex-col gap-8 md:p-8 p-4">
			<div>
				<h1 className="text-[20px] leading-[1.375] font-[550] text-gray-900">
					Quote card studio
				</h1>
				<p className="text-[15px] leading-[1.625] font-[420] text-gray-500">
					A passage in the book pen, sized for a tweet. Wrap words in{" "}
					<code className="rounded bg-gray-200/60 px-1 font-mono text-[13px]">
						==
					</code>{" "}
					to run the highlighter over them.
				</p>
			</div>
			<QuoteStudio books={books} />
		</PanelRow>
	);
}
