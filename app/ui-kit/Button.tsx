"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "./cn";
import { FOCUS_RING } from "./focus";

const BASE =
	"inline-flex h-6.5 w-fit shrink-0 cursor-pointer items-center gap-1 rounded-full text-[14px]";

const VARIANTS = {
	default:
		"bg-white font-[500] text-gray-500 shadow-skew ring-1 ring-gray-500/10 hover:bg-gray-50",
	primary:
		"bg-gray-900 bg-linear-to-b from-gray-800 font-[550] text-white shadow-md ring ring-gray-950 inset-shadow-xs inset-shadow-gray-100/20 transition-shadow duration-100 hover:from-gray-950 hover:shadow-sm hover:inset-shadow-none",
};

export type ButtonVariant = keyof typeof VARIANTS;

export function Button({
	render,
	variant = "default",
	iconOnly = false,
	className,
	...props
}: useRender.ComponentProps<"button"> & {
	variant?: ButtonVariant;
	iconOnly?: boolean;
}) {
	return useRender({
		defaultTagName: "button",
		render,
		props: mergeProps<"button">(
			{
				type: render ? undefined : "button",
				className: cn(
					BASE,
					VARIANTS[variant],
					FOCUS_RING,
					iconOnly ? "w-6.5 justify-center" : "pr-2 pl-1.5",
					className,
				),
			},
			props,
		),
	});
}
