"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Bars2Icon, XMarkIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type RefObject, useEffect, useRef, useState } from "react";
import { Button } from "@ui-kit/Button";
import { cn } from "@ui-kit/cn";
import { FOCUS_RING } from "@ui-kit/focus";

interface NavGroup {
	group: string;
	entries: { slug: string; name: string }[];
}

const ITEM =
	"flex items-center h-7 px-2 rounded-md text-[14px] leading-[1.43] font-[500] whitespace-nowrap";
const ITEM_ON = "bg-white ring-1 ring-gray-500/10 shadow-skew text-gray-900";
const ITEM_OFF = "text-gray-500 hover:bg-gray-500/5 hover:text-gray-800";

export function SystemNav({ groups }: { groups: NavGroup[] }) {
	const [query, setQuery] = useState("");
	const [open, setOpen] = useState(false);
	const searchRef = useRef<HTMLInputElement>(null);
	const total = groups.reduce((sum, { entries }) => sum + entries.length, 0);

	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				searchRef.current?.focus();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	return (
		<>
			<Dialog.Root open={open} onOpenChange={setOpen}>
				<div className="panel sticky top-px z-30 flex h-12 shrink-0 items-center justify-between px-4 md:hidden">
					<Wordmark total={total} />
					<Dialog.Trigger
						render={<Button iconOnly aria-label="Open components menu" />}
					>
						<Bars2Icon className="size-4" />
					</Dialog.Trigger>
				</div>
				<Dialog.Portal>
					<Dialog.Popup className="panel fixed inset-px z-50 flex flex-col md:hidden">
						<Dialog.Title className="sr-only">Components</Dialog.Title>
						<div className="flex h-12 shrink-0 items-center justify-between px-4">
							<Wordmark total={total} onNavigate={() => setOpen(false)} />
							<Dialog.Close
								render={<Button iconOnly aria-label="Close components menu" />}
							>
								<XMarkIcon className="size-4" />
							</Dialog.Close>
						</div>
						<Filter query={query} onQuery={setQuery} />
						<Groups
							groups={groups}
							query={query}
							onNavigate={() => setOpen(false)}
							className="pb-6"
						/>
					</Dialog.Popup>
				</Dialog.Portal>
			</Dialog.Root>

			<aside
				aria-label="UI kit"
				className="panel sticky top-px hidden h-[calc(100vh-2px)] w-60 shrink-0 flex-col md:flex"
			>
				<div className="flex items-center justify-between gap-2 px-4 pt-4 pb-3">
					<Wordmark total={total} />
					<Link
						href="/"
						className={cn(
							"rounded-sm text-[13px] font-[500] text-gray-400 hover:text-gray-700",
							FOCUS_RING,
						)}
					>
						Site
					</Link>
				</div>
				<Filter query={query} onQuery={setQuery} inputRef={searchRef} shortcut />
				<Groups groups={groups} query={query} className="pb-4" />
			</aside>
		</>
	);
}

function Wordmark({
	total,
	onNavigate,
}: {
	total: number;
	onNavigate?: () => void;
}) {
	return (
		<Link
			href="/ui"
			onClick={onNavigate}
			className={cn("flex items-baseline gap-2 rounded-sm", FOCUS_RING)}
		>
			<span className="font-pixel text-xl leading-none text-gray-900">
				sekei/ui
			</span>
			<span className="font-mono text-[11px] text-gray-400 tabular-nums">
				{total}
			</span>
		</Link>
	);
}

function Filter({
	query,
	onQuery,
	inputRef,
	shortcut = false,
}: {
	query: string;
	onQuery: (query: string) => void;
	inputRef?: RefObject<HTMLInputElement | null>;
	/** Shows the ⌘K hint, which only means anything with a keyboard. */
	shortcut?: boolean;
}) {
	return (
		<div className="px-3 pb-3">
			<label className="relative block">
				<span className="sr-only">Filter components</span>
				<input
					ref={inputRef}
					type="search"
					value={query}
					placeholder="Filter"
					onChange={(event) => onQuery(event.target.value)}
					onKeyDown={(event) => {
						if (event.key === "Escape" && query) {
							event.stopPropagation();
							onQuery("");
						}
					}}
					className={cn(
						"h-7 w-full rounded-md bg-white pl-2 text-[13px] font-[420] text-gray-900 ring ring-gray-500/15 shadow-skew placeholder:text-gray-400 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-search-cancel-button]:hidden",
						shortcut ? "pr-9" : "pr-2",
					)}
				/>
				{shortcut && (
					<kbd className="pointer-events-none absolute top-1/2 right-1.5 -translate-y-1/2 rounded bg-gray-100 px-1 font-mono text-[10px] leading-4 text-gray-400 ring ring-gray-500/10">
						⌘K
					</kbd>
				)}
			</label>
		</div>
	);
}

function Groups({
	groups,
	query,
	onNavigate,
	className,
}: {
	groups: NavGroup[];
	query: string;
	onNavigate?: () => void;
	className?: string;
}) {
	const pathname = usePathname();
	const needle = query.trim().toLowerCase();
	const visible = groups
		.map(({ group, entries }) => ({
			group,
			entries: entries.filter((entry) =>
				entry.name.toLowerCase().includes(needle),
			),
		}))
		.filter(({ entries }) => entries.length > 0);

	return (
		<nav className={cn("flex-1 overflow-y-auto scroll-mask-y px-3", className)}>
			{visible.map(({ group, entries }) => (
				<div key={group} className="mb-4 last:mb-0">
					<h2 className="px-2 pb-1 font-mono text-[11px] leading-[1.3] font-[450] uppercase tracking-wide text-gray-400">
						{group}
					</h2>
					<ul className="flex flex-col gap-px">
						{entries.map(({ slug, name }) => {
							const href = `/ui/${slug}`;
							const active = pathname === href;
							return (
								<li key={slug}>
									<Link
										href={href}
										onClick={onNavigate}
										aria-current={active ? "page" : undefined}
										className={cn(ITEM, FOCUS_RING, active ? ITEM_ON : ITEM_OFF)}
									>
										{name}
									</Link>
								</li>
							);
						})}
					</ul>
				</div>
			))}
			{visible.length === 0 && (
				<p className="px-2 text-[13px] text-gray-400">Nothing matches “{query}”.</p>
			)}
		</nav>
	);
}
