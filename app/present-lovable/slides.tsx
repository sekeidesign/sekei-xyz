"use client";

import { m } from "motion/react";
import { cn } from "@ui-kit/cn";
import { Button } from "@ui-kit/Button";
import { ArrowIcon } from "@ui-kit/icons/ArrowIcon";
import { CodeBlock } from "@ui-kit/code/CodeBlock";
import { SURFACE_INNER, SURFACE_OUTER } from "@ui-kit/post/surface";
import { Surface } from "@ui-kit/Surface";
import { beam, bolt, DitherCanvas, type FxFactory, fire, fluid, rain, rings, snow, useFx } from "@/components/shad-fx";
import { ShadFxCover } from "@ui-kit/covers/ShadFxCover";
import { Flow } from "@ui-kit/flow/Flow";
import { Pan } from "@ui-kit/flow/Pan";
import { PipelineFigure } from "./PipelineFigure";
import {
	DOTS,
	Display,
	Heading,
	Lines,
	List,
	RAID_SLIDES,
	Reveal,
	type Section,
	type Slide,
	Statement,
	Title,
	Visual,
	rise,
	stagger,
} from "../present/slides";

export const SECTIONS: Section[] = [
	{ name: "RAID log", minutes: 15 },
	{ name: "shad-fx", minutes: 12 },
	{ name: "Q&A", minutes: 8 },
];

const DOCS = "https://www.sekei.design/shad-fx";

const FACTORIES = { fire, bolt, rings, fluid, beam, rain, snow } as Record<string, FxFactory<unknown>>;

type EffectName = "fire" | "bolt" | "rings" | "fluid" | "beam" | "rain" | "snow";

/** One effect at its defaults, live. */
function Live({ name, label, className }: { name: EffectName; label?: string; className?: string }) {
	const effect = useFx(FACTORIES[name]);
	return (
		<figure className={cn("relative rounded-xl", SURFACE_OUTER, className)}>
			<div className={cn("relative h-full overflow-hidden rounded-lg", SURFACE_INNER)}>
				<DitherCanvas effect={effect} />
			</div>
			{label !== undefined && (
				<figcaption className="absolute top-1 left-1 z-10 p-3 font-mono text-xs text-gray-900">{label}</figcaption>
			)}
		</figure>
	);
}

/** Every effect paints through one contract; every renderer decides what those calls mean. */
const ARCHITECTURE = `flowchart LR
  %% Effects first: the layout orders by declaration, so they land left of Surface.
  fire[fire()]
  bolt[bolt()]
  rings[rings()]
  fluid[fluid()]
  beam[beam()]
  rain[rain()]
  snow[snow()]
  fire --- surface[Surface]
  bolt --- surface
  rings --- surface
  fluid --- surface
  beam --- surface
  rain --- surface
  snow --- surface
  surface --> dither[DitherCanvas]
  surface --> ascii[AsciiCanvas, next]`;

function Architecture() {
	return (
		<Surface className="w-full" inner={{ className: `flex items-center ${DOTS}` }}>
			<Pan aria-label="Effects feed one Surface contract, which every renderer implements">
				<Flow
					source={ARCHITECTURE}
					aria-label="Effects feed one Surface contract, which every renderer implements"
					className="p-10"
				/>
			</Pan>
		</Surface>
	);
}

const BEFORE = `// Build it once, or every render restarts the fire
const effect = useMemo(
  () => fire({ colors: [cold, warm, hot] }),
  [cold, warm, hot],
);

<DitherCanvas effect={effect} />`;

const AFTER = `// Built once, options kept in step render by render
const effect = useFx(fire, { colors: [cold, warm, hot] });

<DitherCanvas effect={effect} />`;

function Code({ label, code, muted }: { label: string; code: string; muted?: boolean }) {
	return (
		<m.div variants={rise} className={cn("flex flex-col gap-2", muted && "opacity-60")}>
			<span className="text-sm text-gray-500">{label}</span>
			{/* The shorter sample stretches to match its neighbour, frame and dark panel both. */}
			<CodeBlock code={code} lang="tsx" className="flex flex-1 flex-col [&>div:first-child]:flex-1" />
		</m.div>
	);
}

