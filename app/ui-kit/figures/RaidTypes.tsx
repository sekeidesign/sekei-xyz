import { Fragment } from "react";
import { cn } from "../cn";
import { KIND } from "../covers/raid-log";
import { SURFACE_INNER, SURFACE_OUTER } from "../post/surface";
import { Disc } from "./Disc";
import { RAID_KINDS } from "./kinds";

/** The rules at either end carry no colour — they only even out the spacing. */
function Rule({ className }: { className?: string }) {
	return <span className={cn("w-px shrink-0", className)} />;
}

export function RaidTypes() {
	return (
		<div className={cn("my-6 w-full cursor-default rounded-xl", SURFACE_OUTER)}>
			<div
				className={cn(
					"flex h-48 sm:h-60 items-center justify-between gap-2 sm:gap-4 rounded-lg",
					SURFACE_INNER,
					"bg-gray-50",
				)}
			>
				<Rule />
				{RAID_KINDS.map(({ kind, label, wash }, index) => {
					const { Icon, tint } = KIND[kind];
					return (
						<Fragment key={kind}>
							{index > 0 && <Rule className="self-stretch bg-gray-500/10" />}
							<div className="flex w-16 shrink-0 flex-col items-center gap-4">
								<Disc wash={wash}>
									<Icon size={24} className={tint} />
								</Disc>
								<span className="font-mono text-[10px] sm:text-xs uppercase whitespace-nowrap text-gray-400">
									{label}
								</span>
							</div>
						</Fragment>
					);
				})}
				<Rule />
			</div>
		</div>
	);
}
