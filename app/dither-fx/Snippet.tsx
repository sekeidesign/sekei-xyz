"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@ui-kit/cn";

export function Snippet({
	code,
	className,
}: {
	code: string;
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

	return (
		<div
			className={cn(
				"group relative rounded-lg bg-gray-900 ring ring-gray-500/10",
				className,
			)}
		>
			<pre className="overflow-x-auto px-4 py-3 pr-20 font-mono text-[13px] leading-[1.6] text-gray-100">
				<code>{code}</code>
			</pre>
			<button
				type="button"
				onClick={copy}
				className="absolute top-2.5 right-2.5 cursor-pointer rounded-md bg-white/10 px-2 py-1 font-mono text-[11px] font-[450] text-gray-300 ring ring-white/10 hover:bg-white/20 hover:text-white focus:outline-none focus-visible:ring-white/40"
			>
				{copied ? "copied" : "copy"}
			</button>
		</div>
	);
}
