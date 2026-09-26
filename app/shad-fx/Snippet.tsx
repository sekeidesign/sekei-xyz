"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@ui-kit/cn";
import { CheckCircleIcon } from "@ui-kit/icons/CheckCircleIcon";
import { CopyIcon } from "@ui-kit/icons/CopyIcon";
import { SURFACE_INNER, SURFACE_OUTER } from "@ui-kit/post/surface";
import { ICON_SWAP, ICON_SWAP_IN, ICON_SWAP_OUT } from "@ui-kit/press";
import { Highlighted, type Lang } from "./highlight";

// The social bar's link blue, so a copied state matches the rest of the site.
const CHECK_COLOR = "oklch(74.6% 0.16 232.661)";

export function Snippet({
	code,
	lang = "bash",
	framed = true,
	footer,
	className,
}: {
	code: string;
	lang?: Lang;
	/**
	 * Wraps the block in the same nested bezel as the cards. Off when the
	 * caller already provides the outer frame, as the playground does.
	 */
	framed?: boolean;
	/** A white panel under the code, inside the same frame. Framed only. */
	footer?: ReactNode;
	className?: string;
}) {
	const [copied, setCopied] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(
		() => () => {
			if (timer.current) clearTimeout(timer.current);
		},
		[],
	);

	async function copy() {
		try {
			await navigator.clipboard.writeText(code);
		} catch {
			return;
		}
		setCopied(true);
		if (timer.current) clearTimeout(timer.current);
		timer.current = setTimeout(() => setCopied(false), 1600);
	}

	const block = (
		<div
			className={cn(
				"relative rounded-lg",
				SURFACE_INNER,
				"bg-gray-900",
				!framed && className,
			)}
		>
			<pre className="overflow-x-auto px-4 py-3 pr-12 font-mono text-[13px] leading-[1.6] text-gray-100">
				<code>
					<Highlighted code={code} lang={lang} />
				</code>
			</pre>
			<button
				type="button"
				onClick={copy}
				aria-label={copied ? "Copied" : "Copy code"}
				className="absolute top-2 right-2 flex size-7 cursor-pointer items-center justify-center rounded-md bg-white/10 text-gray-300 ring ring-white/10 transition-transform duration-150 ease-out hover:bg-white/20 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 active:scale-[0.97] active:duration-75"
			>
				<span className="relative flex size-4">
					<span
						style={{ color: CHECK_COLOR }}
						className={cn(
							ICON_SWAP,
							"absolute inset-0 flex items-center justify-center duration-150",
							copied ? ICON_SWAP_IN : ICON_SWAP_OUT,
						)}
					>
						<CheckCircleIcon />
					</span>
					<span
						className={cn(
							ICON_SWAP,
							"flex items-center justify-center duration-150",
							copied ? ICON_SWAP_OUT : ICON_SWAP_IN,
						)}
					>
						<CopyIcon />
					</span>
				</span>
				<span className="sr-only" aria-live="polite">
					{copied ? "Copied to clipboard" : ""}
				</span>
			</button>
		</div>
	);

	if (!framed) return block;

	return (
		<div className={cn("rounded-xl", SURFACE_OUTER, className)}>
			{block}
			{footer && (
				<div className={cn("mt-1 rounded-lg", SURFACE_INNER)}>{footer}</div>
			)}
		</div>
	);
}
