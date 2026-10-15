import { getContributions } from "@/lib/github";
import { cn } from "./cn";
import { TooltipTrigger } from "./Tooltip";

const COUNT = new Intl.NumberFormat("en-US");

const DATE = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	timeZone: "UTC",
});

const weekday = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay();

const getContributionColor = (contributionCount: number) => {
	if (contributionCount === 0) return "bg-gray-200";
	if (contributionCount < 8) return "bg-gray-400";
	if (contributionCount < 12) return "bg-gray-500";
	return "bg-gray-600";
};

export async function ContributionGraph() {
	const weeks = await getContributions("sekeidesign");
	if (weeks.length === 0) return null;

	const total = weeks
		.flatMap((week) => week.contributionDays)
		.reduce((sum, day) => sum + day.contributionCount, 0);

	return (
		<div className="panel p-3">
			<div
				role="img"
				aria-label={`${COUNT.format(total)} GitHub contributions in the last year`}
				className="grid grid-flow-col gap-0.5 w-full"
			>
				{weeks.map((week) => (
					<div
						key={week.contributionDays[0].date}
						className="grid grid-rows-7 gap-0.5"
					>
						{week.contributionDays.map((day, i) => (
							<TooltipTrigger
								key={day.date}
								payload={`${COUNT.format(day.contributionCount)} ${
									day.contributionCount === 1 ? "contribution" : "contributions"
								} on ${DATE.format(new Date(`${day.date}T00:00:00Z`))}`}
								render={<div />}
								style={
									i === 0 ? { gridRowStart: weekday(day.date) + 1 } : undefined
								}
								className={cn(
									"w-full aspect-square rounded-full",
									getContributionColor(day.contributionCount),
								)}
							/>
						))}
					</div>
				))}
			</div>
		</div>
	);
}