const SHAD_FX: Slide[] = [
	{
		section: "shad-fx",
		label: "From a case study to a library",
		body: (
			<Visual
				heading="Telling the RAID story with effects"
				visual={
					<Reveal className="relative h-full w-full">
						<ShadFxCover cell={4} hold={3500} fireRate={46} icon={32} />
					</Reveal>
				}
			>
				<Lines
					wide
					items={[
						"RAID is a core part of our business and our users' day to day, so I wanted the case study to feel like it.",
						"I quickly realised the effects could be extended further, and that a library might be useful to others.",
						"shad-fx: canvas effects for React, copied into your project as source through the shadcn registry.",
					]}
				/>
			</Visual>
		),
		notes: [
			"I wanted these effects to tell the story of RAID in my case study, since it's such an important core part of our business and our users' day to day.",
			"I realised quickly that this could be extended further, and a library might be useful.",
			"It installs like shadcn: the source lands in your project, so you own it.",
		],
	},
	{
		section: "shad-fx",
		label: "Effects stay standalone",
		body: (
			<Statement
				heading="Standalone effects for future proofing and flexibility"
				lede="Each effect is a standalone factory that only simulates. Renderers decide what the four Surface calls mean in their medium."
			>
				<Reveal className="font-mono">
					<Architecture />
				</Reveal>
			</Statement>
		),
		notes: [
			"The biggest decision was keeping the effects as standalone factory functions, so they're entirely separate from the renderers.",
			"The obvious alternative was effect props on the renderer component, so the renderer owns its effects. Then every new renderer has to own every effect, and the surface area grows multiplicatively.",
			"Instead there's one contract, Surface: clear, blend, dither, glint. The effect decides each cell's intensity; the renderer decides how to put that on screen. Each factory holds its own state, so two fires on one page are independent.",
			"I'm building an ASCII renderer next. It uses the exact same simulations, and just paints them differently.",
		],
	},
	{
		section: "shad-fx",
		label: "useFx",
		body: (
			<div className="flex h-full flex-col gap-10 p-20">
				<div className="flex flex-col gap-5">
					<Heading>API design decisions</Heading>
					<m.p variants={rise} className="max-w-3/4 text-lg leading-snug text-pretty text-gray-600">
						Exporting bare factories kept the API small, but left memoisation to the user. Forget it, and every render
						restarts the effect.
					</m.p>
				</div>
				<m.div variants={stagger(0.12)} className="mt-auto grid grid-cols-2 gap-8">
					<Code label="Before: the caller memoises" code={BEFORE} muted />
					<Code label="After: useFx" code={AFTER} />
				</m.div>
			</div>
		),
		notes: [
			"I did some iterations on the API and ergonomics. The biggest one was this useFx hook.",
			"My first API just exported the effect functions and let users manage memoisation. Dead simple, and the effects stayed independent of the renderer.",
			"It quickly turned out to be a footgun. You need to know to memoise the effect, it's an easy trap to fall into, and it isn't idiomatic React: options should be plain props you can write inline.",
			"useFx builds the effect once and diffs the options every render, so only the keys that changed reach the effect through set(), live, without resetting what's on screen. An inline colours array costs nothing.",
			"For things that change every frame, like a pointer, you call fx.set from the handler instead of re-rendering.",
		],
	},
	{
		section: "shad-fx",
		label: "Mount to park",
		body: (
			<Visual
				heading="The component pipeline"
				lede="Keeping the effects performant and reusable"
				visual={<PipelineFigure />}
			>
				<Lines
					wide
					items={[
						"The simulation runs on a tiny grid, and image-rendering: pixelated scales it up as the browser composites the page.",
						"The rAF loop only draws when the simulation step reports a change.",
						"One putImageData draws each frame, instead of thousands of fillRect calls.",
						"With active=false, an effect eases to idle instead of cutting out, then stops, so an idle effect costs almost nothing.",
						"An IntersectionObserver pauses effects while they're off screen.",
					]}
				/>
			</Visual>
		),
		notes: [
			"Offer first: if you want, I can walk you through the whole rendering pipeline, with some of the performance decisions and some honestly just cool stuff to nerd out on.",
			"Mount: the canvas mounts and a ResizeObserver watches for changes. We divide its size by the cell size, so larger cells mean a smaller canvas and better performance, and small resizes don't reset the simulation.",
			"Clock: rAF calls step on every display frame, but the effect advances on its own slower clock, 36 steps a second by default, configurable with perf implications. rAF only draws when step returns true, so if nothing changed, the frame is nearly free.",
			"Simulate: each effect is a factory with its own state, deciding each cell's intensity. The Doom fire seeds the bottom row with heat, and each cell above copies a randomly offset cell below it, minus some heat loss. That's why flames rise, waver, and fade.",
			"It hands that to the renderer through the Surface contract, so the same effect runs on any renderer unchanged.",
			"Paint: the dither renderer uses the Bayer matrix to turn intensity into cells, and writes the whole frame as one ImageData: one putImageData per frame instead of thousands of fillRects. Then image-rendering: pixelated scales the small canvas up to fill the box, which costs nothing extra.",
			"Park: set active to false and intensity eases down. Intensity drives the heat source, so the fire burns down upward instead of fading out. Once idle returns true the loop stops entirely, so it's virtually free when nobody's interacting. Off screen, an IntersectionObserver pauses it.",
			"Reduced motion is read with useSyncExternalStore, so it responds instantly when the preference changes, and effects paint a settled single frame.",
		],
	},
	{
		section: "shad-fx",
		label: "Demo",
		body: (
			<div className="relative flex h-full flex-col gap-8 p-20">
				<Heading wide>Seven effects, one renderer, so far</Heading>
				<m.div variants={stagger(0.06)} className="grid flex-1 grid-cols-4 grid-rows-2 gap-3">
					{(Object.keys(FACTORIES) as EffectName[]).map((name) => (
						<m.div key={name} variants={rise} className="min-h-0">
							<Live name={name} label={`${name}()`} className="h-full" />
						</m.div>
					))}
					<m.div variants={rise} className="flex items-center justify-center">
						<Button
							variant="primary"
							render={<a href={DOCS} target="_blank" rel="noreferrer" />}
							className="h-11 gap-2 px-5 text-base"
						>
							Playground
							<ArrowIcon rotate={45} />
						</Button>
					</m.div>
				</m.div>
			</div>
		),
		notes: [
			"Every tile here is the same renderer running a different effect, live.",
			"Open the playground: change colours and rate live and show the effect doesn't restart. Toggle active to show it easing out and parking.",
			"Show the install: one shadcn command, and the files land in your project.",
		],
	},
	{
		section: "shad-fx",
		label: "Next",
		body: (
			<Statement heading="What's next">
				<List
					label="Next"
					items={[
						"An ASCII renderer: the same simulations, painted as glyphs",
						"Precompute colour ramps to cut the per-frame garbage collection",
					]}
				/>
			</Statement>
		),
		notes: [
			"The ASCII renderer is the real test of the architecture. Glyphs are about twice as tall as wide, so effects that measure in cells, like rings, will need the cell aspect on the frame.",
			"Profiling in the performance tab, I saw unnecessary garbage collection from how colours are handled: each frame allocates new colour objects. Precomputing a fixed ramp would remove most of it.",
			"That's a bit outside my wheelhouse, and it's part of what I love about building now: with AI I can go deep on even this layer and understand it, not just ship it.",
		],
	},
];

