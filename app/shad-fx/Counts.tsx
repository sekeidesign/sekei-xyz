import { cn } from "@ui-kit/cn";
import { FOCUS_RING } from "@ui-kit/focus";
import { EFFECTS, SKILL_LIST } from "./content";

const COUNTS = [
	{ count: EFFECTS.length, label: "effects", href: "#effects" },
	{ count: 1, label: "renderer", href: "#usage" },
	{ count: SKILL_LIST.length, label: "skills", href: "#agent-skills" },
];

export function Counts() {
	return (
		<div className="flex divide-x divide-gray-500/10">
			{COUNTS.map(({ count, label, href }) => (
				<a
					key={label}
					href={href}
					className={cn(
						"flex flex-1 items-baseline justify-center gap-1 px-3 py-2.5 hover:bg-gray-50 first:rounded-l-lg last:rounded-r-lg",
						FOCUS_RING,
					)}
				>
					<span className="text-[13px] font-[550] text-gray-900">{count}</span>
					<span className="text-[13px] font-[450] text-gray-500">{label}</span>
				</a>
			))}
		</div>
	);
}
