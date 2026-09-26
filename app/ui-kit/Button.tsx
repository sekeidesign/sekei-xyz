"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "./cn";
import { FOCUS_RING } from "./focus";

const BASE =
	"inline-flex h-6.5 w-fit shrink-0 cursor-pointer items-center gap-1 rounded-full bg-white text-[14px] font-[500] text-gray-500 shadow-skew ring-1 ring-gray-500/10 hover:bg-gray-50";

export function Button({
	render,
	iconOnly = false,
	className,
	...props
}: useRender.ComponentProps<"button"> & { iconOnly?: boolean }) {
	return useRender({
		defaultTagName: "button",
		render,
		props: mergeProps<"button">(
			{
				type: render ? undefined : "button",
				className: cn(
					BASE,
					FOCUS_RING,
					iconOnly ? "w-6.5 justify-center" : "pr-2 pl-1.5",
					className,
				),
			},
			props,
		),
	});
}