const CLOSE: Slide = {
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
};

/** Speaker notes that differ from /present, keyed by slide label. The slides themselves are shared. */
const RAID_NOTES: Record<string, string[]> = {
	"Initiatives + demo 1": [
		"Three initiatives. One: human in the loop, so people review, track and dismiss what the agent extracts. Two: navigable history, the ledger of changes. Three: a RAID management dashboard.",
		"And a layer across all three: agent write-backs. You can ask Tato to read or write any item.",
		"Then switch to the live demo, about nine minutes:",
		"First, set expectations: I did a ton of iteration on how to display a RAID item, its history, and the rest. Flash the Paper file to show the explorations, then go to the product.",
		"Meeting summary → extracted RAID items → track and dismiss. Explain what each one tells Tato.",
		"Open an item → history drawer → walk the timeline, activity to update.",
		"While the drawer is open, talk through the hard problem: history. I ran workshops with Alex on three questions. When does an activity map to an update: when it happened, when it was processed, or when it was tied to the item? How do we handle updates, reverts and dismisses? And how do we make it work without proper event sourcing, a four-to-six-month project that's still in progress?",
		"Several design iterations, and we shaped the changes API together. A pragmatic tradeoff: ship trust now, rather than wait on the ideal architecture.",
		"RAID table: keyboard navigation, optimistic updates and prefetch speed, animated property icons.",
		"Filters and configuration persist in the query params with nuqs, so a view is shareable, and in localStorage, so the experience stays cohesive. I considered per-user configuration, but didn't want to blow up this work with a new table and migrations.",
		"The drawers use useMeasure, so they transition smoothly as you move up and down the table and back and forth through the history.",
		"Systems thinking: different row components on the table, the exact same drawer. The meeting notes have two more variants of the component, again with the same drawer.",
		"Ask Tato in chat to update an item, and watch it write back.",
	],
};

