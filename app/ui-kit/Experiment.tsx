"use client";

import { Tooltip } from "@ark-ui/react/tooltip";
import { CommandLineIcon } from "@heroicons/react/16/solid";
import { AnimatePresence, m, useInView } from "motion/react";
import Link from "next/link";
import {
	createContext,
	type ReactNode,
	useContext,
	useMemo,
	useRef,
	useState,
} from "react";
import { cn } from "./cn";

interface ExperimentContextValue {
	sourceUrl?: string;
	isRootInView?: boolean;
}

const ExperimentContext = createContext<ExperimentContextValue>({});

interface ExperimentRootProps {
	children: ReactNode;
	sourceUrl?: string;
	className?: string;
}

export function Experiment({
	children,
	sourceUrl,
	className,
}: ExperimentRootProps) {
	const ref = useRef<HTMLDivElement>(null);
	const isRootInView = useInView(ref, { once: false, amount: "some" });
	const context = useMemo(
		() => ({ sourceUrl, isRootInView }),
		[sourceUrl, isRootInView],
	);

	return (
		<ExperimentContext.Provider value={context}>
			<m.div
				ref={ref}
				className="flex gap-px w-full"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.2, ease: "easeInOut" }}
			>
				<div
					aria-hidden="true"
					className="panel flex-1 shrink xl:block hidden stripes"
				/>
				<div
					className={cn(
						"flex flex-col gap-4 w-full flex-4 grow-20 xl:max-w-screen-md shrink-0 panel md:p-6 p-4",
						className,
					)}
				>
					{children}
				</div>
				<div
					aria-hidden="true"
					className="panel flex-1 shrink xl:block hidden stripes"
				/>
			</m.div>
		</ExperimentContext.Provider>
	);
}

interface ExperimentTitleProps {
	children: ReactNode;
	pageUrl: string;
}

const ExperimentTitle = ({ children, pageUrl }: ExperimentTitleProps) => {
	const [hovering, setHovering] = useState(false);

	return (
		<Link
			href={pageUrl}
			onMouseEnter={() => setHovering(true)}
			onMouseLeave={() => setHovering(false)}
			className="flex items-center gap-1"
		>
			<h2 className="text-xl text-gray-800 font-[500] leading-none">
				{children}
			</h2>
			<AnimatePresence mode="popLayout" initial={false}>
				{hovering && (
					<m.svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={2.5}
						stroke="currentColor"
						className="size-3.5 text-gray-500 mt-0.5"
						aria-hidden="true"
						focusable="false"
						initial={{ x: -4, y: 4, opacity: 0 }}
						animate={{ x: 0, y: 0, opacity: 1 }}
						exit={{ x: 4, y: -4, opacity: 0 }}
						transition={{ duration: 0.2, type: "spring", bounce: 0 }}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
						/>
					</m.svg>
				)}
			</AnimatePresence>
		</Link>
	);
};

interface ExperimentTagsProps {
	children: ReactNode;
}

const ExperimentTags = ({ children }: ExperimentTagsProps) => {
	return (
		<ul
			className="flex items-center gap-2 w-full overflow-x-auto -ml-3 pl-3"
			style={{
				maskImage:
					"linear-gradient(to right, transparent 0px, black 12px, black calc(100% - 12px), transparent 100%)",
			}}
		>
			{children}
		</ul>
	);
};

interface ExperimentTagProps {
	children: ReactNode;
}

const ExperimentTag = ({ children }: ExperimentTagProps) => {
	return (
		<li className="text-xs font-[450] font-mono whitespace-nowrap text-gray-500 bg-gray-200/60 p-1 px-2 w-fit rounded-lg">
			{children}
		</li>
	);
};

interface ExperimentExampleProps {
	children: ReactNode;
	className?: string;
}

