import type { CSSProperties } from "react";
import { getContributions } from "@/lib/github";
import { cn } from "./cn";
import { TooltipTrigger } from "./Tooltip";

const WEEKS = 26;

const COUNT = new Intl.NumberFormat("en-US");

const DATE = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	timeZone: "UTC",
});

const WEEKDAY = new Intl.DateTimeFormat("en-US", {
	weekday: "short",
	timeZone: "UTC",
});

const weekday = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay();

const getContributionColor = (contributionCount: number) => {
	if (contributionCount === 0) return "bg-gray-200";
	if (contributionCount < 8) return "bg-gray-400";
	if (contributionCount < 12) return "bg-gray-500";
	return "bg-gray-600";
};

// The cells share the width, but a dot sized to its cell lands on a sub-pixel
// size and each one rasterises differently, so the dot is rounded to a whole
// pixel and centred in its cell.
const GRID = {
	"--dot": `round(down, calc(100cqw / ${WEEKS} * 0.6), 1px)`,
	"--hit": `calc((100cqw / ${WEEKS} - var(--dot)) / 2)`,
	gridTemplateColumns: `repeat(${WEEKS}, 1fr)`,
} as CSSProperties;

export async function ContributionGraph({ className }: { className?: string }) {
	const weeks = (await getContributions("sekeidesign")).slice(-WEEKS);
	if (weeks.length === 0) return null;

	const total = weeks
		.flatMap((week) => week.contributionDays)
		.reduce((sum, day) => sum + day.contributionCount, 0);
	const contributions = `${COUNT.format(total)} ${total === 1 ? "contribution" : "contributions"}`;

	return (
		<div className={cn("panel p-3 @container", className)}>
			<div className="flex flex-col gap-2">
				<div className="flex justify-between text-xs font-[500]">
					<p className="text-gray-600">{contributions}</p>
					<p className="text-gray-400">Last 6 months</p>
				</div>
				<div
					role="img"
					aria-label={`${contributions} on GitHub in the last 6 months`}
					style={GRID}
					className="grid"
				>
					{weeks.map((week) => (
						<div
							key={week.contributionDays[0].date}
							className="grid grid-rows-7 aspect-[1/7]"
						>
							{week.contributionDays.map((day, i) => (
								<TooltipTrigger
									key={day.date}
									payload={<DayLabel {...day} />}
									render={<div />}
									style={
										i === 0 ? { gridRowStart: weekday(day.date) + 1 } : undefined
									}
									className={cn(
										"relative size-(--dot) place-self-center rounded-[2px] before:absolute before:-inset-(--hit)",
										getContributionColor(day.contributionCount),
									)}
								/>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

function DayLabel({
	date,
	contributionCount,
}: {
	date: string;
	contributionCount: number;
}) {
	const day = new Date(`${date}T00:00:00Z`);
	return (
		<span className="flex flex-col pt-0.5">
			<span className="text-xs">
				{DATE.format(day)}{" "}
				<span className="text-gray-400">• {WEEKDAY.format(day)}</span>
			</span>
			<span>
				{COUNT.format(contributionCount)}{" "}
				{contributionCount === 1 ? "contribution" : "contributions"}
			</span>
		</span>
	);
}