/** Left out for time; its goals move to the slide before it. */
const SKIPPED = new Set(["Starting point"]);

/** Notes added after a shared slide's own. */
const RAID_EXTRA: Record<string, string[]> = {
	"Why RAID matters": [
		"The company vision is to automate your work so you can deliver on time and on budget.",
		"The goal: make RAID trustworthy and intuitive to manage, centralise all RAID management in Tato, and move users off spreadsheets.",
	],
};

export const SLIDES: Slide[] = [
	{
		section: "RAID log",
		label: "Title",
		body: (
			<Title
				title="Closing the loop on an AI native RAID log"
				sub="How I built an agentic RAID log to automate manual work, and the effects library that came out of telling its story."
				meta={[
					{
						label: "Team",
						value: "Me on design and front-end. Alex Hermann on backend. Benjamin Ryan for customer success.",
					},
					{ label: "Timeline", value: "RAID from July 2026, shipped in September. shad-fx since." },
					{ label: "Role", value: "No PM, so I was acting PM and design engineer" },
				]}
			/>
		),
		notes: [
			"Why these projects: they share a common thread, designing for humans and agents working together.",
			"RAID is about how people review and trust what an agent produces. How do we empower people to work better and faster with AI, trusting it so much that they ditch their old tools?",
			"shad-fx is designed so agents can use and extend it. It hints at the kind of work I'd love to do at Lovable: go deep on craft and delight, experiment, and turn it into something reusable for the team and the community.",
			"I'm starting with RAID because it shows my work as a product thinker, product designer, and design engineer.",
			"Small team: I owned design and front-end, 16 PRs on the RAID log alone. Alex Hermann on backend, Benjamin Ryan for customer success. No PM, so I was acting PM.",
		],
	},
	...RAID_SLIDES.filter((slide) => !SKIPPED.has(slide.label)).map((slide) => {
		if (RAID_NOTES[slide.label]) return { ...slide, notes: RAID_NOTES[slide.label] };
		if (RAID_EXTRA[slide.label]) return { ...slide, notes: [...slide.notes, ...RAID_EXTRA[slide.label]] };
		return slide;
	}),
	...SHAD_FX,
	CLOSE,
];
