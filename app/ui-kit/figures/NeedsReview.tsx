"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "../cn";
import { FigureFrame } from "./FigureFrame";
import { OldRaidView } from "./OldRaidView";
import { RaidRow } from "./RaidRow";
import { SECTIONS } from "./raid-items";

/** What the frame has room for, per section. */
const SHOWN = [3, 7, 3, 3];
import { CollapseIcon, PlayIcon, VolumeIcon } from "./review-icons";

const CHIP = "bg-white ring-1 ring-gray-500/15 shadow-sm";
const TAB = "flex h-7 w-21 shrink-0 items-center justify-center rounded-full text-sm font-[500] text-gray-900";
const TAB_IDLE = "bg-gray-500/10 ring-1 ring-gray-500/10";

export function NeedsReview() {
	const [after, setAfter] = useState(true);

	return (
		<FigureFrame
			ratio="12 / 7"
			footer={
				<div className="flex items-center justify-center gap-1 border-t border-gray-200 py-3">
					<button
						type="button"
						onClick={() => setAfter(false)}
						className={cn(TAB, after ? TAB_IDLE : CHIP)}
					>
						Before
					</button>
					<button
						type="button"
						onClick={() => setAfter(true)}
						className={cn(TAB, after ? CHIP : TAB_IDLE)}
					>
						After
					</button>
				</div>
			}
		>
			{/* The list runs past the frame, as it does in the product — cropped
			    rather than scrolled, so the page keeps the only scrollbar. */}
			<div className="h-full bg-gray-50 p-5">
				{after ? (
					<>
						<Player />
						<div className="mt-4 flex flex-col gap-5">
							{SECTIONS.map(({ heading, items }, index) => (
								<section key={heading}>
									<h4 className="mb-2 text-sm font-[500] text-gray-900">
										{heading}
									</h4>
									{items.slice(0, SHOWN[index]).map((item) => (
										<RaidRow key={item.title} item={item} />
									))}
									<div className="mt-6 h-px w-full bg-gray-500/10" />
								</section>
							))}
						</div>
					</>
				) : (
					<OldRaidView />
				)}
			</div>
		</FigureFrame>
	);
}

function Player() {
	return (
		<div className="flex gap-2 rounded-2xl bg-white p-2 ring-1 ring-gray-500/10 shadow-lg shadow-gray-900/5">
			<div className="relative aspect-video shrink-0 self-stretch overflow-hidden rounded-lg bg-black ring-1 ring-gray-500/20">
				<Image
					src="/casestudies/raid-2-0/meeting-thumb.webp"
					alt=""
					fill
					sizes="128px"
					// The source carries its own border; overscanning past it keeps
					// the slot filled corner to corner.
					className="scale-120 object-cover"
				/>
			</div>
			<div className="flex w-full min-w-0 flex-col gap-3 px-2 pt-2.5 pb-2">
				<div className="h-1.5 shrink-0 rounded-full bg-gray-500/10" />
				<div className="flex items-center">
					<div className="flex w-full items-center gap-4">
						<span
							className={cn(
								"flex size-9 shrink-0 items-center justify-center rounded-full text-gray-600",
								CHIP,
							)}
						>
							<PlayIcon />
						</span>
						<span className="text-sm font-[500] whitespace-nowrap text-gray-600">
							0:00:00 / 1:04:19
						</span>
					</div>
					<div className="flex w-full items-center justify-end gap-2">
						<span
							className={cn(
								"flex size-7 shrink-0 items-center justify-center rounded-full text-gray-600",
								CHIP,
							)}
						>
							<VolumeIcon />
						</span>
						<span
							className={cn(
								"flex h-7 shrink-0 items-center rounded-full px-2.5 text-sm font-[500] text-gray-600",
								CHIP,
							)}
						>
							1x
						</span>
						<span
							className={cn(
								"flex size-7 shrink-0 items-center justify-center rounded-full text-gray-600",
								CHIP,
							)}
						>
							<CollapseIcon />
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
