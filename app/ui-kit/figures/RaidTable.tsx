import { cn } from "../cn";
import { ActionIcon } from "../icons/ActionIcon";
import { DecisionIcon } from "../icons/DecisionIcon";
import { IssueIcon } from "../icons/IssueIcon";
import { RiskIcon } from "../icons/RiskIcon";
import { FigureFrame } from "./FigureFrame";
import { StatusDial } from "./StatusDial";
import { type Item, OWNER, SECTIONS } from "./raid-items";
import {
	ChevronIcon,
	ImpactIcon,
	LikelihoodIcon,
	MenuIcon,
	TrackIcon,
} from "./review-icons";

const TABS = [
	{ label: "Risks", Icon: RiskIcon },
	{ label: "Action Items", Icon: ActionIcon },
	{ label: "Issues", Icon: IssueIcon },
	{ label: "Decisions", Icon: DecisionIcon },
];

const RISKS = SECTIONS[0].items;

const IMPACT = ["Low", "Medium", "High", "Critical"];
const PROBABILITY = ["Unlikely", "Possible", "Likely"];

/**
 * The design's widths, less Project, Category and Last updated, and each one
 * widened to hold its longest value: the table is drawn for a 1440 screen and
 * the figure has around 900, so it runs off the right edge rather than
 * truncating what it carries. Only Title, long by nature, clips.
 */
const COLUMNS = [
	{ label: "ID", width: "w-24" },
	{ label: "", width: "w-10" },
	{ label: "Title", width: "w-85" },
	{ label: "Owner", width: "w-42" },
	{ label: "Status", width: "w-30" },
	{ label: "Impact", width: "w-28" },
	{ label: "Probability", width: "w-34" },
];

const CHECKBOX =
	"size-5 shrink-0 rounded-md bg-white ring-1 ring-stone-400/20 shadow-sm";

/** An unset filter, which is what the dashed outline says. */
const FILTER =
	"flex h-7 shrink-0 items-center gap-1.5 rounded-full border border-dashed border-stone-400/30 px-2.5 text-sm font-[500] text-stone-600";

export function RaidTable() {
	return (
		<FigureFrame ratio="8 / 5">
			<div className="flex h-full flex-col bg-white">
				<div className="flex h-13 shrink-0 items-end border-b border-stone-400/20 px-4">
					{TABS.map(({ label, Icon }, index) => {
						const active = index === 0;
						return (
							<div key={label} className="flex flex-col">
								<span className="flex items-center gap-2 rounded-lg p-2 pb-1.5">
									<Icon
										size={16}
										className={active ? "text-stone-600" : "text-stone-400"}
									/>
									<span
										className={cn(
											"text-sm font-[500]",
											active ? "text-stone-900" : "text-stone-600",
										)}
									>
										{label}
									</span>
								</span>
								<span
									className={cn(
										"h-0.5 rounded-full bg-stone-800",
										!active && "opacity-0",
									)}
								/>
							</div>
						);
					})}
				</div>

				<div className="shrink-0 border-b border-stone-400/30 p-4">
					<div className="flex flex-wrap items-center justify-between gap-2">
						<div className="flex grow items-center gap-1">
							<span className="mr-1 flex h-7 w-62.5 shrink-0 items-center rounded-lg bg-white ring-1 ring-stone-400/30 shadow-sm">
								<span className="flex h-full shrink-0 items-center px-1.5">
									<SearchIcon />
								</span>
								<span className="-ml-1.5 truncate px-1.5 text-sm text-stone-900/50">
									Search...
								</span>
							</span>
							{["Tracking", "Status", "Owner", "Date"].map((filter) => (
								<span key={filter} className={cn(FILTER, "hidden md:flex")}>
									<PlusIcon />
									{filter}
								</span>
							))}
							<span className={cn(FILTER, "hidden lg:flex")}>More</span>
						</div>
						<div className="flex shrink-0 items-center">
							<span className="mr-2 flex size-7 items-center justify-center rounded-lg bg-white text-stone-600 ring-1 ring-stone-400/30 shadow-sm">
								<ColumnsIcon />
							</span>
							<span className="mr-2 flex size-7 items-center justify-center rounded-lg bg-white text-stone-600 ring-1 ring-stone-400/30 shadow-sm">
								<DownloadIcon />
							</span>
							<span className="flex h-7 items-center gap-1.5 rounded-lg bg-linear-to-b from-stone-700 to-stone-900 px-2.5 text-sm font-[500] text-white ring-1 ring-stone-950 shadow-md inset-shadow-2xs inset-shadow-white/15">
								<PlusIcon className="text-white" />
								New
							</span>
						</div>
					</div>
				</div>

				<div className="flex h-12 w-max min-w-full shrink-0 items-center border-b border-stone-400/20 bg-stone-100 pl-4">
					<span className={CHECKBOX} />
					{COLUMNS.map(({ label, width }) => (
						<span
							key={label || "track"}
							className={cn(
								"flex shrink-0 items-center gap-1.5 px-4 text-sm font-[500] text-stone-600",
								width,
							)}
						>
							<span className="whitespace-nowrap">{label}</span>
							{label && <SortIcon />}
						</span>
					))}
					<span className="w-10 shrink-0" />
				</div>

				{/* Clipped, or the rows past the frame paint over the footer. */}
				<div className="min-h-0 grow overflow-hidden">
					{RISKS.map((item, index) => (
						<Row key={item.id} item={item} shaded={index % 2 === 1} />
					))}
				</div>

				<div className="flex h-14 shrink-0 items-center justify-between border-t border-stone-400/20 px-4 text-sm text-stone-500">
					<span>{RISKS.length} items</span>
					<span className="flex items-center gap-3">
						<span className="hidden md:inline">Rows per page</span>
						<span className="flex h-8 w-16 items-center justify-between rounded-lg px-2.5 text-stone-600 ring-1 ring-stone-400/30">
							10
							<ChevronIcon size={16} className="text-stone-400" />
						</span>
						<span className="tabular-nums">
							1 <span className="text-stone-400">of</span> 1
						</span>
						<ChevronIcon size={16} className="rotate-90 text-stone-400" />
						<ChevronIcon size={16} className="-rotate-90 text-stone-400" />
					</span>
				</div>
			</div>
		</FigureFrame>
	);
}

