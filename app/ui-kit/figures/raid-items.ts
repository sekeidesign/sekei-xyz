import type { ComponentType } from "react";
import { ActionIcon } from "../icons/ActionIcon";
import { DecisionIcon } from "../icons/DecisionIcon";
import { IssueIcon } from "../icons/IssueIcon";
import { RiskIcon } from "../icons/RiskIcon";

export type Badge = "New" | "Update";

export const BADGE: Record<Badge, string> = {
	New: "bg-orange-500/15 text-orange-700",
	Update: "bg-gray-500/10 text-gray-600",
};

export interface Item {
	id: string;
	title: string;
	badge: Badge;
	who: string;
	tint: string;
	impact: number;
	likelihood: number;
	started?: boolean;
	status: string;
	updated: string;
}

/** Owners are the roles they hold on the programme, never the people. */
export const OWNER: Record<string, string> = {
	D: "Programme lead",
	N: "Integration lead",
	F: "Finance workstream",
	A: "Data migration",
	E: "ERP consultant",
	M: "Change manager",
	R: "Reporting lead",
};

export const SECTIONS: { heading: string; items: Item[] }[] = [
	{
		heading: "Risks",
		items: [
			{
				id: "RI-0142",
				title: "Recorder can't join authenticated meetings",
				badge: "New",
				who: "E",
				tint: "bg-blue-500",
				impact: 4,
				likelihood: 2,
				status: "Open",
				updated: "Sept 5, 2026 at 11:49AM",
				started: true,
			},
			{
				id: "RI-0143",
				title: "Integration approval adds two weeks to the plan",
				badge: "New",
				who: "M",
				tint: "bg-emerald-600",
				impact: 3,
				likelihood: 3,
				status: "Mitigating",
				updated: "Sept 6, 2026 at 1:30PM",
				started: true,
			},
			{
				id: "RI-0144",
				title: "Data migration sign-off still pending finance review",
				badge: "Update",
				who: "R",
				tint: "bg-violet-500",
				impact: 2,
				likelihood: 2,
				status: "Open",
				updated: "Sept 7, 2026 at 9:00AM",
				started: true,
			},
			{
				id: "RI-0145",
				title: "Test environment refresh is a week behind",
				badge: "Update",
				who: "A",
				tint: "bg-amber-600",
				impact: 3,
				likelihood: 3,
				started: true,
				status: "Monitoring",
				updated: "Sept 12, 2026 at 9:20AM",
			},
			{
				id: "RI-0146",
				title: "Second wave of users still without licences",
				badge: "New",
				who: "M",
				tint: "bg-emerald-600",
				impact: 2,
				likelihood: 3,
				started: true,
				status: "Mitigated",
				updated: "Sept 11, 2026 at 4:05PM",
			},
			{
				id: "RI-0147",
				title: "Cutover window overlaps the finance close",
				badge: "New",
				who: "F",
				tint: "bg-violet-500",
				impact: 4,
				likelihood: 2,
				started: true,
				status: "Open",
				updated: "Sept 10, 2026 at 8:40AM",
			},
			{
				id: "RI-0148",
				title: "Interface spec for payroll is still in draft",
				badge: "Update",
				who: "R",
				tint: "bg-violet-500",
				impact: 2,
				likelihood: 2,
				status: "Closed",
				updated: "Sept 9, 2026 at 2:55PM",
			},
		],
	},
	{
		heading: "Action Items",
		items: [
			{
				id: "AI-0087",
				title: "Confirm who owns the employee master record",
				badge: "New",
				who: "D",
				tint: "bg-blue-500",
				impact: 3,
				likelihood: 2,
				status: "Open",
				updated: "Sept 8, 2026 at 3:15PM",
			},
			{
				id: "AI-0088",
				title: "Share the localisation gap list with the workstream",
				badge: "Update",
				who: "N",
				tint: "bg-rose-500",
				impact: 2,
				likelihood: 1,
				status: "Mitigating",
				updated: "Sept 9, 2026 at 10:45AM",
			},
			{
				id: "AI-0089",
				title: "Submit the ticket to activate scope item J78",
				badge: "New",
				who: "A",
				tint: "bg-amber-600",
				impact: 3,
				likelihood: 3,
				status: "Open",
				updated: "Sept 10, 2026 at 2:00PM",
			},
			{
				id: "AI-0090",
				title: "Create users and replicate roles in the sandbox",
				badge: "Update",
				who: "N",
				tint: "bg-rose-500",
				impact: 2,
				likelihood: 2,
				status: "Monitoring",
				updated: "Sept 11, 2026 at 4:30PM",
			},
			{
				id: "AI-0091",
				title: "Send starter system access links to the new team",
				badge: "New",
				who: "M",
				tint: "bg-emerald-600",
				impact: 1,
				likelihood: 1,
				status: "Mitigated",
				updated: "Sept 12, 2026 at 11:49AM",
			},
			{
				id: "AI-0092",
				title: "Book the enablement session for the finance leads",
				badge: "New",
				who: "F",
				tint: "bg-violet-500",
				impact: 2,
				likelihood: 3,
				status: "Open",
				updated: "Sept 14, 2026 at 1:30PM",
			},
			{
				id: "AI-0093",
				title: "Draft the rollback plan before the next cycle",
				badge: "Update",
				who: "D",
				tint: "bg-blue-500",
				impact: 4,
				likelihood: 2,
				status: "Closed",
				updated: "Sept 15, 2026 at 9:00AM",
			},
		],
	},
	{
		heading: "Issues",
		items: [
			{
				id: "IS-0056",
				title: "Staging data is out of sync with production",
				badge: "New",
				who: "R",
				tint: "bg-violet-500",
				impact: 4,
				likelihood: 3,
				status: "Open",
				updated: "Sept 16, 2026 at 3:15PM",
				started: true,
			},
			{
				id: "IS-0057",
				title: "Report format differs across workstreams",
				badge: "Update",
				who: "A",
				tint: "bg-amber-600",
				impact: 2,
				likelihood: 2,
				status: "Mitigating",
				updated: "Sept 17, 2026 at 10:45AM",
				started: true,
			},
			{
				id: "IS-0058",
				title: "Sandbox refresh wiped the test users",
				badge: "New",
				who: "N",
				tint: "bg-rose-500",
				impact: 3,
				likelihood: 1,
				status: "Open",
				updated: "Sept 18, 2026 at 2:00PM",
				started: true,
			},
		],
	},
	{
		heading: "Decisions",
		items: [
			{
				id: "DE-0034",
				title: "Roll out in phases, region by region",
				badge: "New",
				who: "E",
				tint: "bg-blue-500",
				impact: 3,
				likelihood: 2,
				status: "Monitoring",
				updated: "Sept 19, 2026 at 4:30PM",
				started: true,
			},
			{
				id: "DE-0035",
				title: "Standardise on one report format",
				badge: "Update",
				who: "F",
				tint: "bg-violet-500",
				impact: 2,
				likelihood: 2,
				status: "Mitigated",
				updated: "Sept 21, 2026 at 11:49AM",
				started: true,
			},
			{
				id: "DE-0036",
				title: "Keep the legacy interface until the Q4 cutover",
				badge: "Update",
				who: "M",
				tint: "bg-emerald-600",
				impact: 3,
				likelihood: 3,
				status: "Open",
				updated: "Sept 22, 2026 at 1:30PM",
				started: true,
			},
		],
	},
];

/** Which of the four types a section holds, for the icons a row draws with. */
export const SECTION_KIND: Record<string, string> = {
	Risks: "risk",
	"Action Items": "action",
	Issues: "issue",
	Decisions: "decision",
};

/** The section icons the summary panel heads its groups with. */
export const SECTION_ICON: Record<
	string,
	ComponentType<{ size?: number; className?: string }>
> = {
	Risks: RiskIcon,
	"Action Items": ActionIcon,
	Issues: IssueIcon,
	Decisions: DecisionIcon,
};
