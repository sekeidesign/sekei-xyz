import type { ReactNode } from "react";
import { cn } from "../cn";

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
