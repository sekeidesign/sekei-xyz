"use client";

import { m, type Variants } from "motion/react";
import { Fragment, type ReactNode } from "react";
import { Quote } from "@ui-kit/Quote";
import { Stats } from "@ui-kit/Stats";
import Image from "next/image";
import { cn } from "@ui-kit/cn";
import { Button } from "@ui-kit/Button";
import { Problems } from "@ui-kit/Problems";
import { ArrowIcon } from "@ui-kit/icons/ArrowIcon";
import { VideoIcon } from "@ui-kit/icons/VideoIcon";
import { SURFACE_INNER, SURFACE_OUTER } from "@ui-kit/post/surface";
import { Surface } from "@ui-kit/Surface";
import { ExtractionFlow } from "@ui-kit/figures/ExtractionFlow";
import { IndicatorDemo } from "@ui-kit/figures/IndicatorDemo";
import { RiskLifecycle } from "@ui-kit/figures/RiskFlows";
import { Asset } from "./Asset";

export const SECTIONS = [
	{ name: "RAID log", minutes: 21 },
	{ name: "Meeting experience", minutes: 19 },
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

function Heading({ children, wide }: { children: ReactNode; wide?: boolean }) {
	return (
		<m.h2
			variants={stagger(0.035)}
			className={cn("text-5xl leading-[1.1] tracking-tight text-balance text-gray-900", !wide && "max-w-3/4")}
		>
			<Words>{children}</Words>
		</m.h2>
	);
}

function Display({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<m.h1
			variants={stagger(0.045)}
			className={`max-w-3/4 text-7xl leading-none tracking-tight text-balance text-gray-900 ${className ?? ""}`}
		>
			<Words>{children}</Words>
		</m.h1>
	);
}

function Lines({ items, wide }: { items: ReactNode[]; wide?: boolean }) {
	return (
		<m.ul
			variants={stagger(0.09)}
			className={cn("flex flex-col gap-3 text-lg leading-snug text-pretty text-gray-600", !wide && "max-w-3/4")}
		>
			{items.map((item, index) => (
				<m.li key={index} variants={rise}>
					{item}
				</m.li>
			))}
		</m.ul>
	);
}


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
					<m.p variants={rise} className="max-w-3xl text-2xl text-pretty text-gray-500">
						{sub}
					</m.p>
				)}
			</div>
			<m.dl variants={stagger(0.08)} className="grid grid-cols-3 gap-8">
				{meta?.map(({ label, value }) => (
					<m.div key={label} variants={rise} className="flex flex-col gap-1">
						<dt className="text-sm text-gray-400">{label}</dt>
						<dd className="text-base text-pretty text-gray-700">{value}</dd>
					</m.div>
				))}
			</m.dl>
		</div>
	);
}

function Statement({
	heading,
	lede,
	children,
}: {
	heading: string;
	lede?: string;
	children?: ReactNode;
}) {
	return (
		<div className="flex h-full flex-col justify-between gap-10 p-20">
			<div className="flex flex-col gap-5">
				<Heading>{heading}</Heading>
				{lede && (
					<m.p variants={rise} className="max-w-3/4 text-lg leading-snug text-pretty text-gray-600">
						{lede}
					</m.p>
				)}
			</div>
			{children}
		</div>
	);
}

/** The UI kit's lists and stats carry their own weights and mono numerals; on a slide everything shares one face. */
const ONE_FACE = "[&_*]:font-sans! [&_*]:font-normal!";

/** Drops a UI-kit Surface's frame and card so the figure sits straight on the slide. */
const BARE =
	"[&>div]:bg-transparent! [&>div]:p-0! [&>div]:shadow-none! [&>div]:ring-0! [&>div>div]:bg-transparent! [&>div>div]:shadow-none! [&>div>div]:ring-0!";

function List({
	label,
	items,
	wide,
	dense,
}: {
	label: string;
	items: string[];
	wide?: boolean;
	dense?: boolean;
}) {
	return (
		<Reveal className={cn("[&>*]:my-0!", ONE_FACE, !wide && "max-w-3/4", dense && "[&_li]:py-3! [&>div>div>div:first-child]:hidden")}>
			<Problems label={label} items={items} />
		</Reveal>
	);
}

const DOTS =
	"dot-matrix bg-gray-50 [--dot-color:var(--color-gray-200)] [--dot-gap:14px] [--dot-size:0.75px]";

