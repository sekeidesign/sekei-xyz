"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@ui-kit/Button";
import { cn } from "@ui-kit/cn";
import { CheckCircleIcon } from "@ui-kit/icons/CheckCircleIcon";
import { CopyIcon } from "@ui-kit/icons/CopyIcon";
import { ICON_SWAP, ICON_SWAP_IN, ICON_SWAP_OUT } from "@ui-kit/press";

const CHECK_COLOR = "oklch(74.6% 0.16 232.661)";

export function CopyAgentPrompt({ prompt }: { prompt: string }) {
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
			await navigator.clipboard.writeText(prompt);
		} catch {
			return;
		}
		setCopied(true);
		if (timer.current) clearTimeout(timer.current);
		timer.current = setTimeout(() => setCopied(false), 1600);
	}

	return (
		<Button onClick={copy} title={prompt}>
			<span className="relative flex size-3.5">
				<span
					style={{ color: CHECK_COLOR }}
					className={cn(
						ICON_SWAP,
						"absolute inset-0 flex items-center justify-center duration-150",
						copied ? ICON_SWAP_IN : ICON_SWAP_OUT,
					)}
				>
					<CheckCircleIcon size={14} />
				</span>
				<span
					className={cn(
						ICON_SWAP,
						"flex items-center justify-center duration-150",
						copied ? ICON_SWAP_OUT : ICON_SWAP_IN,
					)}
				>
					<CopyIcon size={14} />
				</span>
			</span>
			agents.md
			<span className="sr-only" aria-live="polite">
				{copied ? "Prompt copied to clipboard" : ""}
			</span>
		</Button>
	);
}
