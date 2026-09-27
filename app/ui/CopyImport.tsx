"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@ui-kit/Button";
import { cn } from "@ui-kit/cn";
import { CheckCircleIcon } from "@ui-kit/icons/CheckCircleIcon";
import { CopyIcon } from "@ui-kit/icons/CopyIcon";
import {
	ICON_PRESS,
	ICON_SWAP,
	ICON_SWAP_IN,
	ICON_SWAP_OUT,
} from "@ui-kit/press";

export function CopyImport({ code }: { code: string }) {
	const [copied, setCopied] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	useEffect(() => () => clearTimeout(timer.current), []);

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			clearTimeout(timer.current);
			timer.current = setTimeout(() => setCopied(false), 1200);
		} catch {}
	};

	return (
		<div className="flex min-w-0 items-center gap-2 rounded-lg bg-white py-1 pr-1 pl-3 ring ring-gray-500/10 shadow-skew">
			<code className="min-w-0 flex-1 truncate font-mono text-[12px] text-gray-600">
				{code}
			</code>
			<Button
				iconOnly
				aria-label={copied ? "Copied" : "Copy import"}
				onClick={copy}
				className="group shadow-none ring-0 hover:bg-gray-100"
			>
				<span className="relative size-4">
					<span className={cn("absolute inset-0", ICON_SWAP, copied ? ICON_SWAP_OUT : ICON_SWAP_IN)}>
						<CopyIcon className={ICON_PRESS} />
					</span>
					<span className={cn("absolute inset-0", ICON_SWAP, copied ? ICON_SWAP_IN : ICON_SWAP_OUT)}>
						<CheckCircleIcon className={ICON_PRESS} />
					</span>
				</span>
			</Button>
		</div>
	);
}