function Step({ children, gap }: { children: ReactNode; gap?: boolean }) {
	return <span className={cn("whitespace-nowrap", gap ? "text-gray-500" : "text-blue-600")}>{children}</span>;
}

function Link({ gap }: { gap?: boolean }) {
	return <span className={cn("w-8 shrink-0 border-t-2", gap ? "border-dashed border-gray-400" : "border-blue-600")} />;
}

/**
 * Drawn by hand rather than with Flow: the renderer can't mute a step or
 * annotate a span of them, and the gap before the meeting is the point.
 */
function MeetingFlow() {
	return (
		<Surface className="w-full" inner={{ className: `flex justify-center px-10 pt-16 pb-20 ${DOTS}` }}>
			<div className="relative flex items-center gap-2 text-sm">
				<div className="absolute right-8 bottom-full left-8 mb-2 h-5 rounded-t-lg border-x-2 border-t-2 border-dashed border-gray-400">
					<svg
						viewBox="0 0 10 6"
						aria-hidden="true"
						className="absolute top-full -left-px h-1.5 w-2.5 -translate-x-1/2 fill-gray-400"
					>
						<path d="M0 0h10L5 6z" />
					</svg>
				</div>
				<div className="relative flex items-center gap-2">
					<Step gap>Prepare agenda</Step>
					<Link gap />
					<Step gap>Notify owners</Step>
					<div className="absolute top-full right-0 left-0 mt-3 flex flex-col items-center">
						<span className="h-2 w-full border-x border-b border-dotted border-gray-400" />
						<span className="h-2 border-l border-dotted border-gray-400" />
						<span className="text-center text-xs leading-tight whitespace-nowrap text-gray-600">
							No Tato before the meeting
							<br />
							the biggest opportunity
						</span>
					</div>
				</div>
				<Link gap />
				<Step>Capture outcomes</Step>
				<Link />
				<Step>Review recap</Step>
				<Link />
				<Step>Share recap</Step>
			</div>
		</Surface>
	);
}

/** The point on top, the recording underneath fading out where the live demo takes over. */
function DemoSlide({
	heading,
	lede,
	items,
	src,
	label,
	href,
}: {
	heading: string;
	lede?: string;
	items: string[];
	src: string;
	label: string;
	href?: string;
}) {
	return (
		<div className="relative flex h-full flex-col gap-8 px-20 pt-20">
			<div className="grid grid-cols-2 items-start gap-12">
				<div className="flex flex-col gap-5">
					<Heading wide>{heading}</Heading>
					{lede && (
						<m.p variants={rise} className="text-lg leading-snug text-pretty text-gray-600">
							{lede}
						</m.p>
					)}
				</div>
				<List wide dense label="" items={items} />
			</div>
			<Reveal className="mask-b-from-30% mask-b-to-55%">
				<Asset src={src} label={label} className="aspect-[8/5]" />
			</Reveal>
			{href && (
				<m.div variants={rise} className="absolute bottom-10 left-1/2 -translate-x-1/2">
					<Button
						variant="primary"
						render={<a href={href} target="_blank" rel="noreferrer" />}
						className="h-11 gap-2 px-5 text-base"
					>
						Live demo
						<ArrowIcon rotate={45} />
					</Button>
				</m.div>
			)}
		</div>
	);
}

/** Sam's layout: the argument on the left, the one number that proves it drawn on the right. */
function Visual({
	heading,
	lede,
	children,
	visual,
}: {
	heading: string;
	lede?: string;
	children?: ReactNode;
	visual: ReactNode;
}) {
	return (
		<div className="grid h-full grid-cols-2">
			<div className="flex flex-col justify-between gap-10 p-20 pr-12">
				<div className="flex flex-col gap-5">
					<Heading wide>{heading}</Heading>
					{lede && (
						<m.p variants={rise} className="text-lg leading-snug text-pretty text-gray-600">
							{lede}
						</m.p>
					)}
				</div>
				{children}
			</div>
			<div className="flex items-center justify-center overflow-hidden border-l border-gray-200 bg-white">{visual}</div>
		</div>
	);
}

