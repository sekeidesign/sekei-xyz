"use client";

import { useState } from "react";
import { cn } from "@ui-kit/cn";
import { FOCUS_RING } from "@ui-kit/focus";
import type { Surface } from "./registry";

const SURFACES: { value: Surface; label: string }[] = [
	{ value: "white", label: "White" },
	{ value: "panel", label: "Panel" },
	{ value: "stripes", label: "Stripes" },
	{ value: "dots", label: "Dots" },
];

const SURFACE_CLASS: Record<Surface, string> = {
	white: "bg-white",
	panel: "bg-gray-100",
	stripes: "stripes",
	dots: "dot-matrix bg-gray-50 [--dot-color:var(--color-gray-200)] [--dot-gap:14px] [--dot-size:0.75px]",
};

export function Canvas({
	name,
	surface: initial = "dots",
	bleed = false,
	children,
}: {
	name: string;
	surface?: Surface;
	bleed?: boolean;
	children: React.ReactNode;
}) {
	const [surface, setSurface] = useState(initial);

	return (
		<section className="flex flex-col gap-2">
			<div className="flex items-center justify-between gap-3 px-1">
				<h3 className="text-[14px] font-[500] text-gray-900">{name}</h3>
				{!bleed && (
					<div
						role="radiogroup"
						aria-label={`${name} background`}
						className="flex items-center gap-1"
					>
						{SURFACES.map((option) => (
							<button
								key={option.value}
								type="button"
								role="radio"
								aria-checked={surface === option.value}
								aria-label={option.label}
								title={option.label}
								onClick={() => setSurface(option.value)}
								className={cn(
									"size-4 cursor-pointer rounded-full ring ring-gray-500/20",
									FOCUS_RING,
									SURFACE_CLASS[option.value],
									surface === option.value &&
										"outline-2 outline-offset-1 outline-gray-700",
								)}
							/>
						))}
					</div>
				)}
			</div>
			<div className="rounded-xl bg-gray-100 p-1 ring ring-gray-500/10 shadow-skew">
				<div
					className={cn(
						"relative overflow-hidden rounded-lg ring ring-gray-500/10",
						bleed
							? "bg-white"
							: cn(
									"flex min-h-52 items-center justify-center p-8 md:p-12",
									SURFACE_CLASS[surface],
								),
					)}
				>
					{children}
				</div>
			</div>
		</section>
	);
}
