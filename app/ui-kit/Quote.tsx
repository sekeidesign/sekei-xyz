import type { ReactNode } from "react";
import { cn } from "./cn";

interface QuoteProps {
	children: ReactNode;
	/** Attribution under the quote, e.g. "Steve Jobs, July 1997". */
	cite?: ReactNode;
}

export function Quote({ children, cite }: QuoteProps) {
	return (
		// data-highlight-exclude keeps QuotedProse's body-wide pen off the block,
		// which would otherwise mark the quotation marks inside it.
		<figure
			data-highlight-exclude
			
		>
			<div className={cn("border-l-2 border-gray-200 pl-4 my-6 md:my-7 pb-1")}>
				<blockquote
					className={cn(
						"font-pixel text-xl md:text-3xl text-gray-700 leading-snug",
						"[&_p]:text-xl md:[&_p]:text-3xl [&_p]:text-gray-800 [&_p]:leading-snug",
						"[&_p]:mb-4 [&_p:last-child]:mb-0",
					)}
				>
					{children}
				</blockquote>
				{cite && (
					<figcaption className="mt-4 text-xs font-[450] text-gray-500">
						{cite}
					</figcaption>
				)}
			</div>
		</figure>
	);
}