function Coverage() {
	return (
		<>
			<Meter share={0.5} label="Meetings Tato joins" value="~50%" />
			<m.div variants={rise} className="relative">
				<div className="grid grid-cols-[repeat(5,2.5rem)] gap-3">
					{Array.from({ length: 20 }, (_, tile) => (
						<span
							key={tile}
							className={cn(
								"flex size-10 items-center justify-center rounded-full",
								tile < 10 ? "bg-gray-100 text-gray-700" : "border border-dashed border-gray-300 text-gray-300",
							)}
						>
							<VideoIcon size={20} />
						</span>
					))}
				</div>
				{/* The missed half is the bottom two rows: two 40px rows and a 12px gap in, the line sits mid-gap. */}
				<span className="absolute top-24.5 left-0 -right-32 border-t border-dotted border-gray-300" />
				<span className="absolute -bottom-1.5 left-0 -right-32 border-t border-dotted border-gray-300" />
				<div className="absolute top-24.5 -bottom-1.5 -right-20 flex w-0 flex-col items-center">
					<span className="flex-1 border-l border-dotted border-gray-300" />
					<span className="py-1.5 text-center text-xs leading-tight whitespace-nowrap text-gray-500">
						~50% lost
						<br />
						visibility and data
					</span>
					<span className="flex-1 border-l border-dotted border-gray-300" />
				</div>
			</m.div>
		</>
	);
}

const MEETING_DEMO = "https://dev2.tato.co/summary/9d380910-ae2d-44a3-8448-62b45f18bee0";
const LIVE_DEMO = "https://demo.tato.co/dashboard/rad/risks?pageSize=40&tracked=tracked";

const CUSTOMERS = [
	{ name: "Agropur", src: "agropur.png" },
	{ name: "Bridor", src: "bridor.svg", wordmark: true },
	{ name: "EBC", src: "ebc.png" },
	{ name: "Gestisoft", src: "gestisoft.svg", wordmark: true },
	{ name: "HEC Montréal", src: "hec.png" },
	{ name: "Héma-Québec", src: "hema-quebec.png" },
	{ name: "Héroux-Devtek", src: "heroux-devtek.svg", wordmark: true },
	{ name: "LIDD", src: "lidd.png" },
	{ name: "NYLL", src: "nyll.png" },
	{ name: "SIS Global", src: "sis-global.png" },
	{ name: "SQI", src: "sqi.jpg" },
	{ name: "Xerox", src: "xerox.png" },
];

function Customers({ active }: { active: string }) {
	return (
		<m.ul variants={rise} className="grid grid-cols-6 gap-3">
			{CUSTOMERS.map(({ name, src, wordmark }) => (
				<li
					key={name}
					className={cn(
						"rounded-full",
						SURFACE_OUTER,
						name === active && "outline-2 outline-offset-2 outline-accent",
					)}
				>
					<div className={cn("flex size-10 items-center justify-center rounded-full", SURFACE_INNER)}>
						<Image
							src={`/present/customers/${src}`}
							alt={name}
							width={40}
							height={40}
							unoptimized
							className={cn(
								wordmark ? "h-auto w-4/5" : "size-full object-cover",
								name !== active && "opacity-40 grayscale",
							)}
						/>
					</div>
				</li>
			))}
		</m.ul>
	);
}

function Meter({ share, label, value }: { share: number; label: string; value: string }) {
	return (
		<m.div variants={rise} className="flex flex-col gap-2">
			<div className="h-2 overflow-hidden rounded-[1px] bg-gray-100">
				<div style={{ width: `${share * 100}%` }} className="h-full rounded-[1px] bg-gray-800" />
			</div>
			<div className="flex justify-between text-sm text-gray-500">
				<span>{label}</span>
				<span className="text-gray-900 tabular-nums">{value}</span>
			</div>
		</m.div>
	);
}

function Outcome({ children }: { children: ReactNode }) {
	return (
		<m.div variants={stagger(0.15, 0.2)} className="flex w-max flex-col gap-10">
			{children}
		</m.div>
	);
}

