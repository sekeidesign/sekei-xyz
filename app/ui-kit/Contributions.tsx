import { cn } from "./cn";
import { PullRequestIcon } from "./icons/PullRequestIcon";
import { SURFACE_INNER, SURFACE_OUTER } from "./post/surface";

const COUNT = new Intl.NumberFormat("en-US");

const CELLS = 9;

/**
 * The diff's shape, in the lattice the RAID cover draws with: nine cells split
 * green to red by how much of the change was added. One cell is held back for
 * each side, so a lopsided diff still reads as a diff.
 */
function Split({ added, removed }: { added: number; removed: number }) {
	const total = added + removed;
	const green =
		total === 0
			? 0
			: Math.min(CELLS - 1, Math.max(1, Math.round((added / total) * CELLS)));

	return (
		<span className="grid shrink-0 grid-cols-3 gap-0.5" aria-hidden="true">
			{Array.from({ length: CELLS }, (_, index) => (
				<span
					key={index}
					className={cn(
						"size-[3px] rounded-[1px]",
						total === 0
							? "bg-gray-300"
							: index < green
								? "bg-green-600"
								: "bg-red-600",
					)}
				/>
			))}
		</span>
	);
}

export function Contributions({
	prs,
	added,
	removed,
	children,
}: {
	prs: number;
	added: number;
	removed: number;
	children?: React.ReactNode;
}) {
	return (
		<div className={cn("my-6 w-full rounded-xl", SURFACE_OUTER)}>
			<div className={cn("flex flex-col rounded-lg", SURFACE_INNER)}>
				<div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 p-3">
					<span className="font-mono text-xs text-gray-400">My work</span>
					<div className="flex items-center gap-3">
						<span className="flex items-center gap-1.5 text-xs font-[500] text-gray-600">
							<span className="tabular-nums">{COUNT.format(prs)}</span>
							{prs === 1 ? "PR" : "PRs"}
							<PullRequestIcon className="size-4 text-gray-400" />
						</span>
						<span className="h-4 w-px bg-gray-200" />
						<span className="flex items-center gap-2 font-mono text-xs font-[450] tabular-nums">
							<span className="text-green-700">+{COUNT.format(added)}</span>
							<span className="text-red-600">−{COUNT.format(removed)}</span>
							<Split added={added} removed={removed} />
						</span>
					</div>
				</div>
				{children && (
					<>
						<span className="h-px w-full bg-gray-200/50" />
						{/* The note comes through as MDX prose, which carries its own
						    bottom margin — the panel supplies the spacing here. */}
						<div className="p-3 [&_p]:mb-0">{children}</div>
					</>
				)}
			</div>
		</div>
	);
}
