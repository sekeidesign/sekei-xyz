"use client";

import { useEffect, useRef, useState } from "react";
import "slot-text/style.css";
import { SlotText } from "slot-text/react";
import { cn } from "../cn";
import { ICON_PRESS, ICON_SWAP, ICON_SWAP_IN, ICON_SWAP_OUT } from "../press";
import { TooltipTrigger } from "../Tooltip";
import { ChainLinkIcon } from "../icons/ChainLinkIcon";
import { CheckCircleIcon } from "../icons/CheckCircleIcon";
import { FireIcon } from "../icons/FireIcon";
import { useSocial } from "./SocialProvider";

// Stable object: SlotText stashes options in a ref on every change. Rolls
// upward since the count only goes up, and skipUnchanged keeps 132 -> 133 to
// just the last digit.
const COUNT_ROLL = {
	direction: "up",
	duration: 220,
	stagger: 15,
	bounce: 0.4,
	skipUnchanged: true,
} as const;

/**
 * slot-text has no locale option, so grouping separators are ours to add.
 * Pinned to en-US: the counts also appear in server-rendered aria-labels, and a
 * locale mismatch there would be a hydration error.
 */
const COUNT_FORMAT = new Intl.NumberFormat("en-US");

/**
 * Written as a literal rather than var(--color-sky-400): Tailwind only emits
 * theme variables a utility actually uses, so the var would resolve to nothing
 * in an inline style.
 */
const FIRE_COLOR = "#ff5500";
const LINK_COLOR = "oklch(74.6% 0.16 232.661)";

/**
 * The wave across the chip's lattice. --ripple-x is the icon's centre: 6px of
 * left padding plus half of the 16px icon, so it starts where you pressed.
 */
function DotRipple({ color }: { color: string }) {
	return (
		<span
			className="dot-ripple"
			style={
				{ "--ripple-x": "14px", "--ripple-color": color } as React.CSSProperties
			}
		/>
	);
}

// SlotText fills itself in a mount effect, so the span is empty during SSR.
// A 1ch floor keeps the pill from resizing when the digits land.
const COUNT_CLASS =
	"inline-block min-w-[1ch] text-[14px] font-[500] text-gray-500/75 tabular-nums";

// #6A72821A ring + the theme's own shadow-skew, straight from the design.
const SEGMENT =
	"dot-matrix group relative overflow-clip flex items-center justify-center gap-1 h-6.5 w-fit bg-white ring-1 ring-gray-500/10 shadow-skew text-gray-500 hover:bg-gray-50 cursor-pointer";

export function SocialBar({
	slug,
	/** Path to the post, resolved against the current origin when copied; an absolute URL passes through. */
	sharePath,
	className,
}: {
	slug: string;
	sharePath: string;
	className?: string;
}) {
	const { counts, mine, bump } = useSocial(slug);
	const [copied, setCopied] = useState(false);
	// Bumped per click; keying the ripple on it remounts the element so the CSS
	// animation replays even on rapid repeats.
	const [pulse, setPulse] = useState({ fire: 0, link: 0 });
	const copiedTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined,
	);

	useEffect(() => () => clearTimeout(copiedTimer.current), []);

	const reacted = mine.fire > 0;

	const onLink = async () => {
		bump("link");
		try {
			await navigator.clipboard.writeText(
				new URL(sharePath, window.location.origin).toString(),
			);
			setCopied(true);
			clearTimeout(copiedTimer.current);
			copiedTimer.current = setTimeout(() => setCopied(false), 1000);
		} catch {
			// Clipboard can be blocked; the count still went up.
		}
	};

	return (
			<div className={cn("flex items-start gap-px", className)}>
				<TooltipTrigger
						type="button"
						payload={reacted ? "Add another reaction" : "Add a reaction"}
						onClick={() => {
							bump("fire");
							setPulse((p) => ({ ...p, fire: p.fire + 1 }));
						}}
						aria-label={`Add a reaction. ${COUNT_FORMAT.format(counts.fire)} so far`}
						className={cn(SEGMENT, "rounded-l-full px-1.5")}
					>
						{pulse.fire > 0 && (
							<DotRipple key={pulse.fire} color={FIRE_COLOR} />
						)}
						<FireIcon
							filled={reacted}
							className={cn(ICON_PRESS, "relative", reacted && "text-[#FF5500]")}
						/>
						<SlotText
							text={COUNT_FORMAT.format(counts.fire)}
							options={COUNT_ROLL}
							className={COUNT_CLASS}
						/>
					</TooltipTrigger>

				<TooltipTrigger
						type="button"
						payload={copied ? "Copied" : "Copy link"}
						onClick={() => {
							onLink();
							setPulse((p) => ({ ...p, link: p.link + 1 }));
						}}
						aria-label={`Copy link to this post. Copied ${COUNT_FORMAT.format(counts.link)} times`}
						className={cn(SEGMENT, "rounded-r-full pl-1.5 pr-2")}
					>
						{pulse.link > 0 && (
							<DotRipple key={pulse.link} color={LINK_COLOR} />
						)}
						{/* Both icons share the slot: the check sits on top and they swap
						    by blur, scale and opacity rather than one replacing the other. */}
						<span
							className={cn(
								ICON_PRESS,
								"relative flex items-center justify-center size-4 shrink-0",
							)}
						>
							<span
								// Same sky as this button's ripple, from the one constant.
								style={{ color: LINK_COLOR }}
								className={cn(
									ICON_SWAP,
									"absolute inset-0 flex items-center justify-center",
									copied ? ICON_SWAP_IN : ICON_SWAP_OUT,
								)}
							>
								<CheckCircleIcon />
							</span>
							<span
								className={cn(
									ICON_SWAP,
									"flex items-center justify-center",
									copied ? ICON_SWAP_OUT : ICON_SWAP_IN,
								)}
							>
								<ChainLinkIcon />
							</span>
						</span>
						<SlotText
							text={COUNT_FORMAT.format(counts.link)}
							options={COUNT_ROLL}
							className={COUNT_CLASS}
						/>
					</TooltipTrigger>
			</div>
	);
}
