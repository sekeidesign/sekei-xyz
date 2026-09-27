"use client";

import { Avatar } from "@ui-kit/Avatar";
import { Button } from "@ui-kit/Button";
import { CaseStudyLink } from "@ui-kit/CaseStudyLink";
import { CodeBlock } from "@ui-kit/code/CodeBlock";
import { Contributions } from "@ui-kit/Contributions";
import { CopyIcon } from "@ui-kit/icons/CopyIcon";
import { FireIcon } from "@ui-kit/icons/FireIcon";
import { ResetIcon } from "@ui-kit/icons/ResetIcon";
import { NextCaseStudy } from "@ui-kit/NextCaseStudy";
import { FramedIcon } from "@ui-kit/post/FramedIcon";
import { Problems } from "@ui-kit/Problems";
import { Quote } from "@ui-kit/Quote";
import { SparkleDivider } from "@ui-kit/SparkleDivider";
import { SocialBar } from "@ui-kit/social/SocialBar";
import { SocialProvider } from "@ui-kit/social/SocialProvider";
import { StarRating } from "@ui-kit/StarRating";
import { Surface } from "@ui-kit/Surface";
import { TagRow } from "@ui-kit/TagRow";
import { TextLink } from "@ui-kit/TextLink";
import { TooltipTrigger } from "@ui-kit/Tooltip";

export function Tooltips() {
	return (
		<div className="flex items-center gap-2">
			{[
				["Copy link", <CopyIcon key="copy" />],
				["React with fire", <FireIcon key="fire" />],
				["Start over from the beginning", <ResetIcon key="reset" />],
			].map(([label, icon]) => (
				<TooltipTrigger
					key={label as string}
					payload={label as string}
					render={<Button iconOnly aria-label={label as string} />}
				>
					{icon}
				</TooltipTrigger>
			))}
		</div>
	);
}

export function TextLinks() {
	return (
		<p className="w-full max-w-md text-[15px] font-[420] leading-relaxed text-gray-500">
			I design and build at <TextLink href="https://tato.co" hasFavicon>Tato</TextLink>,
			ship experiments in{" "}
			<TextLink href="https://motion.dev" hasFavicon>Motion</TextLink>, and
			write about <TextLink href="https://www.sekei.xyz">what I learn</TextLink>.
		</p>
	);
}

export function Tags() {
	return (
		<div className="w-full max-w-sm">
			<TagRow
				tags={["motion", "base-ui", "tailwind", "webgpu", "react", "shaders", "canvas"]}
			/>
		</div>
	);
}

export function Avatars() {
	return (
		<div className="flex items-end gap-4">
			<Avatar size={24} />
			<Avatar size={40} />
			<Avatar size={64} />
		</div>
	);
}

export function Ratings() {
	return (
		<div className="flex flex-col items-center gap-3">
			<StarRating rating={5} />
			<StarRating rating={3} />
			<StarRating rating={1} size={20} />
		</div>
	);
}

export function PullQuote() {
	return (
		<div className="w-full max-w-lg">
			<Quote cite="Steve Jobs, 2003">
				<p>Design is not just what it looks like and feels like. Design is how it works.</p>
			</Quote>
		</div>
	);
}

export function ProblemList() {
	return (
		<div className="w-full max-w-lg">
			<Problems
				items={[
					"Nobody could tell which risks were already handled",
					"Decisions lived in meeting notes no one reread",
					"Every status update was written from scratch",
				]}
			/>
		</div>
	);
}

export function ContributionsDefault() {
	return (
		<div className="w-full max-w-lg">
			<Contributions prs={48} added={12840} removed={3120} />
		</div>
	);
}

export function ContributionsNote() {
	return (
		<div className="w-full max-w-lg">
			<Contributions prs={1} added={214} removed={380}>
				<p className="text-sm text-gray-500">
					Mostly deletions: the old table view went away.
				</p>
			</Contributions>
		</div>
	);
}

export function CaseStudyImage() {
	return (
		<div className="w-full max-w-md">
			<CaseStudyLink
				href="/p/role-metafy"
				title="Metafy"
				description="A coaching marketplace, and the Windows app that came after it."
				image="/casestudies/metafy-windows-app.webp"
			/>
		</div>
	);
}

export function CaseStudyPlaceholder() {
	return (
		<div className="w-full max-w-md">
			<CaseStudyLink
				href="/p/tato"
				title="Tato"
				description="Meeting intelligence for teams that run on decisions."
				image=""
			/>
		</div>
	);
}

