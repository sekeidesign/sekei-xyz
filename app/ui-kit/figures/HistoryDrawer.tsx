import { cn } from "../cn";
import { RiskIcon } from "../icons/RiskIcon";
import { FigureFrame } from "./FigureFrame";
import { RaidPanel } from "./RaidPanel";
import { StatusDial } from "./StatusDial";
import { SECTIONS } from "./raid-items";
import {
	CalendarIcon,
	ExternalLinkIcon,
	ImpactIcon,
	LikelihoodIcon,
	TrackIcon,
} from "./review-icons";

const ITEM = SECTIONS[0].items[0];

const CHIP =
	"flex h-5.5 shrink-0 items-center gap-1 rounded-full px-1.5 text-xs ring-1 ring-inset";

/**
 * What changed and why, rather than a diff between versions: each entry is a
 * version with the agent's reasoning, or the activity a version came from.
 */
const HISTORY = [
	{
		version: "v3",
		at: "Sep 4, 2026, 10:29 PM",
		body: "Raised to critical: the recorder is now failing on every tenant-authenticated session, not just the customer's own.",
	},
	{
		source: "Scope confirmation workshop",
		at: "Sep 3, 2026, 4:30 PM",
	},
	{
		version: "v2",
		at: "Aug 28, 2026, 9:04 AM",
		body: "Owner moved to the programme lead after the integration workstream handed it back.",
	},
	{
		source: "Weekly programme review",
		at: "Aug 28, 2026, 9:00 AM",
	},
	{
		version: "v1",
		at: "Aug 21, 2026, 2:12 PM",
		body: "Opened from a workshop where two attendees joined on the customer tenant and no transcript was produced.",
	},
];

export function HistoryDrawer() {
	return (
		<FigureFrame ratio="8 / 5">
			<div className="relative flex h-full justify-end">
				<div className="absolute inset-0 flex">
					<RaidPanel shown={[3, 4, 2, 2]} />
				</div>
				<div className="absolute inset-0 bg-gray-900/20" />
				<div className="relative flex w-full flex-col gap-4 bg-white p-5 ring-1 ring-gray-500/10 shadow-2xl sm:w-130">
					<div className="flex flex-col gap-4">
						<div className="flex items-center justify-between gap-3">
							<div className="flex items-center gap-1">
								<RiskIcon size={14} className="text-gray-400" />
								<span className="font-mono text-xs font-[500] text-gray-400">
									{ITEM.id}
								</span>
							</div>
							<span className="shrink-0 text-xs text-gray-400">
								Latest · Sep 4, 2026, 10:29 PM
							</span>
						</div>
						<div className="flex flex-col gap-1">
							<h3 className="text-xl font-[500] text-gray-900">{ITEM.title}</h3>
							<p className="text-sm text-gray-600">
								The recorder is turned away from any session that requires a
								tenant sign-in, so a workshop run on the customer&apos;s own account
								produces no transcript and nothing reaches the log until someone
								writes it up by hand. Two of the last four workshops were run
								that way, and the items from both were reconstructed after the
								fact.
							</p>
						</div>
						<div className="flex items-center justify-between gap-3">
							<div className="flex min-w-0 items-center gap-1.5">
								<span
									className={cn(
										CHIP,
										"bg-amber-400/15 text-amber-700 ring-amber-400/15",
									)}
								>
									<StatusDial status="Open" />
									Open
								</span>
								<span
									className={cn(
										CHIP,
										"bg-gray-500/10 text-gray-600 ring-gray-500/10",
									)}
								>
									External
								</span>
								<span
									className={cn(
										"flex size-5 shrink-0 items-center justify-center rounded-full text-[8px] text-white",
										ITEM.tint,
									)}
								>
									{ITEM.who}
								</span>
								<span
									className={cn(
										CHIP,
										"bg-orange-500/15 text-orange-700 ring-orange-500/15",
									)}
								>
									<ImpactIcon level={4} className="text-orange-600" />
									Critical
								</span>
								<span
									className={cn(
										CHIP,
										"bg-amber-400/15 text-amber-700 ring-amber-400/15",
									)}
								>
									<LikelihoodIcon level={3} className="text-amber-400" />
									Likely
								</span>
							</div>
							<span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-gray-400 ring-1 ring-gray-500/20 shadow-sm">
								<TrackIcon />
							</span>
						</div>
					</div>
					<div className="h-px w-full bg-gray-500/10" />
					<div className="relative flex flex-col gap-2">
						<div className="absolute inset-y-3 left-5 w-px -translate-x-1/2 bg-gray-500/10" />
						{HISTORY.map((entry) => (
							<div
								key={entry.at}
								className="relative flex min-w-0 gap-2.5 rounded-lg p-1"
							>
								{/* The marker sits on its own patch of white, which is what
								    breaks the spine behind it. */}
								<div className="absolute top-1 left-1 h-4 w-8 bg-white" />
								<div className="relative flex w-8 shrink-0 justify-center">
									{entry.version ? (
										<>
											<span className="h-4 content-center font-mono text-xs text-gray-600">
												{entry.version}
											</span>
											<span className="absolute top-2 -left-1.5 h-2.5 w-0.5 -translate-y-1/2 rounded-full bg-blue-500" />
										</>
									) : (
										<span className="flex h-4 items-center">
											<CalendarIcon size={14} className="text-gray-600" />
										</span>
									)}
								</div>
								<div className="relative flex min-w-0 grow flex-col gap-0.5">
									<span className="text-xs text-gray-400/75">{entry.at}</span>
									<span
										className={cn(
											"min-w-0 text-xs font-[500]",
											entry.version ? "text-gray-600" : "text-gray-400",
										)}
									>
										{entry.body ?? entry.source}
									</span>
								</div>
								{entry.source && (
									<span className="relative flex shrink-0 items-center">
										<ExternalLinkIcon
											size={14}
											className="text-gray-400/75"
										/>
									</span>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</FigureFrame>
	);
}
