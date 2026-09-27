import type { ComponentProps } from "react";
import { cn } from "./cn";
import { SURFACE_INNER, SURFACE_OUTER } from "./post/surface";

/**
 * The nested bezel: a gray-100 ringed frame holding a white ringed card.
 * `className` styles the frame; `inner` goes to the card, which is where a
 * figure hangs its ref, role and sizing.
 */
export function Surface({
	className,
	style,
	inner,
	children,
}: {
	className?: string;
	style?: React.CSSProperties;
	inner?: ComponentProps<"div">;
	children?: React.ReactNode;
}) {
	return (
		<div style={style} className={cn("rounded-xl", SURFACE_OUTER, className)}>
			<div {...inner} className={cn("rounded-lg", SURFACE_INNER, inner?.className)}>
				{children}
			</div>
		</div>
	);
}
