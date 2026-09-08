import type { CSSProperties, ReactNode } from "react";

/**
 * A full-bleed frame for a coded mock. It keeps a ratio rather than a height,
 * so it shrinks with the column instead of leaving a phone with a tall, mostly
 * empty box; what it holds is drawn at the page's own scale and zoomed to fit,
 * which is the multiplier to tune rather than the mock itself.
 */
export function FigureFrame({
	ratio,
	scale,
	children,
	footer,
}: {
	ratio: string;
	scale?: number;
	children: ReactNode;
	footer?: ReactNode;
}) {
	return (
		<div className="my-6 -mx-6 cursor-default border-y border-gray-200 bg-white md:-mx-13">
			<div className="overflow-hidden" style={{ aspectRatio: ratio }}>
				<div
					className="figure-scale h-full"
					style={
						scale === undefined
							? undefined
							: ({ "--figure-scale": scale } as CSSProperties)
					}
				>
					{children}
				</div>
			</div>
			{footer}
		</div>
	);
}
