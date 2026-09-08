import { ArrowUpTrayIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import { cn } from "../cn";
import { FigureFrame } from "./FigureFrame";
import { RaidPanel } from "./RaidPanel";
import {
	CollapseIcon,
	EditIcon,
	MenuIcon,
	PlayIcon,
	SkillIcon,
	SkillsIcon,
	VolumeIcon,
} from "./review-icons";

/** Fewer rows than the review list, which is all the figure has room for. */
const SHOWN = [2, 3, 1, 1];

const CHIP = "bg-white ring-1 ring-gray-500/10 shadow-sm";

const ATTENDEES = [
	{ who: "D", role: "Programme lead", tint: "bg-blue-500", share: "45%" },
	{ who: "N", role: "Integration lead", tint: "bg-rose-500", share: "45%" },
	{ who: "F", role: "Finance workstream", tint: "bg-violet-500", share: "9%" },
	{ who: "A", role: "Data migration", tint: "bg-amber-600", share: "1%" },
];

/**
 * Talk time, as the design draws it: a run of bars per speaker, wide where they
 * held the floor. Fixed patterns rather than random, so the figure is stable
 * between renders.
 */
const TALK = [
	[2, 5, 2, 24, 2, 2, 2, 2, 2, 7, 2, 3, 2, 2, 7, 2, 2, 5, 2, 2, 2, 7, 2, 2, 2, 10, 2, 2, 4],
	[2, 14, 2, 3, 7, 9, 6, 5, 4, 2, 2, 2, 2, 6, 2, 2, 2, 2, 2, 2, 2, 3, 5, 2, 2, 2, 8, 3, 3],
	[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 3, 2, 3, 2, 2, 2, 2],
	[2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
];

const SKILLS = [
	{
		title: "Meeting follow-up",
		body: "Extracts next steps, assigns action items per participant, and proposes follow-up slots.",
	},
	{ title: "Recent meeting highlights" },
	{ title: "Open action items" },
];

export function SummaryPanel() {
	return (
		<FigureFrame ratio="8 / 5">
			<div className="flex h-full">
				<Meeting />
				<div className="flex min-w-0 grow border-l border-gray-500/10">
					<RaidPanel shown={SHOWN} />
				</div>
			</div>
		</FigureFrame>
	);
}

/**
 * The meeting it all came from, at the width the design gives it and hanging
 * off the left edge — the panel is the subject, this is the context it keeps.
 */
function Meeting() {
	return (
		<div className="-ml-88 hidden w-140 shrink-0 flex-col sm:flex">
			<div className="flex h-11 shrink-0 items-center justify-end gap-1 border-b border-gray-500/10 px-2">
				<span
					className={cn(
						"flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-sm font-[500] text-gray-600",
						CHIP,
					)}
				>
					<ArrowUpTrayIcon className="size-3.5" />
					Share
				</span>
				<span className="flex size-7 items-center justify-center rounded-lg text-gray-600">
					<MenuIcon size={16} />
				</span>
			</div>
			<div className="flex min-w-0 flex-col gap-6 p-4">
				<h3 className="text-2xl font-[550] text-gray-900">
					Scope confirmation workshop
				</h3>
				<dl className="grid grid-cols-[80px_1fr] items-start gap-x-2 gap-y-4">
					<dt className="pt-1.5 text-xs font-[500] text-gray-400">Projects</dt>
					<dd className="flex flex-wrap items-center gap-2">
						<span className="flex h-5.5 items-center rounded-full bg-gray-500/10 px-2 text-xs text-gray-600 ring-1 ring-gray-500/10 ring-inset">
							Phase 2 rollout
						</span>
						<EditIcon size={12} className="text-gray-600" />
					</dd>
					<dt className="text-xs font-[500] text-gray-400">Date</dt>
					<dd className="text-sm text-gray-600">
						Thursday, Sep 3, 2026 at 4:30 PM
					</dd>
					<dt className="pt-1 text-xs font-[500] text-gray-400">Attendees</dt>
					<dd className="flex min-w-0 items-center gap-2">
						<span className="flex shrink-0">
							{ATTENDEES.map(({ who, tint }) => (
								<span
									key={who}
									className={cn(
										"-ml-1.5 flex size-5 items-center justify-center rounded-full text-[8px] text-white ring-2 ring-white first:ml-0",
										tint,
									)}
								>
									{who}
								</span>
							))}
							<span className="-ml-1.5 flex size-5 items-center justify-center rounded-full bg-gray-800 text-[8px] text-white ring-2 ring-white">
								+1
							</span>
						</span>
						<span className="line-clamp-1 text-sm text-gray-600">
							{ATTENDEES.map(({ role }) => role).join(", ")}
						</span>
					</dd>
				</dl>
				<div className="flex flex-col gap-4">
					<div className="relative aspect-video overflow-hidden rounded-xl bg-black ring-1 ring-gray-500/20">
						<Image
							src="/casestudies/raid-2-0/meeting-thumb.webp"
							alt=""
							fill
							sizes="512px"
							className="scale-120 object-cover"
						/>
						<span className="absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur-sm">
							<PlayIcon />
						</span>
					</div>
					<div className="h-1.5 overflow-hidden rounded-full bg-gray-500/10">
						<div className="h-full w-2/5 rounded-full bg-gray-700" />
					</div>
					<div className="flex items-center">
						<div className="flex grow items-center gap-4">
							<span
								className={cn(
									"flex size-9 shrink-0 items-center justify-center rounded-full text-gray-600",
									CHIP,
								)}
							>
								<PlayIcon />
							</span>
							<span className="text-sm font-[500] whitespace-nowrap text-gray-600">
								0:28:12 / 1:04:19
							</span>
						</div>
						<div className="flex shrink-0 items-center gap-2">
							<span
								className={cn(
									"flex size-7 items-center justify-center rounded-full text-gray-600",
									CHIP,
								)}
							>
								<VolumeIcon size={16} />
							</span>
							<span
								className={cn(
									"flex h-7 items-center rounded-full px-2.5 text-sm font-[500] text-gray-600",
									CHIP,
								)}
							>
								1x
							</span>
							<span
								className={cn(
									"flex size-7 items-center justify-center rounded-full text-gray-600",
									CHIP,
								)}
							>
								<CollapseIcon size={16} />
							</span>
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-2">
					{ATTENDEES.map(({ who, role, tint, share }, index) => (
						<div key={who} className="flex items-center gap-2">
							<span
								className={cn(
									"flex size-5 shrink-0 items-center justify-center rounded-full text-[8px] text-white",
									tint,
								)}
							>
								{who}
							</span>
							<span className="w-26 shrink-0 truncate text-sm text-gray-600">
								{role}
							</span>
							<span className="flex grow items-center gap-0.5">
								{TALK[index].map((width, bar) => (
									<span
										key={bar}
										style={{ width }}
										className="h-1.5 shrink-0 rounded-full bg-blue-500"
									/>
								))}
							</span>
							<span className="w-8 shrink-0 text-right text-sm text-gray-400 tabular-nums">
								{share}
							</span>
						</div>
					))}
				</div>
				<div className="flex flex-col gap-2.5">
					<div className="flex items-center justify-between">
						<span className="text-xs font-[500] text-gray-400">Skills</span>
						<span className="-my-1.5 flex size-7 items-center justify-center rounded-lg text-gray-600">
							<SkillsIcon size={16} />
						</span>
					</div>
					{SKILLS.map(({ title, body }) => (
						<div
							key={title}
							className="flex items-start gap-1.5 rounded-lg bg-gray-500/10 px-2 py-1.5 ring-1 ring-gray-500/10"
						>
							<SkillIcon size={16} className="mt-0.5 text-orange-600" />
							<div className="min-w-0 grow">
								<p className="line-clamp-1 text-sm font-[500] text-gray-600">
									{title}
								</p>
								{body && (
									<p className="line-clamp-1 text-xs text-gray-400">{body}</p>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
