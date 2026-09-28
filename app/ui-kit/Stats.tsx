import { cn } from "./cn";
import { Surface } from "./Surface";

interface Stat {
	value: string;
	label: string;
	trend?: number[];
}

function Trend({ values }: { values: number[] }) {
	const max = Math.max(...values);

	return (
		<span className="flex h-6 items-end gap-0.5" aria-hidden="true">
			{values.map((value, index) => (
				<span
					key={index}
					style={{ height: `${Math.max(12, (value / max) * 100)}%` }}
					className={cn(
						"w-1.5 rounded-[1px]",
						index === values.length - 1 ? "bg-gray-600" : "bg-gray-300",
					)}
				/>
			))}
		</span>
	);
}

export function Stats({ stats, caption }: { stats: Stat[]; caption?: string }) {
	return (
		<figure className="my-8">
			<Surface inner={{ className: "grid grid-cols-1 sm:grid-cols-3" }}>
				{stats.map((stat) => (
					<div
						key={stat.label}
						className="flex flex-col gap-2 md:gap-6 border-gray-200/50 p-4 not-first:border-t sm:not-first:border-t-0 sm:not-first:border-l"
					>
						<div className="flex items-center justify-between gap-3">
							<span className="text-3xl text-gray-800 tabular-nums">
								{stat.value}
							</span>
							{stat.trend && <Trend values={stat.trend} />}
						</div>
						<span className="text-xs font-[450] text-gray-500">{stat.label}</span>
					</div>
				))}
			</Surface>
			{caption && (
				<figcaption className="mt-3 text-center text-[10px] font-[450] text-gray-500">{caption}</figcaption>
			)}
		</figure>
	);
}
