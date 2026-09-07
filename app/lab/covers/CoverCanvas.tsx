"use client";

import { type ReactNode, useState } from "react";
import { cn } from "@ui-kit/cn";
import { COLUMN_INNER, SURFACE_INNER, SURFACE_OUTER } from "@ui-kit/post/surface";
import { VARIANTS } from "./variants";

/** The boxes a cover actually ships in: a feed card's square, and a post page's column. */
const SIZES = [
	{ label: "Card", px: 179 },
	{ label: "Medium", px: 320 },
	{ label: "Page", px: COLUMN_INNER },
];

/** The shipped frame, so a cover is judged inside the chrome it renders in. */
function CoverFrame({ size, children }: { size: number; children: ReactNode }) {
	return (
		<div
			style={{ width: size, height: size }}
			className={cn("shrink-0 rounded-xl", SURFACE_OUTER)}
		>
			<div className={cn("relative size-full rounded-lg", SURFACE_INNER)}>
				{children}
			</div>
		</div>
	);
}

export function CoverCanvas() {
	const [size, setSize] = useState(SIZES[0].px);

	return (
		<div className="flex flex-col gap-6">
			<div className="flex w-fit items-center gap-px rounded-full bg-gray-500/5 p-px">
				{SIZES.map((option) => (
					<button
						key={option.label}
						type="button"
						onClick={() => setSize(option.px)}
						className={cn(
							"cursor-pointer rounded-full px-3 py-1 text-[13px] leading-[1.43] font-[500]",
							size === option.px
								? "bg-white ring-1 ring-gray-500/10 shadow-skew text-gray-900"
								: "text-gray-500 hover:text-gray-900",
						)}
					>
						{option.label} · {option.px}
					</button>
				))}
			</div>

			<div className="flex flex-wrap items-start gap-6">
				{VARIANTS.map((variant) => (
					<div key={variant.name} className="flex flex-col gap-2">
						<CoverFrame size={size}>{variant.render()}</CoverFrame>
						<span className="text-[13px] leading-[1.43] font-[500] text-gray-500">
							{variant.name}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
