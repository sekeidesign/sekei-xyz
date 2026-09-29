import Link from "next/link";
import { cn } from "@ui-kit/cn";
import { type Entry, groupAnchor, groupedEntries } from "./registry";

/**
 * Eased rather than linear, so overflow dissolves instead of hitting a hard
 * fade line. Near-opaque by the preview's 16px padding, so a preview that
 * starts there keeps a crisp edge and only what runs past it fades.
 */
const FADE = [
	[0, 0],
	[3, 0.1],
	[6, 0.34],
	[9, 0.62],
	[12, 0.84],
	[16, 0.96],
	[20, 1],
];

const EASE_STOPS = [
	...FADE.map(([px, a]) => `rgb(0 0 0 / ${a}) ${px}px`),
	...FADE.toReversed().map(([px, a]) => `rgb(0 0 0 / ${a}) calc(100% - ${px}px)`),
].join(", ");

const EDGE_MASK: React.CSSProperties = {
	maskImage: `linear-gradient(to right, ${EASE_STOPS}), linear-gradient(to bottom, ${EASE_STOPS})`,
	maskComposite: "intersect",
	WebkitMaskComposite: "source-in",
};

const DOTS =
	"dot-matrix [--dot-color:var(--color-gray-200)] [--dot-gap:14px] [--dot-size:0.75px]";

function Card({ entry }: { entry: Entry }) {
	const Preview = entry.Thumb ?? entry.examples[0].Component;

	return (
		<li className="group relative flex flex-col rounded-xl bg-white ring ring-gray-500/10 shadow-skew hover:ring-gray-500/20">
			{/* Children don't shrink, and safe centring pins a preview that's too big
			    to the top-left padding, so it overflows right and down into the
			    mask rather than being squashed or cut on both sides. */}
			<div
				inert
				style={EDGE_MASK}
				className={cn(
					"flex h-48 items-center-safe justify-center-safe overflow-hidden rounded-t-xl p-4 [&>*]:shrink-0",
					DOTS,
				)}
			>
				<Preview />
			</div>
			<div className="flex flex-col gap-0.5 px-4 pt-3 pb-4">
				<Link
					href={`/ui/${entry.slug}`}
					className="text-[15px] font-[550] text-gray-900 after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent"
				>
					{entry.name}
				</Link>
				<p className="line-clamp-2 text-[13px] leading-relaxed font-[420] text-gray-500">
					{entry.description}
				</p>
			</div>
		</li>
	);
}

export default function UiKitIndex() {
	return (
		<div className="flex flex-col gap-12">
			<header className="flex flex-col gap-3 pt-2">
				<h1 className="font-pixel text-4xl leading-none text-gray-900 md:text-5xl">
					UI kit
				</h1>
				<p className="max-w-lg text-[15px] leading-relaxed font-[420] text-gray-500">
					Reusable components from sekei.design.
				</p>
			</header>

			{groupedEntries().map(({ group, entries }) => (
				<section
					key={group}
					id={groupAnchor(group)}
					className="flex scroll-mt-10 flex-col gap-4"
				>
					<h2 className="flex items-center gap-2 text-xl font-[500] text-gray-900">
						{group}
						<span className="rounded-md bg-gray-500/5 px-1.5 font-mono text-[12px] leading-5 text-gray-400 ring ring-gray-500/10 tabular-nums">
							{entries.length}
						</span>
					</h2>
					<ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{entries.map((entry) => (
							<Card key={entry.slug} entry={entry} />
						))}
					</ul>
				</section>
			))}
		</div>
	);
}
