import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Gallery } from "./Gallery";
import { Playground } from "./Playground";
import { Snippet } from "./Snippet";

export const metadata: Metadata = {
	title: "Dither FX",
	description:
		"Ordered-dither canvas effects for React — fire, lightning, sonar rings, a light beam and a sloshing fluid. Installed with the shadcn CLI.",
	openGraph: {
		title: "Dither FX",
		description: "Ordered-dither canvas effects for React",
		type: "article",
	},
	alternates: { canonical: "/dither-fx" },
};

function Section({
	title,
	id,
	children,
}: {
	title: string;
	id: string;
	children: ReactNode;
}) {
	return (
		<section id={id} className="flex scroll-mt-8 flex-col gap-4">
			<h2 className="text-[20px] leading-[1.35] font-[550] text-gray-900">
				{title}
			</h2>
			{children}
		</section>
	);
}

function P({ children }: { children: ReactNode }) {
	return (
		<p className="text-[15px] leading-[1.65] font-[420] text-gray-500">
			{children}
		</p>
	);
}

function Code({ children }: { children: ReactNode }) {
	return (
		<code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[13px] text-gray-900">
			{children}
		</code>
	);
}

interface Row {
	key: string;
	cells: ReactNode[];
}

function Table({ head, rows }: { head: string[]; rows: Row[] }) {
	return (
		<div className="overflow-x-auto">
			<table className="w-full border-collapse text-left">
				<thead>
					<tr className="border-b border-gray-200">
						{head.map((cell) => (
							<th
								key={cell}
								className="py-2 pr-4 font-mono text-[11px] font-[450] tracking-wide text-gray-400 uppercase"
							>
								{cell}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row) => (
						<tr key={row.key} className="border-b border-gray-100 align-top">
							{row.cells.map((cell, column) => (
								<td
									key={`${row.key}:${head[column]}`}
									className="py-2.5 pr-4 text-[14px] leading-[1.55] font-[420] text-gray-500"
								>
									{cell}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

const USAGE = `import { DitherCanvas, fire } from "@/components/dither-fx";
import { useMemo } from "react";

export function Card() {
  const effect = useMemo(() => fire({ colors: ["#e5343a", "#f05100", "#fcbb00"] }), []);

  return (
    <div className="relative overflow-hidden rounded-lg">
      <DitherCanvas effect={effect} />
      <p className="relative">Burning</p>
    </div>
  );
}`;

const REGISTRY_CONFIG = `{
  "registries": {
    "@sekei": "https://www.sekei.xyz/registry/{name}.json"
  }
}`;

export default function DitherFxDocs() {
	return (
		<div className="min-h-screen bg-white">
			<div className="mx-auto w-full max-w-3xl px-5 py-10 md:py-16">
				<header className="flex flex-col gap-6">
					<Link
						href="/"
						className="w-fit font-mono text-[12px] font-[450] text-gray-400 hover:text-gray-900"
					>
						← sekei.xyz
					</Link>
					<div className="flex flex-col gap-3">
						<h1 className="text-[32px] leading-[1.15] font-[550] text-gray-900 md:text-[40px]">
							Dither FX
						</h1>
						<p className="max-w-xl text-[17px] leading-[1.55] font-[420] text-gray-500">
							Ordered-dither canvas effects for React. Fire, lightning, sonar
							rings, a light beam and a sloshing fluid, painted as Bayer
							thresholded cells over a pixelated canvas.
						</p>
					</div>
					<Snippet code="npx shadcn@latest add @sekei/dither-fx" />
				</header>

				<main className="mt-14 flex flex-col gap-14">
					<section className="flex flex-col gap-4">
						<Playground />
					</section>

					<Section title="Effects" id="effects">
						<P>
							Every effect is a factory returning a <Code>DitherEffect</Code>.
							Colours take a hex string or an <Code>[r, g, b]</Code> tuple.
						</P>
						<Gallery />
						<Table
							head={["Effect", "Options"]}
							rows={[
								{
									key: "fire",
									cells: [
										<Code key="n">fire</Code>,
										"colors (cold → hot), height, rate, embers",
									],
								},
								{
									key: "bolt",
									cells: [
										<Code key="n">bolt</Code>,
										"color, interval as [min, max] seconds, target, rate",
									],
								},
								{
									key: "rings",
									cells: [
										<Code key="n">rings</Code>,
										"color, origin, interval, speed, width",
									],
								},
								{
									key: "fluid",
									cells: [
										<Code key="n">fluid</Code>,
										"color, level, slosh, tempo, bubbles",
									],
								},
								{
									key: "beam",
									cells: [
										<Code key="n">beam</Code>,
										"color, origin (x only), spread, motes",
									],
								},
							]}
						/>
						<P>
							<Code>origin</Code> and <Code>target</Code> take an{" "}
							<Code>Anchor</Code>: an <Code>[x, y]</Code> pair in 0–1 of the
							box, or a getter, which is re-read on every resize so an effect
							can track something measured from the DOM.
						</P>
					</Section>

					<Section title="Install" id="install">
						<P>Add the registry to your components.json once:</P>
						<Snippet code={REGISTRY_CONFIG} />
						<P>Then take the whole library, or one effect:</P>
						<Snippet
							code={
								"npx shadcn@latest add @sekei/dither-fx\nnpx shadcn@latest add @sekei/dither-fx-fire"
							}
						/>
						<P>Without the registries entry, the full URL works too:</P>
						<Snippet code="npx shadcn@latest add https://www.sekei.xyz/registry/dither-fx.json" />
						<P>
							Files land under <Code>components/dither-fx/</Code> and{" "}
							<Code>hooks/</Code>, following your components.json aliases.
						</P>
						<Table
							head={["Item", "Pulls in"]}
							rows={[
								{
									key: "dither-fx",
									cells: [
										<Code key="n">dither-fx</Code>,
										"Everything below, plus an index.ts barrel",
									],
								},
								{
									key: "canvas",
									cells: [
										<Code key="n">dither-fx-canvas</Code>,
										"Engine, the reduced-motion hook, utils",
									],
								},
								{
									key: "fire",
									cells: [<Code key="n">dither-fx-fire</Code>, "Canvas"],
								},
								{
									key: "rings",
									cells: [<Code key="n">dither-fx-rings</Code>, "Canvas"],
								},
								{
									key: "beam",
									cells: [<Code key="n">dither-fx-beam</Code>, "Canvas"],
								},
								{
									key: "bolt",
									cells: [<Code key="n">dither-fx-bolt</Code>, "Canvas"],
								},
								{
									key: "fluid",
									cells: [<Code key="n">dither-fx-fluid</Code>, "Canvas"],
								},
								{
									key: "engine",
									cells: [
										<Code key="n">dither-fx-engine</Code>,
										"Nothing — painter, seeded RNG, colour helpers",
									],
								},
								{
									key: "hook",
									cells: [
										<Code key="n">use-prefers-reduced-motion</Code>,
										"Nothing",
									],
								},
							]}
						/>
					</Section>

					<Section title="Usage" id="usage">
						<P>
							The canvas fills its nearest positioned ancestor, so give the
							parent <Code>relative</Code>.
						</P>
						<Snippet code={USAGE} />
						<P>
							Build the effect once. A new <Code>effect</Code> reference
							restarts the simulation — the canvas and its observer survive, but
							particles and heat fields reset. Use <Code>useMemo</Code> with the
							options in the dependency array, or module scope when the options
							are constant.
						</P>
						<Table
							head={["Prop", "Default", "Notes"]}
							rows={[
								{
									key: "effect",
									cells: [
										<Code key="n">effect</Code>,
										"—",
										"The effect to run. Keep the reference stable.",
									],
								},
								{
									key: "active",
									cells: [
										<Code key="n">active</Code>,
										<Code key="v">true</Code>,
										"Eases in and out. Drive it from hover for a reveal.",
									],
								},
								{
									key: "cell",
									cells: [
										<Code key="n">cell</Code>,
										<Code key="v">3</Code>,
										"CSS px per dither cell. Lower is finer and costlier.",
									],
								},
								{
									key: "seed",
									cells: [
										<Code key="n">seed</Code>,
										<Code key="v">1</Code>,
										"Seeds the RNG, so a given seed replays identically.",
									],
								},
								{
									key: "max",
									cells: [
										<Code key="n">maxCols / maxRows</Code>,
										<Code key="v">640 / 400</Code>,
										"Ceiling on the backing grid.",
									],
								},
								{
									key: "className",
									cells: [
										<Code key="n">className</Code>,
										"—",
										"Merged onto the wrapper.",
									],
								},
							]}
						/>
						<P>
							The element is <Code>aria-hidden</Code> and{" "}
							<Code>pointer-events-none</Code>: it is decoration, and never the
							only carrier of meaning.
						</P>
					</Section>

					<Section title="Reduced motion" id="reduced-motion">
						<P>
							The canvas reads <Code>prefers-reduced-motion</Code> through{" "}
							<Code>useSyncExternalStore</Code>, so it is correct on the server
							and updates when the setting changes. Under reduce, each effect
							paints one settled frame and stops: fire is pre-warmed and still,
							rings sit at three fixed radii, particles are dropped. Nothing
							animates and the frame loop parks.
						</P>
					</Section>

					<Section title="Cost" id="cost">
						<P>
							The engine runs <Code>requestAnimationFrame</Code> only while
							something is changing, and stops once the eased intensity has
							settled and the effect reports <Code>idle()</Code>. An inactive
							effect costs nothing. Each frame is one <Code>putImageData</Code>{" "}
							over a grid capped at 640×400 cells, not a <Code>fillRect</Code>{" "}
							per cell.
						</P>
					</Section>

					<Section title="Credit" id="credit">
						<P>
							The ordered-dither rendering here, meaning the low-resolution
							backing canvas scaled up pixelated, the Bayer threshold matrix,
							and filling every cell at one of two alpha tiers rather than
							leaving holes, derives from{" "}
							<a
								href="https://github.com/Boring-Software-Inc/dither-kit"
								className="text-gray-900 underline underline-offset-2"
							>
								dither-kit
							</a>{" "}
							under the MIT licence. The effects, the painter, the frame loop
							and the reduced-motion handling are not.
						</P>
					</Section>
				</main>

				<footer className="mt-16 border-t border-gray-200 pt-6">
					<p className="text-[13px] leading-[1.5] font-[420] text-gray-400">
						Built by{" "}
						<Link href="/" className="text-gray-500 hover:text-gray-900">
							PG Gonni
						</Link>
						. Source lives in components/dither-fx.
					</p>
				</footer>
			</div>
		</div>
	);
}
