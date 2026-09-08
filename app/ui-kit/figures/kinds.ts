/** The four RAID types, in the order the case study introduces them. */
export const RAID_KINDS = [
	{ kind: "risk", label: "Risks", wash: "bg-red-100 shadow-orange-500/20" },
	{
		kind: "action",
		label: "Action items",
		wash: "bg-amber-100 shadow-amber-500/20",
	},
	{ kind: "issue", label: "Issues", wash: "bg-purple-100 shadow-purple-500/20" },
	{
		kind: "decision",
		label: "Decisions",
		wash: "bg-blue-100 shadow-blue-500/20",
	},
] as const;