export function NextStudy() {
	return (
		<div className="w-full max-w-md -mt-10">
			<NextCaseStudy href="/p/tato" title="Tato" />
		</div>
	);
}

export function FramedIcons() {
	return (
		<div className="flex items-end gap-4">
			<FramedIcon src="/logos/tato.webp" alt="Tato" size={20} />
			<FramedIcon src="/logos/metafy.webp" alt="Metafy" size={32} />
			<FramedIcon src="/logos/metalab.webp" alt="MetaLab" size={48} />
		</div>
	);
}

export function Divider() {
	return <SparkleDivider className="w-72 max-w-full" />;
}

export function QuoteThumb() {
	return (
		<div className="w-60 border-l-2 border-gray-200 pl-4">
			<p className="font-pixel text-xl leading-snug text-gray-800">
				Design is how it works.
			</p>
			<p className="mt-2 text-xs font-[450] text-gray-400">Steve Jobs</p>
		</div>
	);
}

export function CaseStudyThumb() {
	return (
		<div className="w-[340px] [&>a]:my-0">
			<CaseStudyLink
				href="/p/role-metafy"
				title="Metafy"
				description="A coaching marketplace, and the Windows app that came after it."
				image="/casestudies/metafy-windows-app.webp"
			/>
		</div>
	);
}

export function ContributionsThumb() {
	return (
		<div className="w-[350px] [&>div]:my-0">
			<Contributions prs={48} added={12840} removed={3120} />
		</div>
	);
}

export function NextStudyThumb() {
	return (
		<div className="w-full -mt-10 [&>a]:mb-0">
			<NextCaseStudy href="/p/tato" title="Tato" />
		</div>
	);
}

export function ProblemsThumb() {
	return (
		<div className="w-[320px] [&>div]:my-0">
			<Problems items={["Risks nobody owned", "Decisions lost in notes"]} />
		</div>
	);
}

export function SurfaceDefault() {
	return (
		<Surface className="w-full max-w-sm" inner={{ className: "flex flex-col gap-1 p-5" }}>
			<span className="font-mono text-[11px] font-[450] uppercase tracking-wide text-gray-400">
				Surface
			</span>
			<p className="text-[15px] font-[450] text-gray-900">
				A gray-100 frame holding a white card.
			</p>
		</Surface>
	);
}

export function SurfaceHeader() {
	return (
		<Surface className="w-full max-w-sm">
			<div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2.5">
				<span className="text-sm font-[550] text-gray-900">Title</span>
				<span className="text-sm font-[500] text-gray-400 tabular-nums">3</span>
			</div>
			<div className="h-24" />
		</Surface>
	);
}

const SOCIAL_SEED = { demo: { fire: 128, link: 42 } };

export function Social() {
	return (
		<SocialProvider slugs={["demo"]} transport="memory" seed={SOCIAL_SEED}>
			<SocialBar slug="demo" sharePath="/ui/social-bar" />
		</SocialProvider>
	);
}

export function CodeInstall() {
	return (
		<div className="w-full max-w-md">
			<CodeBlock code="npx shadcn@latest add @sekei/shad-fx" />
		</div>
	);
}

export function CodeTsx() {
	return (
		<div className="w-full max-w-2xl">
			<CodeBlock
				lang="tsx"
				code={`import { DitherCanvas } from "@/components/shad-fx";

export function Hero() {
  return <DitherCanvas effect={fire({ height: 0.6 })} cell={3} />;
}`}
			/>
		</div>
	);
}

export function CodeJson() {
	return (
		<div className="w-full max-w-2xl">
			<CodeBlock
				lang="json"
				code={`{
  "registries": {
    "@sekei": "https://www.sekei.xyz/registry/{name}.json"
  }
}`}
			/>
		</div>
	);
}

export function CodeFooter() {
	return (
		<div className="w-full max-w-md">
			<CodeBlock
				code="npx shadcn@latest add @sekei/shad-fx"
				footer={
					<p className="px-4 py-2.5 text-[13px] font-[420] text-gray-500">
						A white panel under the code, inside the same frame.
					</p>
				}
			/>
		</div>
	);
}

export function CodeThumb() {
	return (
		<div className="w-[560px]">
			<CodeBlock
				lang="tsx"
				code={`import { DitherCanvas } from "@/components/shad-fx";

export function Hero() {
  return <DitherCanvas effect={fire({ height: 0.6 })} cell={3} />;
}`}
			/>
		</div>
	);
}
