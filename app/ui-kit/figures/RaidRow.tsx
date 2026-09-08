import { cn } from "../cn";
import { BADGE, type Item } from "./raid-items";
import { StatusDial } from "./StatusDial";
import {
	DismissIcon,
	ImpactIcon,
	LikelihoodIcon,
	TrackIcon,
} from "./review-icons";

export function RaidRow({ item }: { item: Item }) {
	return (
		<div className="flex items-center gap-3 rounded-xl py-1.5 pr-1.5 pl-2.5">
			<div className="flex w-full min-w-0 items-center gap-2">
				<StatusDial status={item.status} />
				<span className="line-clamp-1 grow text-sm text-gray-900">
					{item.title}
				</span>
				{/* With the badge in the right-hand cluster the states line up down
				    the list, rather than each one trailing its own title. */}
				<span
					className={cn(
						"flex h-4.5 shrink-0 items-center rounded-full px-1.5 text-xs",
						BADGE[item.badge],
					)}
				>
					{item.badge}
				</span>
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