function Row({ item, shaded }: { item: Item; shaded: boolean }) {
	return (
		<div
			className={cn(
				"flex w-max min-w-full items-center border-b border-stone-400/20 pl-4",
				shaded ? "bg-stone-50" : "bg-white",
			)}
		>
			<span className={CHECKBOX} />
			<span className="w-24 shrink-0 p-4 font-mono text-sm whitespace-nowrap text-stone-400">
				{item.id}
			</span>
			<span className="flex w-10 shrink-0 justify-center py-4">
				<TrackIcon size={16} className="text-stone-400" />
			</span>
			<span className="w-85 shrink-0 truncate p-4 text-sm font-[500] text-stone-900">
				{item.title}
			</span>
			<span className="flex w-42 shrink-0 items-center gap-1.5 p-4">
				<span
					className={cn(
						"flex size-4 shrink-0 items-center justify-center rounded-full text-[8px] text-white",
						item.tint,
					)}
				>
					{item.who}
				</span>
				<span className="text-sm whitespace-nowrap text-stone-600">
					{OWNER[item.who]}
				</span>
			</span>
			<span className="flex w-30 shrink-0 items-center gap-1.5 p-4">
				<StatusDial status={item.status} />
				<span className="text-sm whitespace-nowrap text-stone-600">
					{item.status}
				</span>
			</span>
			<span className="flex w-28 shrink-0 items-center gap-1.5 p-4">
				<ImpactIcon
					level={item.impact}
					className={item.impact > 3 ? "text-orange-600" : "text-amber-400"}
				/>
				<span className="text-sm whitespace-nowrap text-stone-600">
					{IMPACT[item.impact - 1]}
				</span>
			</span>
			<span className="flex w-34 shrink-0 items-center gap-1.5 p-4">
				<LikelihoodIcon level={item.likelihood} className="text-stone-700/50" />
				<span className="text-sm whitespace-nowrap text-stone-600">
					{PROBABILITY[item.likelihood - 1]}
				</span>
			</span>
			<span className="flex w-10 shrink-0 justify-center text-stone-600">
				<MenuIcon size={16} />
			</span>
		</div>
	);
}

/** The design's sort affordance: a chevron above and one below. */
function SortIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			width={16}
			height={16}
			fill="none"
			className="shrink-0 text-stone-400"
			aria-hidden="true"
			focusable="false"
		>
			{[
				"M18 14C18 14 13.581 19 12 19C10.419 19 6 14 6 14",
				"M18 10C18 10 13.581 5 12 5C10.419 5 6 10 6 10",
			].map((d) => (
				<path
					key={d}
					d={d}
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			))}
		</svg>
	);
}

function SearchIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			width={16}
			height={16}
			fill="none"
			className="shrink-0 text-stone-400"
			aria-hidden="true"
			focusable="false"
		>
			{[
				"M17 17L21 21",
				"M19 11C19 6.582 15.418 3 11 3C6.582 3 3 6.582 3 11C3 15.418 6.582 19 11 19C15.418 19 19 15.418 19 11Z",
			].map((d) => (
				<path
					key={d}
					d={d}
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			))}
		</svg>
	);
}

function PlusIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			width={16}
			height={16}
			fill="none"
			className={cn("shrink-0 text-stone-600", className)}
			aria-hidden="true"
			focusable="false"
		>
			<path
				d="M12 4V20M20 12H4"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function ColumnsIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			width={16}
			height={16}
			fill="none"
			className="shrink-0 text-stone-600"
			aria-hidden="true"
			focusable="false"
		>
			{[
				"M4 5.001L10 5",
				"M13 5L20 5",
				"M16 9L16 15",
				"M10 2L10 8",
				"M12 16L12 22",
				"M16 12L20 12",
				"M4 12.001L13 12",
				"M12 19L20 19",
				"M4 19L9 19",
			].map((d) => (
				<path
					key={d}
					d={d}
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
				/>
			))}
		</svg>
	);
}

function DownloadIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			width={16}
			height={16}
			fill="none"
			className="shrink-0 text-stone-600"
			aria-hidden="true"
			focusable="false"
		>
			{[
				"M3 17C3 17.93 3 18.395 3.102 18.777C3.379 19.812 4.188 20.621 5.223 20.898C5.605 21 6.07 21 7 21L17 21C17.93 21 18.395 21 18.776 20.898C19.811 20.621 20.62 19.812 20.898 18.777C21 18.395 21 17.93 21 17",
				"M16.5 11.5C16.5 11.5 13.186 16 12 16C10.814 16 7.5 11.5 7.5 11.5M12 15V3",
			].map((d) => (
				<path
					key={d}
					d={d}
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			))}
		</svg>
	);
}
