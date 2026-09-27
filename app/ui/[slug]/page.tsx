import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/16/solid";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@ui-kit/Button";
import { CodeBlock } from "@ui-kit/code/CodeBlock";
import { GithubIcon } from "@ui-kit/icons/GithubIcon";
import { ICON_PRESS } from "@ui-kit/press";
import { TooltipTrigger } from "@ui-kit/Tooltip";
import { Canvas } from "../Canvas";
import { ENTRIES, getEntry, groupAnchor, REPO_BLOB } from "../registry";

export function generateStaticParams() {
	return ENTRIES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const entry = getEntry((await params).slug);
	return entry ? { title: entry.name, description: entry.description } : {};
}

export default async function EntryPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const entry = getEntry(slug);
	if (!entry) notFound();

	const index = ENTRIES.indexOf(entry);
	const prev = ENTRIES[index - 1];
	const next = ENTRIES[index + 1];
	const importPath = entry.source?.replace(/\.tsx?$/, "");

	return (
		<article className="flex flex-col gap-10">
			<header className="flex flex-col gap-4 pt-2">
				<div className="flex flex-col gap-2">
					<nav
						aria-label="Breadcrumb"
						className="flex items-center gap-1.5 font-mono text-[11px] leading-[1.3] font-[450] uppercase tracking-wide text-gray-400"
					>
						<Link href="/ui" className="rounded-sm hover:text-gray-700">
							UI kit
						</Link>
						<span aria-hidden="true">/</span>
						<Link
							href={`/ui#${groupAnchor(entry.group)}`}
							className="rounded-sm hover:text-gray-700"
						>
							{entry.group}
						</Link>
					</nav>
					<div className="flex items-center gap-2.5">
						<h1 className="text-3xl font-[550] tracking-tight text-gray-900">
							{entry.name}
						</h1>
						{entry.source && (
							<TooltipTrigger
								payload="View source"
								render={
									<Button
										iconOnly
										render={
											<Link
												href={`${REPO_BLOB}/app/ui-kit/${entry.source}`}
												target="_blank"
												rel="noopener noreferrer"
											/>
										}
									/>
								}
								aria-label="View source"
								className="group"
							>
								<GithubIcon className={ICON_PRESS} />
							</TooltipTrigger>
						)}
					</div>
					<p className="max-w-xl text-[15px] leading-relaxed font-[420] text-gray-500">
						{entry.description}
					</p>
				</div>
				{entry.exports && (
					<CodeBlock
						lang="tsx"
						code={`import { ${entry.exports.join(", ")} } from "@ui-kit/${importPath}";`}
						className="max-w-2xl"
					/>
				)}
			</header>

			<div className="flex flex-col gap-8">
				{entry.examples.map(({ name, Component, surface, bleed }) => (
					<Canvas key={name} name={name} surface={surface} bleed={bleed}>
						<Component />
					</Canvas>
				))}
			</div>

			<nav
				aria-label="More components"
				className="grid grid-cols-2 gap-3 border-t border-gray-200 pt-6"
			>
				{prev ? (
					<Link
						href={`/ui/${prev.slug}`}
						className="group flex flex-col gap-0.5 rounded-xl bg-white px-4 py-3 ring ring-gray-500/10 shadow-skew hover:ring-gray-500/20"
					>
						<span className="flex items-center gap-1 text-[13px] font-[500] text-gray-400">
							<ArrowLeftIcon className="size-3.5" />
							Previous
						</span>
						<span className="font-[550] text-gray-900">{prev.name}</span>
					</Link>
				) : (
					<span />
				)}
				{next && (
					<Link
						href={`/ui/${next.slug}`}
						className="group flex flex-col items-end gap-0.5 rounded-xl bg-white px-4 py-3 ring ring-gray-500/10 shadow-skew hover:ring-gray-500/20"
					>
						<span className="flex items-center gap-1 text-[13px] font-[500] text-gray-400">
							Next
							<ArrowRightIcon className="size-3.5" />
						</span>
						<span className="font-[550] text-gray-900">{next.name}</span>
					</Link>
				)}
			</nav>
		</article>
	);
}
