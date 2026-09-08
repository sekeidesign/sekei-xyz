import { cn } from "../cn";
import { RaidRow } from "./RaidRow";
import { SECTION_ICON, SECTIONS } from "./raid-items";
import { ChevronIcon, MenuIcon } from "./review-icons";

const CHIP = "bg-white ring-1 ring-gray-500/10 shadow-sm";

/** The RAID tab's own panel: the tab bar, then a group per type. */
export function RaidPanel({ shown }: { shown: number[] }) {
	const sections = SECTIONS.map((section, index) => ({
		...section,
		items: section.items.slice(0, shown[index]),
	}));
	const count = sections.reduce((total, { items }) => total + items.length, 0);

	return (
		<div className="flex min-w-0 grow flex-col">
			<div className="flex h-11 shrink-0 items-center justify-between gap-2 border-b border-gray-500/10 px-2">
				<div className="flex items-center gap-0.5">
					<span className="rounded-full px-2.5 py-1 text-sm font-[500] text-gray-600">
						Summary
					</span>
					<span
						className={cn(
							"flex items-center gap-1 rounded-full py-1 pr-1 pl-2.5 text-sm font-[500] text-gray-900",
							CHIP,
						)}
					>
						RAID
						<span className="flex h-5.5 min-w-5.5 items-center justify-center rounded-full bg-orange-600 px-1.5 font-mono text-xs text-white tabular-nums">
							{count}
						</span>
					</span>
					<span className="rounded-full px-2.5 py-1 text-sm font-[500] text-gray-600">
						Scope
					</span>
					<span className="rounded-full px-2.5 py-1 text-sm font-[500] text-gray-600">
						Transcript
					</span>
				</div>
				<span className="flex size-7 shrink-0 items-center justify-center rounded-lg text-gray-600">
					<MenuIcon size={16} />
				</span>
			</div>
			{sections.map(({ heading, items }) => {
				const Icon = SECTION_ICON[heading];
				return (
					<section key={heading}>
						<div className="flex items-center gap-2 border-b border-gray-500/10 bg-gray-50 px-4 py-2">
							<Icon size={16} className="text-gray-800" />
							<h4 className="text-sm font-[500] text-gray-900">{heading}</h4>
							<span className="text-sm text-gray-400 tabular-nums">
								{items.length}
							</span>
							<ChevronIcon size={16} className="ml-auto text-gray-400" />
						</div>
						<div className="px-2 py-1">
							{items.map((item) => (
								<RaidRow key={item.title} item={item} />
							))}
						</div>
					</section>
				);
			})}
		</div>
	);
}