export const SLIDES: Slide[] = [
	{
		section: "RAID log",
		label: "Title",
		body: (
			<Title
				title="Closing the loop on an AI native RAID log"
				sub="How I built an agentic RAID log to automate manual work, and increased coverage over customer data to help close the loop on complex projects."
			/>
		),
		notes: [
			"We've covered my background, so straight into the work.",
			"Two Tato projects, told as one story: the RAID log, the coverage gap it exposed, and the meeting experience we built to close it.",
		],
	},
	{
		section: "RAID log",
		label: "Why RAID matters",
		body: (
			<Visual
				heading="Existing workflows are slow, labour intensive, and full of gaps"
				visual={
					<Reveal className={`w-full px-10 [&>*]:my-0! ${BARE} ${ONE_FACE}`}>
						<ExtractionFlow />
					</Reveal>
				}
			>
				<Lines
					wide
					items={[
						"RAID maps how a project is really progressing. It drives executive reporting and keeps the project on track.",
						"But the PM of a project can't be in every meeting, see every email, read every chat message. This causes gaps in information and delays on getting the latest source of truth.",
						"Spreadsheets make this worse. They are cumbersome to update, and hard to reason over. They spread decisions and decentralize truth.",
					]}
				/>
			</Visual>
		),
		notes: [
			"RAID: Risks, Action items, Issues, Decisions. It maps the reality of how a project is progressing, drives executive reporting, and keeps the project on track.",
			"And it's still filled in by hand in spreadsheets. That's extra labour, and more mistakes.",
			"The PM can't be in every meeting, see every email or read every chat message, so information has gaps and the source of truth lags. Spreadsheets make it worse: cumbersome to update, hard to reason over, and they scatter decisions.",
			"The PM can't be in every meeting, but Tato can.",
		],
	},
	{
		section: "RAID log",
		label: "Starting point",
		body: (
			<Visual
				heading="Our first RAID attempt was an objective failure"
				visual={
					<Outcome>
						<Customers active="SIS Global" />
						<Meter share={1 / 12} label="Customers using RAID" value="1 of 12" />
					</Outcome>
				}
			>
				<Lines
					wide
					items={[
						"Barely used by a single customer due to a lack of trust and UX friction.",
						"The company vision is to automate your work so you can deliver on time and on budget.",
						"Our goal here is to make it trustworthy and intuitive to manage. We want to centralize all RAID management into Tato and move users off spreadsheets.",
					]}
				/>
			</Visual>
		),
		notes: [
			"Our first attempt at RAID was an objective failure: barely used by a single customer, because of a lack of trust and UX friction.",
			"The company vision is to automate your work so you can deliver on time and on budget.",
			"The goal for this round: make it trustworthy and intuitive to manage, centralise all RAID management in Tato, and move users off spreadsheets.",
		],
	},
	{
		section: "RAID log",
		label: "Research → lifecycle",
		body: (
			<Statement
				heading="Researching and scoping the problem"
				lede="Ran user research sessions with 3 client partners and dug into documentation to understand the mechanics of a RAID log."
			>
				<m.figure variants={stagger(0.15)} className="flex flex-col gap-3">
					<Reveal className={`[&>*]:my-0! ${ONE_FACE}`}>
						<RiskLifecycle />
					</Reveal>
					<m.figcaption variants={rise} className="max-w-3/4 text-sm leading-snug text-pretty text-gray-500">
						Mapped the research into an understanding of the lifecycle of a RAID item, to inform our data model,
						flows, and automations.
					</m.figcaption>
				</m.figure>
			</Statement>
		),
		notes: [
			"Three client partners: experienced PMs who beta test for us and give expert feedback.",
			"I asked them how and when they update the log, how they report on it, and how it evolves over time.",
			"Alongside that, deep research through some truly awful documents.",
			"Then I mapped the R/A/I/D lifecycle: a Risk is mitigated by Actions and Decisions, or it escalates into an Issue.",
			"Mapping it let me work with engineering on the right data structures.",
			"It's domain-driven design: every new primitive we model is available to our agent for free.",
		],
	},
	{
		section: "RAID log",
		label: "Delight in the details",
		body: (
			<Statement heading="Delight in the details" lede="Impact, likelihood and status are each driven by a single value, so they spring smoothly between any two states.">
				<Reveal className={`max-w-3/4 [&>*]:my-0! ${ONE_FACE}`}>
					<IndicatorDemo />
				</Reveal>
			</Statement>
		),
		notes: ["Small details make the log feel alive. Impact, likelihood and status each animate from a single value, so they spring smoothly between any two states, including the intermediate ones. Drag the sliders to show it."],
	},
	{
		section: "RAID log",
		label: "Initiatives + demo 1",
		body: (
			<DemoSlide
				heading="Three initiatives to help drive our goals"
				lede="Built around how people and agents work together: Tato can drive all three, and people can steer any of them."
				items={[
					"Human in the loop: review, track, dismiss",
					"Navigable history: the ledger of changes",
					"RAID management dashboard",
				]}
				src="/present/raid-demo.mp4"
				label="RAID demo recording"
				href={LIVE_DEMO}
			/>
		),
		notes: [
			"Three initiatives. One: human in the loop, so people review, track and dismiss what the agent extracts. Two: navigable history, the ledger of changes. Three: a RAID management dashboard.",
			"And a layer across all three: agent write-backs. You can ask Tato to read or write any item.",
			"Then switch to the live demo, about nine minutes:",
			"First, set expectations: I did a ton of iteration on how to display a RAID item, its history, and the rest. Flash the Paper file to show the explorations, then go to the product.",
			"Meeting summary → extracted RAID items → track and dismiss. Explain what each one tells Tato.",
			"Open an item → history drawer → walk the timeline, activity to update.",
			"While the drawer is open, talk through the hard problem: history. I ran workshops with Alex on three questions. When does an activity map to an update: when it happened, when it was processed, or when it was tied to the item? How do we handle updates, reverts and dismisses? And how do we make it work without proper event sourcing, a four-to-six-month project that's still in progress?",
			"Several design iterations, and we shaped the changes API together. A pragmatic tradeoff: ship trust now, rather than wait on the ideal architecture.",
			"Dashboard: keyboard navigation, optimistic updates and prefetch speed, animated property icons.",
			"Ask Tato in chat to update an item, and watch it write back.",
		],
	},
	{
		section: "RAID log",
		label: "Impact",
		body: (
			<Statement heading="Our first real hint of product-market fit">
				<div className="flex flex-col gap-8">
					<Reveal className="max-w-3/4 [&_figure>div]:my-0!">
						<Quote cite="PM on an $8M ERP implementation">
							“Once I saw I could trust it, I got rid of my SharePoint lists and
							centralized everything in Tato.”
						</Quote>
					</Reveal>
					<Reveal className={`max-w-3/4 [&>*]:my-0! ${ONE_FACE}`}>
						<Stats
							stats={[
								{ value: "5×", label: "Items logged through chat, week over week", trend: [320, 341, 813, 1669] },
								{ value: "+800%", label: "Customers with weekly active RAID users" },
								{ value: "5.2k", label: "Updates the agent wrote back to the log" },
							]}
						/>
					</Reveal>
				</div>
			</Statement>
		),
		notes: [
			"GA was about five weeks ago.",
			"Items logged are up five times. Chat interactions are up a lot, including users uploading their existing spreadsheets to convert them. And customers with weekly active RAID users went from 1 to 9, out of 12. That's an 800% increase.",
			"One PM told us she can't do her job without it. Once she trusted it, she moved everything off SharePoint.",
			"Our first real hint of product-market fit.",
		],
	},

	{
		section: "Meeting experience",
		label: "The coverage gap",
		body: (
			<Visual
				heading="Making Tato more sticky to increase adoption and value"
				lede="The RAID log is only valuable if we get a clear picture. We need full coverage of all meetings."
				visual={
					<Outcome>
						<Coverage />
					</Outcome>
				}
			>
				<Lines
					wide
					items={[
						"The value only arrives after a meeting is processed. Tato only covers a narrow slice and is less sticky to less users.",
						"Tato only joins about half of all meetings, which lowers coverage and leaves open an opportunity to close the loop on RAID.",
					]}
				/>
			</Visual>
		),
		notes: [
			"RAID is only as accurate as our coverage of a project's interactions.",
			"Users only get value after a meeting finishes processing. That's a narrow slice, and hard to make sticky.",
			"And Tato doesn't join about 50% of meetings: calendar misconfigurations, bot architecture, scale. Users don't find out until after.",
			"If asked: of the meetings Tato does try to join, almost all succeed. The gap is meetings it never tries.",
		],
	},
	{
		section: "Meeting experience",
		label: "Closing the loop",
		body: (
			<Statement
				heading="Customer feedback gave us signs of where to focus next"
				lede="Double down on adoption, stickiness, and delight."
			>
				<div className="flex flex-col gap-8">
					<Lines
						items={[
							"There was real appetite from PMs to use this RAID log to run their meetings.",
							"Due to its self healing nature, and the historical ledger, Tato is the natural place to automatically track progress over months and years.",
						]}
					/>
					<List
						label="Goals"
						items={[
							"Increase Tato's coverage of users' calendars",
							"Increase meeting opens before the meeting happens",
						]}
					/>
				</div>
			</Statement>
		),
		notes: [
			"A RAID item gets discussed over and over for months, as Risks are mitigated with Actions and Decisions to prevent Issues.",
			"The signal: once PMs saw the RAID quality, they wanted to run their scrums and steering committees from our data.",
			"So: double down on adoption, stickiness, and delight. Two goals: increase Tato's coverage of users' calendars, and increase meeting opens before the meeting happens.",
		],
	},
	{
		section: "Meeting experience",
		label: "Approach",
		body: (
			<Statement heading="Two bets, from the meeting flow">
				<div className="flex flex-col gap-6">
					<Reveal className={ONE_FACE}>
						<MeetingFlow />
					</Reveal>
					<m.div variants={stagger(0.1)} className="grid grid-cols-2 gap-6">
						<List
							wide
							label="Collaborative notes"
							items={[
								"Yjs and PlateJS: a custom markdown editor",
								"@ RAID chips with the design-system card",
								"RAID items as blocks and tables",
							]}
						/>
						<List
							wide
							label="Clear bot status"
							items={[
								"Recall.ai joins and records the meeting",
								"New states, recording time, dismissals",
								"motion/react for state transitions",
							]}
						/>
					</m.div>
				</div>
			</Statement>
		),
		notes: [
			"I mapped the meeting flow from our partner research into five job stories, in sequence:",
			"Before a meeting, I want to prepare an agenda with the most up to date information, so that I can run a fast and efficient meeting.",
			"Before a meeting, I want the meeting owners to be notified that an agenda has been populated for them to review, so the notes can be relevant and accurate.",
			"During a workshop, I want decisions, gaps, open questions, and owners to be captured so that work doesn't slip through the cracks.",
			"After a meeting, I want a recap with Risks, Action Items, Issues, and Decisions and their sources sent to the meeting owner for review, so we can ensure information is accurate before sharing with the wider team.",
			"After a meeting, I want a recap with RAIDs and their sources sent to all attendees, so everyone has a shared source of truth and can agree or disagree with outcomes early.",
			"Two bets. One: real-time collaborative notes with full coverage of our data, for humans and agents. Two: clarity and simplicity on the bot's join status.",
			"How the notes are built: our existing Yjs infrastructure plus PlateJS for a custom markdown editor. @ inline RAID chips: hover shows the design-system RAID card, click opens the drawer. RAID items as blocks and tables, for running scrums.",
			"How the bot status is built: Recall.ai joins and records the meeting. A DB migration extends the meetings table with new states, recording time and dismissal reasons. The state card animates between states with motion/react.",
		],
	},
	{
		section: "Meeting experience",
		label: "Demo 2",
		body: (
			<DemoSlide
				heading="Tato before and during the meeting"
				items={[
					"Collaborate on notes in real time",
					"@ a risk and open its history",
					"Run a scrum from a RAID table",
					"See why Tato will or won't join",
				]}
				src="/present/meeting-demo.mp4"
				label="Meeting experience demo recording"
				href={MEETING_DEMO}
			/>
		),
		notes: [
			"About nine minutes.",
			"Upcoming meeting → open the notes before it starts.",
			"Two windows: show real-time collaboration.",
			"@ tag a risk → hover card → click → drawer with history, without leaving the meeting.",
			"Insert a RAID table block: this is how you run a scrum.",
			"Bot state card: walk through the states and transitions, why Tato will or won't join, and ask it to join.",
		],
	},
	{
		section: "Meeting experience",
		label: "Status & next",
		body: (
			<Statement heading="Early rollout. Small data, clear appetite.">
				<List
					label="Next"
					items={[
						"Agent write-backs: generate meeting agendas with DDD and automations",
						"Proactive outreach: an always-on agent shares the right info at the right time",
					]}
				/>
			</Statement>
		),
		notes: [
			"We're in early rollout, running user testing with early adopters. The data is small, but the appetite is clear.",
			"Next: agent write-backs, generating meeting agendas using domain-driven design and automations.",
			"And proactive outreach: an always-on agent that shares the right information at the right time. A daily scrum isn't a monthly steerco.",
		],
	},

	{
		section: "Q&A",
		label: "Close",
		body: (
			<div className="flex h-full flex-col justify-between p-20">
				<Display>Thanks, happy to go deeper on anything.</Display>
				<m.span variants={rise} className="text-base text-gray-500">
					sekei.design
				</m.span>
			</div>
		),
		notes: ["Thanks, happy to go deeper on anything."],
	},
];