const ExperimentExample = ({ children, className }: ExperimentExampleProps) => {
	const { sourceUrl, isRootInView } = useContext(ExperimentContext);

	return (
		<div
			className={cn(
				"relative shadow-skew size-24 flex items-center justify-center rounded-xl ring-1 ring-gray-200 w-full p-10 min-h-[240px] h-fit bg-white overflow-hidden",
				className,
			)}
		>
			{sourceUrl && (
				<Tooltip.Root
					positioning={{ placement: "top" }}
					openDelay={0}
					closeDelay={0}
				>
					<Tooltip.Trigger asChild>
						<Link
							href={sourceUrl}
							target="_blank"
							className="absolute top-2 right-2 bg-gray-200/60 hover:bg-gray-200 hover:text-gray-700 size-7 flex items-center justify-center rounded-md text-gray-500"
						>
							<CommandLineIcon className="w-4 h-4" />
						</Link>
					</Tooltip.Trigger>
					<Tooltip.Positioner>
						<Tooltip.Content className="bg-gray-900 text-gray-50 font-[450] p-2 py-1 text-xs rounded-md">
							View source code
						</Tooltip.Content>
					</Tooltip.Positioner>
				</Tooltip.Root>
			)}
			{isRootInView && children}
		</div>
	);
};

interface ExperimentDescriptionProps {
	children: ReactNode;
}

/** Takes its own paragraphs, so prose isn't one <p> broken up by <br />s. */
const ExperimentDescription = ({ children }: ExperimentDescriptionProps) => {
	return (
		<div className="space-y-4 text-sm text-gray-500 font-[420] leading-relaxed">
			{children}
		</div>
	);
};

export function ExperimentDivider({ inline = false }: { inline?: boolean }) {
	return (
		<m.div
			aria-hidden="true"
			className="flex gap-px w-full"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.2, ease: "easeInOut" }}
		>
			<div
				className={cn(
					"panel flex-1 shrink ",
					inline ? "hidden" : "xl:block hidden",
				)}
			/>
			<div
				className={cn(
					"flex gap-4 w-full h-10 flex-4 grow-20 xl:max-w-screen-md shrink-0 panel items-center justify-center",
					inline ? "p-0" : "md:p-6 p-4",
				)}
			>
				<span className="block w-full border-t border-gray-200" />
				<svg
					viewBox="0 0 15 15"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="size-4 text-gray-200 shrink-0"
				>
					<path
						d="M6.59 0.33C6.75-0.11 7.37-0.11 7.53 0.33L9.14 4.68C9.19 4.82 9.3 4.93 9.44 4.98L13.79 6.59C14.23 6.75 14.23 7.37 13.79 7.53L9.44 9.14C9.3 9.19 9.19 9.3 9.14 9.44L7.53 13.79C7.37 14.23 6.75 14.23 6.59 13.79L4.98 9.44C4.93 9.3 4.82 9.19 4.68 9.14L0.33 7.53C-0.11 7.37-0.11 6.75 0.33 6.59L4.68 4.98C4.82 4.93 4.93 4.82 4.98 4.68L6.59 0.33Z"
						fill="currentColor"
					/>
				</svg>
				<span className="block w-full border-t border-gray-200" />
			</div>
			<div
				className={cn(
					"panel flex-1 shrink ",
					inline ? "hidden" : "xl:block hidden",
				)}
			/>
		</m.div>
	);
}

// Statics, not exports: `export const Experiment = Object.assign(...)` exports a
// plain object, which breaks the Fast Refresh component boundary for the whole
// file. Attaching to the declared component keeps the `<Experiment.Title>` API.
Experiment.Title = ExperimentTitle;
Experiment.Tags = ExperimentTags;
Experiment.Tag = ExperimentTag;
Experiment.Example = ExperimentExample;
Experiment.Description = ExperimentDescription;

export type {
	ExperimentDescriptionProps,
	ExperimentExampleProps,
	ExperimentRootProps,
	ExperimentTagProps,
	ExperimentTagsProps,
	ExperimentTitleProps,
};
