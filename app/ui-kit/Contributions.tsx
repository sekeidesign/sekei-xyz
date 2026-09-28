import { Collapsible } from "@base-ui/react/collapsible";
import { cn } from "./cn";
import { ChevronDownIcon } from "./icons/ChevronDownIcon";
import { PullRequestIcon } from "./icons/PullRequestIcon";
import { Surface } from "./Surface";

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
	details,
	children,
}: {
	prs: number;
	added: number;
	removed: number;
	details?: { label: string; value: React.ReactNode }[];
	children?: React.ReactNode;
}) {
	const hasPanel = Boolean(children || details?.length);

	return (
		<Surface className="post-lead mt-6 mb-10 w-full" inner={{ className: "flex flex-col" }}>
			<Collapsible.Root defaultOpen>
				<Collapsible.Trigger
					disabled={!hasPanel}
					className="group flex w-full cursor-pointer flex-wrap items-center justify-between gap-x-3 gap-y-2 p-3 text-left disabled:cursor-default"
				>
					<div className="flex items-center gap-2">

					{hasPanel && (
						<ChevronDownIcon
						size={14}
						className="text-gray-400 group-data-panel-open:rotate-180"
						/>
					)}
					<span className="font-mono text-xs text-gray-500">My work</span>
					</div>
					<span className="flex items-center gap-3">
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
					</span>
				</Collapsible.Trigger>
				{hasPanel && (
					<Collapsible.Panel>
						<span className="block h-px w-full bg-gray-200/50" />
						{/* The note comes through as MDX prose, which carries its own
						    bottom margin — the panel supplies the spacing here. */}
						{children && <div className="p-3 [&_p]:mb-0">{children}</div>}
						{details && details.length > 0 && (
							<dl
								className={cn(
									"gap-y-3 p-3",
									children && "pt-0",
								)}
							>
								{details.map((detail) => (
									<div key={detail.label} className="not-last:mb-3">
										<dt className=" text-gray-400 font-medium sm:pt-0.5">
											{detail.label}
										</dt>
										<dd className=" text-gray-700">
											{detail.value}
										</dd>
									</div>
								))}
							</dl>
						)}
					</Collapsible.Panel>
				)}
			</Collapsible.Root>
		</Surface>
	);
}
