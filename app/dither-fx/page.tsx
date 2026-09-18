import type { Metadata } from "next";
import Link from "next/link";
import { Effects } from "./Effects";
import { Install } from "./Install";
import { Playground } from "./Playground";
import { A, Code, P, Section } from "./Prose";
import { Snippet } from "./Snippet";
import { Usage } from "./Usage";

const REPO = "https://github.com/sekeidesign/dither-fx";

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
						<div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
							<h1 className="text-[32px] leading-[1.15] font-[550] text-gray-900 md:text-[40px]">
								Dither FX
							</h1>
							<a
								href={REPO}
								className="font-mono text-[12px] font-[450] text-gray-400 hover:text-gray-900"
							>
								sekeidesign/dither-fx ↗
							</a>
						</div>
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

					<Effects />
					<Install />
					<Usage />

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
							backing canvas scaled up pixelated, the Bayer threshold matrix, and
							filling every cell at one of two alpha tiers rather than leaving
							holes, derives from{" "}
							<A href="https://github.com/Boring-Software-Inc/dither-kit">
								dither-kit
							</A>{" "}
							under the MIT licence. The effects, the painter, the frame loop and
							the reduced-motion handling are not.
						</P>
					</Section>
				</main>

				<footer className="mt-16 border-t border-gray-200 pt-6">
					<p className="text-[13px] leading-[1.5] font-[420] text-gray-400">
						Built by{" "}
						<Link href="/" className="text-gray-500 hover:text-gray-900">
							PG Gonni
						</Link>
						.{" "}
						<a href={REPO} className="text-gray-500 hover:text-gray-900">
							Source on GitHub
						</a>
						.
					</p>
				</footer>
			</div>
		</div>
	);
}
