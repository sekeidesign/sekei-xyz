"use client";

import { m, type Variants } from "motion/react";
import { Fragment, type ReactNode } from "react";
import { Quote } from "@ui-kit/Quote";
import { Stats } from "@ui-kit/Stats";
import { HistoryDrawer } from "@ui-kit/figures/HistoryDrawer";
import { NeedsReview } from "@ui-kit/figures/NeedsReview";
import { TrackPress } from "@ui-kit/figures/TrackPress";
import { Asset } from "./Asset";

export const SECTIONS = [
	{ name: "Opening", minutes: 1 },
	{ name: "RAID log", minutes: 22 },
	{ name: "Unified search", minutes: 18 },
	{ name: "Q&A", minutes: 15 },
] as const;

export type SectionName = (typeof SECTIONS)[number]["name"];

export interface Slide {
	section: SectionName;
	label: string;
	notes: string[];
	body: ReactNode;
}

const SPRING = { type: "spring", stiffness: 220, damping: 28 } as const;

export const stagger = (gap = 0.08, delay = 0): Variants => ({
	hidden: {},
	show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

export const rise: Variants = {
	hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
	show: { opacity: 1, y: 0, filter: "blur(0px)", transition: SPRING },
};

function Reveal({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<m.div variants={rise} className={className}>
			{children}
		</m.div>
	);
}

/** Splits a plain-string heading so its words land one after another. */
function Words({ children }: { children: ReactNode }) {
	if (typeof children !== "string") {
		return (
			<m.span variants={rise} className="inline-block">
				{children}
			</m.span>
		);
	}
	return children.split(" ").map((word, index) => (
		<Fragment key={index}>
			<m.span variants={rise} className="inline-block">
				{word}
			</m.span>{" "}
		</Fragment>
	));
}

function Heading({ children }: { children: ReactNode }) {
	return (
		<m.h2
			variants={stagger(0.035)}
			className="text-[44px] leading-[1.1] font-[550] tracking-tight text-balance text-gray-900"
		>
			<Words>{children}</Words>
		</m.h2>
	);
}

function Display({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<m.h1
			variants={stagger(0.045)}
			className={`max-w-[900px] text-[68px] leading-[1.02] font-[550] tracking-tight text-balance text-gray-900 ${className ?? ""}`}
		>
			<Words>{children}</Words>
		</m.h1>
	);
}

function Lines({ items }: { items: ReactNode[] }) {
	return (
		<m.ul
			variants={stagger(0.09)}
			className="flex flex-col gap-3 text-2xl leading-snug text-pretty text-gray-600"
		>
			{items.map((item, index) => (
				<m.li key={index} variants={rise}>
					{item}
				</m.li>
			))}
		</m.ul>
	);
}

function Cards({ children, className }: { children: ReactNode; className: string }) {
	return (
		<m.ol variants={stagger(0.08)} className={className}>
			{children}
		</m.ol>
	);
}

const CARD = "flex flex-col rounded-xl bg-white p-6 ring-1 ring-gray-500/10";

function Title({
	title,
	sub,
	meta,
}: {
	title: string;
	sub?: ReactNode;
	meta?: { label: string; value: ReactNode }[];
}) {
	return (
		<div className="flex h-full flex-col justify-between p-20">
			<div className="flex flex-col gap-5">
				<Display>{title}</Display>
				{sub && (
					<m.p variants={rise} className="max-w-[760px] text-2xl text-pretty text-gray-500">
						{sub}
					</m.p>
				)}
			</div>
			<m.dl variants={stagger(0.08)} className="grid grid-cols-3 gap-8">
				{meta?.map(({ label, value }) => (
					<m.div key={label} variants={rise} className="flex flex-col gap-1">
						<dt className="text-sm font-[500] text-gray-400">{label}</dt>
						<dd className="text-base text-pretty text-gray-700">{value}</dd>
					</m.div>
				))}
			</m.dl>
		</div>
	);
}

function Statement({ heading, children }: { heading: string; children?: ReactNode }) {
	return (
		<div className="flex h-full flex-col justify-between gap-10 p-20">
			<Heading>{heading}</Heading>
			{children}
		</div>
	);
}

/**
 * Text on the left, a figure on the right. The case-study figures bleed past
 * the post column with negative margins, which the slot zeroes.
 */
function Split({
	heading,
	children,
	figure,
}: {
	heading: string;
	children?: ReactNode;
	figure: ReactNode;
}) {
	return (
		<div className="grid h-full grid-cols-[1fr_768px] items-center gap-12 p-12 pl-20">
			<div className="flex h-full flex-col justify-between gap-8 py-8">
				<Heading>{heading}</Heading>
				{children}
			</div>
			<Reveal className="overflow-hidden rounded-xl [&>*]:m-0! [&>*]:mx-0! [&>*]:my-0!">
				{figure}
			</Reveal>
		</div>
	);
}

export const SLIDES: Slide[] = [
	{
		section: "Opening",
		label: "Two Tato projects",
		body: (
			<div className="flex h-full flex-col justify-between p-20">
				<Display>How should people work alongside an agent?</Display>
				<Cards className="grid grid-cols-2 gap-6">
					{[
						["01", "RAID log with a human in the loop", "Shipped"],
						["02", "Unified search & chat", "In rollout behind a flag"],
					].map(([n, name, status]) => (
						<m.li key={n} variants={rise} className={`${CARD} gap-2`}>
							<span className="font-pixel text-sm text-gray-400">{n}</span>
							<span className="text-2xl font-[550] text-gray-900">{name}</span>
							<span className="text-base text-gray-500">{status}</span>
						</m.li>
					))}
				</Cards>
			</div>
		),
		notes: [
			"Since we've covered my background, straight into the work.",
			"Two Tato projects. The RAID log, which shipped, and unified search and chat, which is in rollout behind a flag.",
			"Both tackle the same question: how should people work alongside an agent? I'll show both live in the product.",
		],
	},

	{
		section: "RAID log",
		label: "Title",
		body: (
			<Title
				title="A RAID log with a human in the loop"
				sub="End-to-end ownership: research, the model, design, and the front-end."
				meta={[
					{ label: "Team", value: "Me on design and front-end (16 PRs). Alex Hermann, backend. Benjamin Ryan, customer success." },
					{ label: "Timeline", value: "July to September 2026" },
					{ label: "Role", value: "No PM on the project, so I was acting PM" },
				]}
			/>
		),
		notes: [
			"Three of us. I owned design and front-end, 16 PRs. Alex Hermann on backend, Benjamin Ryan on customer success.",
			"No PM, so I was acting PM: scoping, research, and the contract with engineering.",
			"How we learned, in one breath: domain research into customers' own logs, SAP and RAID best practice; partner feedback through Benjamin and customer calls; then ship, observe, iterate. Seed stage, around nine customers.",
		],
	},
	{
		section: "RAID log",
		label: "Problem",
		body: (
			<Statement heading="RAID updates happen in meetings, and never reach the log">
				<Lines
					items={[
						"Programs run three to five years",
						"The log lives in spreadsheets and SharePoint",
						"One PM keeps it, so everyone waits on them",
					]}
				/>
			</Statement>
		),
		notes: [
			"RAID: Risks, Action items, Issues, Decisions. On a multi-year transformation program it's the record of what could knock the project off its critical path.",
			"In practice it's a spreadsheet or a SharePoint list. One PM maintains it, so the team waits on them for the current picture.",
			"And the updates happen in meetings. Someone raises a risk, someone agrees an action, and it never makes it into the log.",
		],
	},
	{
		section: "RAID log",
		label: "The bet",
		body: (
			<Statement heading="Tato is already in the meeting. Will PMs trust what it writes?">
				<Cards className="grid grid-cols-3 gap-6">
					{[
						["Human in the loop", "The agent proposes, people decide"],
						["Less noise", "Show the outcome, not the machinery"],
						["A ledger", "Every change, and why it happened"],
					].map(([title, body]) => (
						<m.li key={title} variants={rise} className={`${CARD} gap-2`}>
							<span className="text-2xl font-[550] text-gray-900">{title}</span>
							<span className="text-lg text-pretty text-gray-500">{body}</span>
						</m.li>
					))}
				</Cards>
			</Statement>
		),
		notes: [
			"Tato already joins the meetings, so extracting RAID items is the easy part. The hard part is getting a PM to trust a log an agent writes to.",
			"Three things made that work, and they're the next three slides: a human in the loop, less noise, and a ledger.",
			"Underneath all of it is the model. As acting PM I took the research to Alex and we defined what a RAID item is: fields, relationships, how status moves, and how a realised risk is promoted to an issue. That became our contract, and every workflow sits on it.",
		],
	},
	{
		section: "RAID log",
		label: "Less noise",
		body: (
			<Split heading="v1 showed its work, and buried the user" figure={<NeedsReview />}>
				<Lines items={["60+ snippets for one meeting", "Hide the machinery, then cut the text"]} />
			</Split>
		),
		notes: [
			"Toggle Before / After under the figure.",
			"v1 exposed the agent's reasoning. One meeting could produce upwards of sixty snippets for a handful of real items.",
			"LLMs produce volume, and volume creates cognitive load.",
			"Hiding the machinery cut most of the noise on its own. Then less text, icons for type and source, avatars for owners, and a clear hierarchy, so the list can be scanned.",
		],
	},
	{
		section: "RAID log",
		label: "Human in the loop",
		body: (
			<Split heading="People always get the last word" figure={<TrackPress />}>
				<Lines items={["Track or dismiss, on every item", "Users found Tato smarter, and easier to control"]} />
			</Split>
		),
		notes: [
			"Two actions on every item, always in reach.",
			"Dismiss tells the system the extraction wasn't useful. Track tells the agent to pay attention to it from now on. Both feed status downstream.",
			"Track gets a small, energetic press, because it's the action we want to feel rewarding.",
			"Early feedback: Tato felt smarter and more nuanced, and easier to control. Perceived quality matters as much as measured quality when people work with an LLM.",
		],
	},
	{
		section: "RAID log",
		label: "Ledger",
		body: (
			<Split heading="Trust needs a paper trail" figure={<HistoryDrawer />}>
				<Lines items={["Every change links to its cause", "Person or agent, with the reasoning"]} />
			</Split>
		),
		notes: [
			"History used to be a flat list of versions. It showed what changed, not why. For RAID, the why is the point: the log is a ledger of how the project evolved. And with an agent writing to it, people need to see what it changed and why, so they can correct it.",
			"Alex and I first tried to fix it in the UI. The workarounds kept breaking, because the data didn't hold the answer.",
			"So we fixed the data instead: each version links to the activity that caused it, records whether a person or the agent made it, and carries the reasoning.",
			"I explored several places for history to live and kept the drawer: the most room, without leaving your workflow.",
		],
	},
	{
		section: "RAID log",
		label: "Live demo: RAID",
		body: (
			<Statement heading="In the product">
				<Lines
					items={[
						"Review a meeting's items",
						"Track, dismiss, and open the history",
						"The control centre",
					]}
				/>
			</Statement>
		),
		notes: [
			"Switch to Tato.",
			"Meeting summary: two columns, RAID first-class, meeting context in view. Review the extracted items.",
			"Track one, dismiss one. Open the drawer and walk the history: what caused each change, person vs agent, reasoning.",
			"Control centre: the table scrolls, not the page, so header and footer stay. Keyboard through the rows. Change impact or likelihood to show the indicators spring between values.",
			"Tie-in: dense operational tooling people live in all day.",
		],
	},
	{
		section: "RAID log",
		label: "Impact",
		body: (
			<Statement heading="Small numbers, strong signals">
				<m.div variants={stagger(0.12)} className="grid grid-cols-[1fr_1.3fr] items-center gap-12 [&_figure]:my-0!">
					<Reveal>
						<Quote cite="PM on an $8M ERP implementation">
							“Once I saw I could trust it, I got rid of my SharePoint lists and
							centralised everything there.”
						</Quote>
					</Reveal>
					<Reveal>
						<Stats
							caption="First four weeks of tracking, September 2026, internal accounts excluded."
							stats={[
								{ value: "5×", label: "Items logged through chat, week over week", trend: [320, 341, 813, 1669] },
								{ value: "5.2k", label: "Updates the agent wrote back to the log" },
								{ value: "148", label: "Items tracked by 14 people across 9 customers" },
							]}
						/>
					</Reveal>
				</m.div>
			</Statement>
		),
		notes: [
			"Lead with the quote. A PM on an $8M ERP implementation dropped their SharePoint lists for Tato, and the word they used was trust.",
			"First four weeks, internal accounts excluded: items logged through chat grew five times week over week, 5.2k updates written back by the agent, 148 items tracked by 14 people across 9 customers.",
			"Small numbers, because the user base is small. But strong signals.",
		],
	},
	{
		section: "RAID log",
		label: "Learnings",
		body: (
			<Statement heading="Trust is a design problem">
				<Lines items={["Next time: define history in the data model, up front"]} />
			</Statement>
		),
		notes: [
			"Less text, visible control, and an honest history are design decisions, not model improvements.",
			"What I'd do differently: design history into the data model from day one, instead of finding it through UI workarounds.",
		],
	},

	{
		section: "Unified search",
		label: "Title",
		body: (
			<Title
				title="One place to find anything, and ask for the rest"
				sub="Unified search and chat"
				meta={[{ label: "Status", value: "In rollout behind a flag" }]}
			/>
		),
		notes: [
			"The second project, in rollout behind a flag.",
			"The question underneath it: where does the agent live in the product?",
		],
	},
	{
		section: "Unified search",
		label: "The signal",
		body: (
			<Statement heading="Users started asking the agent to find their meetings">
				<Lines items={["They were working around search"]} />
			</Statement>
		),
		notes: [
			"Start with what we saw. People were asking chat to find meetings for them.",
			"Recent meetings are the most important surface in Tato; they're where RAID comes from. And people were routing around search to reach them.",
			"What users ask the agent to do tells you where the UI is failing them.",
		],
	},
	{
		section: "Unified search",
		label: "How we got there",
		body: (
			<Statement heading="We'd split the product in two">
				<Cards className="grid grid-cols-2 gap-6">
					{[
						["/present/search-v1.webp", "v1: ⌘K search, chat centred below", "The industry default"],
						["/present/search-v2.webp", "v2: chat docked bottom-right", "Parallel chats, but meetings got harder to find"],
					].map(([src, label, caption]) => (
						<m.li key={src} variants={rise} className="flex flex-col gap-3">
							<Asset src={src} label={label} className="aspect-[16/9]" />
							<span className="text-lg text-gray-500">{caption}</span>
						</m.li>
					))}
				</Cards>
			</Statement>
		),
		notes: [
			"v1 was the industry default: Cmd+K search, with chat centred on the page below it.",
			"v2 moved chat bottom-right so people could run chats in parallel. The cost was that meetings got harder to find.",
			"Two entry points, and users had to guess which one to use.",
		],
	},
	{
		section: "Unified search",
		label: "One place to start",
		body: (
			<Statement heading="One input for search, navigation, and the agent">
				<Cards className="grid grid-cols-3 gap-6">
					{[
						["Empty", "Your recent meetings"],
						["A few words", "Pages, meetings, settings, RAID, and Ask Tato"],
						["A question", "Straight to the agent"],
					].map(([title, body]) => (
						<m.li key={title} variants={rise} className={`${CARD} gap-2`}>
							<span className="text-2xl font-[550] text-gray-900">{title}</span>
							<span className="text-lg text-pretty text-gray-500">{body}</span>
						</m.li>
					))}
				</Cards>
			</Statement>
		),
		notes: [
			"One composer on Cmd+K; Cmd+J still works. A single point of reference: find what you need, and lean on the agent when you need it.",
			"Empty shows recents, up to six. A few words shows navigation, settings, activity and RAID results, up to five each with a 250ms debounce, plus Ask Tato. A question goes to Ask only, and no search is fired.",
		],
	},
	{
		section: "Unified search",
		label: "Details",
		body: (
			<Statement heading="The delight is in the details">
				<Cards className="grid grid-cols-3 gap-6">
					{[
						["Guess, then recover", "Ends in ? or runs six words: it's a question. Wrong guess? ⌘ Enter."],
						["Ask is one ↑ away", "Drawn first, but last in keyboard order, so the best match is highlighted"],
						["Nothing jumps", "The card springs open, results grow upward and hold steady as they land"],
					].map(([title, body]) => (
						<m.li key={title} variants={rise} className={`${CARD} gap-2`}>
							<span className="text-2xl font-[550] text-gray-900">{title}</span>
							<span className="text-lg text-pretty text-gray-500">{body}</span>
						</m.li>
					))}
				</Cards>
			</Statement>
		),
		notes: [
			"Intent: ends in a question mark or is six or more words, and it's chat. I tried a smarter classifier and it was overkill; one or two words is almost always a page or a meeting. The heuristic is instant, free, deterministic and testable. A wrong guess costs one keystroke, so I designed for cheap recovery, not perfect prediction.",
			"Ask Tato is drawn first but sits last in keyboard order, so the highlight lands on the best match and Ask is one ↑ away.",
			"The card springs from 400 to 560px, results grow up from the input, and they hold steady so the highlight doesn't jump as async results arrive.",
			"Keys: Enter picks the row, Cmd+Enter always asks, Shift+Enter is a newline, Esc collapses.",
		],
	},
	{
		section: "Unified search",
		label: "Live demo: search",
		body: (
			<Statement heading="In the product">
				<Lines items={["Open it empty", "Jump to a meeting", "Ask a question"]} />
			</Statement>
		),
		notes: [
			"Switch to Tato.",
			"Cmd+K empty: recents. Type a meeting name: results plus Ask, highlight on the best match. Press ↑ to Ask.",
			"Type a question: Ask only. Then a short query and Cmd+Enter to show the override.",
			"Point out the nav redesign around the agent and the page, which frees horizontal space for multi-column agent layouts.",
		],
	},
	{
		section: "Unified search",
		label: "What I'll measure",
		body: (
			<Statement heading="How I'll know it worked">
				<Lines items={["Fewer “find my meeting” chats", "How often people override with ⌘ Enter", "Recents usage"]} />
			</Statement>
		),
		notes: [
			"It's in rollout, so no results yet. What I'll watch:",
			"Fewer 'find my meeting' chats, which was the original signal. The Cmd+Enter override rate, which tells me how often the heuristic guessed wrong. And how much recents get used.",
		],
	},

	{
		section: "Q&A",
		label: "Close",
		body: (
			<Statement heading="Keep people in the loop, and give them one place to start">
				<Cards className="grid grid-cols-2 gap-6">
					{[
						["RAID log", "The agent proposes, people decide, and the ledger shows why"],
						["Unified search", "Find what you need, and rely on the agent when you need it"],
					].map(([title, body]) => (
						<m.li key={title} variants={rise} className={`${CARD} gap-2`}>
							<span className="text-2xl font-[550] text-gray-900">{title}</span>
							<span className="text-lg text-pretty text-gray-500">{body}</span>
						</m.li>
					))}
				</Cards>
			</Statement>
		),
		notes: [
			"Back to the opening question. My answer, from these two projects: keep people in the loop, and give them one place to start.",
			"Then open it up.",
		],
	},
	{
		section: "Q&A",
		label: "Questions",
		body: (
			<div className="flex h-full flex-col justify-between p-20">
				<Display>Questions</Display>
				<m.span variants={rise} className="text-base text-gray-500">
					sekei.xyz
				</m.span>
			</div>
		),
		notes: ["Around fifteen minutes."],
	},
];
