import { Footer } from "./Footer";
import { ProfileCard } from "./ui-kit/ProfileCard";
import {
	ClaudeMark,
	FigmaMark,
	MotionMark,
	PaperMark,
	SwiftMark,
	TailwindMark,
} from "./ui-kit/icons/ToolMarks";
import { TimelineTabs } from "./ui-kit/TimelineTabs";
import { getTimeline, type EntryKind } from "@/lib/timeline";
import { FILTER_KINDS, FILTER_ORDER } from "@/lib/timeline-filters";

export const Sidebar = () => {
	const timeline = getTimeline();

	const counts: Partial<Record<EntryKind, number>> = {};
	for (const entry of timeline) {
		counts[entry.kind] = (counts[entry.kind] ?? 0) + 1;
	}

	// A tab that matches nothing is a dead end, so only offer kinds present.
	const available = FILTER_ORDER.filter(
		(slug) => (counts[FILTER_KINDS[slug]] ?? 0) > 0,
	);

	return (
		<aside
			aria-label="Profile and filters"
			className="w-full md:max-w-2xs xl:max-w-xs md:sticky md:top-px md:h-[calc(100vh-2px)] md:shrink-0 flex flex-col gap-px"
		>
			<div className="panel h-8 flex items-center justify-around text-gray-300 [&>svg]:shrink-0 [&>svg]:opacity-75">
				<span className="sr-only">
					Tools I use: Figma, Claude, Paper, Motion, Tailwind CSS, Swift
				</span>
				<FigmaMark />
				<ClaudeMark />
				<PaperMark />
				<MotionMark />
				<TailwindMark />
				<SwiftMark />
			</div>

			<ProfileCard />

			<TimelineTabs available={available} counts={counts} />

			<Footer className="md:grid hidden" />
		</aside>
	);
};
