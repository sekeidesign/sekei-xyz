"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "../cn";
import { OldRaidView } from "./OldRaidView";
import {
	CollapseIcon,
	DismissIcon,
	ImpactIcon,
	LikelihoodIcon,
	PlayIcon,
	StatusIcon,
	TrackIcon,
	VolumeIcon,
} from "./review-icons";

type Badge = "New" | "Update";

const BADGE: Record<Badge, string> = {
	New: "bg-orange-500/15 text-orange-700",
	Update: "bg-gray-500/10 text-gray-600",
};

interface Item {
	title: string;
	badge: Badge;
	who: string;
	tint: string;
	impact: number;
	likelihood: number;
	started?: boolean;
}

const SECTIONS: { heading: string; items: Item[] }[] = [
	{
		heading: "Risks",
		items: [
			{
				title: "Recorder can't join authenticated meetings",
				badge: "New",
				who: "E",
				tint: "bg-blue-500",
				impact: 4,
				likelihood: 2,
				started: true,
			},
			{
				title: "Integration approval adds two weeks to the plan",
				badge: "New",
				who: "M",
				tint: "bg-emerald-600",
				impact: 3,
				likelihood: 3,
				started: true,
			},
			{
				title: "Data migration sign-off still pending finance review",
				badge: "Update",
				who: "R",
				tint: "bg-violet-500",
				impact: 2,
				likelihood: 2,
				started: true,
			},
		],
	},
	{
		heading: "Action Items",
		items: [
			{
				title: "Confirm who owns the employee master record",
				badge: "New",
				who: "D",
				tint: "bg-blue-500",
				impact: 3,
				likelihood: 2,
			},
			{
				title: "Share the localisation gap list with the workstream",
				badge: "Update",
				who: "N",
				tint: "bg-rose-500",
				impact: 2,
				likelihood: 1,
			},
			{
				title: "Submit the ticket to activate scope item J78",
				badge: "New",
				who: "A",
				tint: "bg-amber-600",
				impact: 3,
				likelihood: 3,
			},
			{
				title: "Create users and replicate roles in the sandbox",
				badge: "Update",
				who: "N",
				tint: "bg-rose-500",
				impact: 2,
				likelihood: 2,
			},
			{
				title: "Send starter system access links to the new team",
				badge: "New",
				who: "M",
				tint: "bg-emerald-600",
				impact: 1,
				likelihood: 1,
			},
			{
				title: "Book the enablement session for the finance leads",
				badge: "New",
				who: "F",
				tint: "bg-violet-500",
				impact: 2,
				likelihood: 3,
			},
			{
				title: "Draft the rollback plan before the next cycle",
				badge: "Update",
				who: "D",
				tint: "bg-blue-500",
				impact: 4,
				likelihood: 2,
			},
		],
	},
	{
		heading: "Issues",
		items: [
			{
				title: "Staging data is out of sync with production",
				badge: "New",
				who: "R",
				tint: "bg-violet-500",
				impact: 4,
				likelihood: 3,
				started: true,
			},
			{
				title: "Report format differs across workstreams",
				badge: "Update",
				who: "A",
				tint: "bg-amber-600",
				impact: 2,
				likelihood: 2,
				started: true,
			},
			{
				title: "Sandbox refresh wiped the test users",
				badge: "New",
				who: "N",
				tint: "bg-rose-500",
				impact: 3,
				likelihood: 1,
				started: true,
			},
		],
	},
	{
		heading: "Decisions",
		items: [
			{
				title: "Roll out in phases, region by region",
				badge: "New",
				who: "E",
				tint: "bg-blue-500",
				impact: 3,
				likelihood: 2,
				started: true,
			},
			{
				title: "Standardise on one report format",
				badge: "Update",
				who: "F",
				tint: "bg-violet-500",
				impact: 2,
				likelihood: 2,
				started: true,
			},
			{
				title: "Keep the legacy interface until the Q4 cutover",
				badge: "Update",
				who: "M",
				tint: "bg-emerald-600",
				impact: 3,
				likelihood: 3,
				started: true,
			},
		],
	},
];

const CHIP = "bg-white ring-1 ring-gray-500/15 shadow-sm";
const TAB = "flex h-7 w-21 shrink-0 items-center justify-center rounded-full text-sm font-[500] text-gray-900";
const TAB_IDLE = "bg-gray-500/10 ring-1 ring-gray-500/10";

export function NeedsReview() {
	const [after, setAfter] = useState(true);

	return (
		// Full bleed, walking back the panel's own padding the way a Figure does.
		<div className="my-6 -mx-6 border-y border-gray-200 bg-gray-50 md:-mx-13">
			{/* The list runs past the frame, as it does in the product — cropped
			    rather than scrolled, so the page keeps the only scrollbar. */}
			<div className="h-112 overflow-hidden p-5">
				{after ? (
					<>
						<Player />
						<div className="mt-4 flex flex-col gap-5">
							{SECTIONS.map(({ heading, items }) => (
								<section key={heading}>
									<h4 className="mb-2 text-sm font-[500] text-gray-900">
										{heading}
									</h4>
									{items.map((item) => (
										<Row key={item.title} item={item} />
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
		</div>
	);
}

function Player() {
	return (
		<div className="flex gap-2 rounded-2xl bg-white p-2 ring-1 ring-gray-500/10 shadow-lg shadow-gray-900/5">
			<div className="relative aspect-video h-14 shrink-0 overflow-hidden rounded-lg bg-black ring-1 ring-gray-500/20 sm:h-18">
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
					<div className="hidden w-full items-center justify-end gap-2 sm:flex">
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

function Row({ item }: { item: Item }) {
	return (
		<div className="flex items-center gap-3 rounded-xl py-1.5 pr-1.5 pl-2.5">
			<div className="flex w-full min-w-0 items-center gap-2">
				<StatusIcon started={item.started} className="text-amber-400" />
				<div className="flex min-w-0 grow items-center gap-1">
					<span className="line-clamp-1 text-sm text-gray-900">
						{item.title}
					</span>
					<span
						className={cn(
							"flex h-4.5 shrink-0 items-center rounded-full px-1.5 text-xs",
							BADGE[item.badge],
						)}
					>
						{item.badge}
					</span>
				</div>
				<span
					className={cn(
						"flex size-4 shrink-0 items-center justify-center rounded-full text-[8px] text-white",
						item.tint,
					)}
				>
					{item.who}
				</span>
				<ImpactIcon level={item.impact} className="text-amber-400" />
				<LikelihoodIcon level={item.likelihood} className="text-gray-700/50" />
			</div>
			<div className="flex shrink-0 items-center rounded-full bg-white ring-1 ring-gray-500/10 shadow-skew">
				<span className="flex size-7 items-center justify-center rounded-full text-gray-600">
					<DismissIcon />
				</span>
				<span className="-mx-px h-3 w-px bg-gray-400/20" />
				<span className="flex size-7 items-center justify-center rounded-full text-gray-600">
					<TrackIcon />
				</span>
			</div>
		</div>
	);
}
