import type { Metadata } from "next";
import Link from "next/link";
import { BackLink } from "@ui-kit/BackLink";
import { GithubIcon } from "@ui-kit/icons/GithubIcon";
import { SparkleDivider } from "@ui-kit/SparkleDivider";
import { Effects } from "./Effects";
import { Install } from "./Install";
import { Playground } from "./Playground";
import { A, Code, P, Section } from "./Prose";
import { Snippet } from "./Snippet";
import { Usage } from "./Usage";

const REPO = "https://github.com/sekeidesign/dither-fx";

// The shell from app/(site)/layout.tsx, rebuilt because this page sits outside
// that group on purpose: no sidebar, no timeline.
const GUTTER =
	"panel stripes hidden flex-1 shrink md:sticky md:top-px md:block md:h-[calc(100vh-2px)] md:self-start";

export const metadata: Metadata = {
	title: "dither-fx",
	description:
		"Dither environmental canvas effects for React — fire, lightning, sonar rings, a light beam, a sloshing fluid, rain and snow. Installed with the shadcn CLI.",
	openGraph: {
		title: "dither-fx",
		description: "Dither environmental canvas effects for React",
		type: "article",
	},
	alternates: { canonical: "/dither-fx" },
};

export default function DitherFxDocs() {
	return (
		<div className="mx-auto box-border flex min-h-screen w-full flex-col justify-center gap-px p-px md:flex-row">
			<div aria-hidden="true" className={GUTTER} />

			<div className="panel flex w-full min-w-0 flex-col md:max-w-screen-md">
				<div className="flex flex-col p-4 md:p-6">
					<header className="flex flex-col gap-6">
						<div className="flex items-center justify-between gap-3">
							<BackLink label="sekei.xyz" />
							<a
								href={REPO}
								target="_blank"
								rel="noopener noreferrer"
								// The back link's chip, mirrored on the right.
								className="inline-flex h-6.5 w-fit items-center gap-1 rounded-full bg-white pr-2 pl-1.5 text-[14px] font-[500] text-gray-500 shadow-skew ring-1 ring-gray-500/10 hover:bg-gray-50"
							>
								<GithubIcon size={14} />
								GitHub
							</a>
						</div>
						<div className="flex flex-col gap-3">
							<h1 className="font-pixel text-5xl leading-[1.1] text-gray-900 md:text-6xl">
								dither-fx
							</h1>
							<p className="max-w-xl text-base leading-[1.55] font-[420] text-gray-500">
								Bayer dithered environmental effects for React. Rendered on a tiny canvas, using a single <Code>ImageData</Code> instance per frame, and upscaled with CSS <Code>image-rendering: pixelated</Code> to keep each frame fast and GPU accelerated.
							</p>
						</div>
						<Snippet code="npx shadcn@latest add @sekei/dither-fx" />
						<Playground />
					<SparkleDivider className="mt-10 mb-10" />
					</header>


					<main className="flex flex-col gap-14">
						<Install />
						<Usage />
						<Effects />

						<Section title="Reduced motion" id="reduced-motion">
							<P>
								The canvas reads <Code>prefers-reduced-motion</Code> through{" "}
								<Code>useSyncExternalStore</Code>, so it is correct on the server
								and updates when the setting changes. Under reduce, each effect
								paints one settled frame and stops: fire is pre-warmed and still,
								rings sit at three fixed radii, rain and snow hang mid-fall,
								particles are dropped. Nothing
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

			<div aria-hidden="true" className={GUTTER} />
		</div>
	);
}
