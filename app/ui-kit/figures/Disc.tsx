import type { ReactNode } from "react";
import { cn } from "../cn";

/**
 * Swapping what a disc holds: the ring stays put, the wash crossfades under it
 * and the glyph passes through left to right.
 */
export const WASH = "transition-opacity duration-300 ease-out";
export const GLYPH = "transition-[translate,filter,opacity] duration-300 ease-out";
export const GLYPH_HERE = "translate-x-0 opacity-100 blur-none";
export const GLYPH_LEAVING = "translate-x-2 opacity-0 blur-xs";
export const GLYPH_WAITING = "-translate-x-2 opacity-0 blur-xs";

export function Disc({
	wash,
	className,
	children,
}: {
	wash: string;
	className?: string;
	children: ReactNode;
}) {
	return (
		<span className="flex shrink-0 rounded-full bg-white p-1 ring-1 ring-gray-500/10 shadow-sm">
			<span
				className={cn(
					"flex size-10 items-center justify-center rounded-full bg-linear-to-b from-white to-transparent ring-1 ring-gray-500/10 shadow-sm",
					wash,
					className,
				)}
			>
				{children}
			</span>
		</span>
	);
}
