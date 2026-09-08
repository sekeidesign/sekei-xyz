const TABS = ["Risks", "Action Items", "Issues", "Decisions"];

/**
 * The same three risks the reviewed list carries, in the shape the old view
 * gave them: a heading, two lines of metadata, and a paragraph of the agent's
 * own prose, one entity type per tab.
 */
const ITEMS = [
	{
		title: "Recorder can't join authenticated meetings",
		priority: "high",
		dot: "bg-red-500",
		owner: "Programme lead",
		body: "The recorder is turned away from any session that requires a tenant sign-in, so workshops run on the customer's own account produce no transcript and nothing reaches the log until someone writes it up by hand.",
	},
	{
		title: "Integration approval adds two weeks to the plan",
		priority: "medium",
		dot: "bg-amber-500",
		owner: "Integration lead",
		body: "Connecting the ticketing system needs a security review before it can be switched on, and the review window sits on the critical path for the cutover rather than beside it.",
	},
	{
		title: "Data migration sign-off still pending finance review",
		priority: "medium",
		dot: "bg-amber-500",
		owner: "Finance workstream",
		body: "Finance have asked for a second pass over the opening balances before they sign off the migration, which holds the dress rehearsal and every task that depends on it.",
	},
];

export function OldRaidView() {
	return (
		<div className="flex flex-col">
			<div className="flex items-center justify-between gap-4 overflow-hidden">
				{TABS.map((tab) => {
					const active = tab === "Risks";
					return (
						<span
							key={tab}
							className={
								active
									? "border-b-2 border-blue-400 px-4 pb-2 text-sm font-[550] whitespace-nowrap text-gray-900"
									: "px-4 pb-2 text-sm whitespace-nowrap text-gray-500"
							}
						>
							{tab}
						</span>
					);
				})}
			</div>
			<div className="flex flex-col gap-9 pt-8">
				{ITEMS.map(({ title, priority, dot, owner, body }) => (
					<div key={title}>
						<div className="flex items-center gap-2">
							<h4 className="text-sm font-[600] text-gray-900">{title}</h4>
							<span className={`size-2 shrink-0 rounded-full ${dot}`} />
							<span className="text-sm text-gray-500 underline decoration-gray-300 underline-offset-2">
								Phase 2 rollout
							</span>
						</div>
						<p className="mt-2 text-sm text-gray-400">
							Risk, Priority: {priority}
						</p>
						<p className="mt-1.5 text-sm text-gray-400">Owner: {owner}</p>
						<p className="mt-3 text-sm leading-relaxed text-gray-900">{body}</p>
					</div>
				))}
			</div>
		</div>
	);
}
