import type { ComponentType } from "react";
import { ActionIcon } from "../icons/ActionIcon";
import { DecisionIcon } from "../icons/DecisionIcon";
import { IssueIcon } from "../icons/IssueIcon";
import { RiskIcon } from "../icons/RiskIcon";

/**
 * The log's content and per-kind marks, shared by the drawn cover and the
 * Satori share card. Satori resolves no custom properties, so each kind carries
 * its tint twice: the utility for the DOM, the token's own value for the card.
 */

interface Kind {
	Icon: ComponentType<{ size?: number; className?: string }>;
	tint: string;
	hex: string;
}

export const KIND: Record<string, Kind> = {
	risk: { Icon: RiskIcon, tint: "text-orange-600", hex: "#f05100" },
	action: { Icon: ActionIcon, tint: "text-amber-400", hex: "#fcbb00" },
	issue: { Icon: IssueIcon, tint: "text-purple-500", hex: "#ac4bff" },
	decision: { Icon: DecisionIcon, tint: "text-blue-500", hex: "#3080ff" },
};

export interface RaidRow {
	id: string;
	title: string;
	kind: keyof typeof KIND;
	date?: string;
	impact?: "Critical" | "High" | "Medium" | "Low";
	pending?: boolean;
}

export const ROWS: RaidRow[] = [
	{
		id: "RI-0148",
		title: "Extracting risk from meeting notes",
		kind: "risk",
		pending: true,
	},
	{
		id: "DE-0034",
		title: "Roll out in phases, region by region",
		kind: "decision",
		date: "Aug 28",
		impact: "Medium",
	},
	{
		id: "AI-0087",
		title: "Confirm the data migration owner",
		kind: "action",
		date: "Aug 26",
		impact: "High",
	},
	{
		id: "IS-0056",
		title: "Staging data is out of sync with prod",
		kind: "issue",
		date: "Aug 21",
		impact: "Critical",
	},
	{
		id: "RI-0143",
		title: "Key approver is away for all of Q3",
		kind: "risk",
		date: "Aug 19",
		impact: "High",
	},
	{
		id: "DE-0035",
		title: "Standardize on one report format",
		kind: "decision",
		date: "Aug 14",
		impact: "Low",
	},
	{
		id: "AI-0088",
		title: "Draft the rollback plan for launch",
		kind: "action",
		date: "Aug 11",
		impact: "Medium",
	},
	{
		id: "RI-0144",
		title: "Scope creep at the intake stage",
		kind: "risk",
		date: "Aug 07",
		impact: "Low",
	},
];
