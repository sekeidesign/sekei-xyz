"use client";

import { m } from "motion/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import useMeasure from "react-use-measure";
import { Button } from "@ui-kit/Button";
import { BackIcon } from "@ui-kit/icons/BackIcon";
import { cn } from "@ui-kit/cn";
import { type Section, type Slide, stagger } from "./slides";

const WIDTH = 1280;
const HEIGHT = 720;
const FOOTER = 40;

const Agentation =
	process.env.NODE_ENV === "development"
		? dynamic(() => import("agentation").then((mod) => mod.Agentation), { ssr: false })
		: () => null;
const STEP = "disabled:cursor-default disabled:opacity-40 disabled:hover:bg-white";
const PAPER = "dot-matrix bg-gray-50 [--dot-color:var(--color-gray-200)] [--dot-gap:14px] [--dot-size:0.75px]";

type Message = { type: "goto"; index: number } | { type: "hello" };

function clamp(index: number, count: number) {
	return Math.max(0, Math.min(count - 1, index));
}

function readHash(count: number) {
	const n = Number.parseInt(window.location.hash.slice(1), 10);
	return Number.isNaN(n) ? 0 : clamp(n - 1, count);
}

/** Space and Enter belong to whatever control has focus; text fields keep every key. */
function ownsKey(target: EventTarget | null, key: string) {
	if (!(target instanceof HTMLElement)) return false;
	if (target.closest("input, textarea, select, [contenteditable]")) return true;
	return (key === " " || key === "Enter") && !!target.closest("button, a, [role=button]");
}

function useDeck(count: number, path: string) {
	const [index, setIndex] = useState(0);
	const channel = useRef<BroadcastChannel | null>(null);

	useEffect(() => {
		setIndex(readHash(count));
		// One channel per deck, so two decks open side by side don't steer each other.
		const bc = new BroadcastChannel(`sekei${path.replaceAll("/", "-")}`);
		channel.current = bc;
		bc.onmessage = ({ data }: MessageEvent<Message>) => {
			if (data.type === "goto") setIndex(data.index);
			if (data.type === "hello") bc.postMessage({ type: "goto", index: readHash(count) } satisfies Message);
		};
		bc.postMessage({ type: "hello" } satisfies Message);
		return () => bc.close();
	}, [count, path]);

	useEffect(() => {
		history.replaceState(null, "", `${window.location.search}#${index + 1}`);
	}, [index]);

	const go = useCallback((next: number) => {
		const target = clamp(next, count);
		setIndex(target);
		channel.current?.postMessage({ type: "goto", index: target } satisfies Message);
	}, [count]);

	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
			// The Agentation toolbar lives in a shadow root, which retargets
			// event.target to its host; the composed path still holds the field.
			const target = event.composedPath()[0] ?? null;
			if (ownsKey(target, event.key)) {
				if (event.key === "Escape" && target instanceof HTMLElement) target.blur();
				return;
			}
			const forward = ["ArrowRight", "ArrowDown", "PageDown", " "];
			const back = ["ArrowLeft", "ArrowUp", "PageUp"];
			if (forward.includes(event.key)) go(readHash(count) + 1);
			else if (back.includes(event.key)) go(readHash(count) - 1);
			else if (event.key === "Home" || event.key === "r") go(0);
			else if (event.key === "End") go(count - 1);
			else if (event.key === "p") window.open(`${path}?presenter#${readHash(count) + 1}`, `presenter${path}`);
			else if (event.key === "f") {
				if (document.fullscreenElement) document.exitFullscreen();
				else document.documentElement.requestFullscreen();
			} else return;
			event.preventDefault();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [go, count, path]);

	return { index, go };
}

/** A slide drawn at its design size and zoomed to fit its box, so figures reflow at the scale they were built for. */
function Scaled({
	slide,
	className,
	footer,
}: {
	slide: Slide;
	className?: string;
	footer?: ReactNode;
}) {
	const [ref, bounds] = useMeasure();
	const reserved = footer ? FOOTER : 0;
	const zoom = bounds.width ? Math.min(bounds.width / WIDTH, (bounds.height - reserved) / HEIGHT) : 0;

	return (
		<div ref={ref} className={cn("flex min-h-0 min-w-0 items-center justify-center", className)}>
			{zoom > 0 && (
				<div className="flex flex-col" style={{ width: WIDTH * zoom }}>
					<m.div
						key={slide.label}
						initial="hidden"
						animate="show"
						variants={stagger(0.1, 0.05)}
						style={{ width: WIDTH, height: HEIGHT, zoom }}
						className="shrink-0 overflow-hidden rounded-lg bg-gray-100 text-[15px] shadow-xl shadow-gray-900/5 ring-1 ring-gray-500/15"
					>
						{slide.body}
					</m.div>
					{footer && (
						<div className="flex items-center justify-between" style={{ height: FOOTER }}>
							{footer}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

interface DeckProps {
	slides: Slide[];
	sections: readonly Section[];
	/** The route the deck lives at, for the presenter window and the sync channel. */
	path: string;
}

export function Deck({ slides, sections, path }: DeckProps) {
	const [presenter, setPresenter] = useState(false);

	useEffect(() => {
		setPresenter(new URLSearchParams(window.location.search).has("presenter"));
	}, []);

	const deck = { ...useDeck(slides.length, path), slides, sections };
	return presenter ? <Presenter {...deck} /> : <Audience {...deck} />;
}

interface ViewProps {
	index: number;
	go: (index: number) => void;
	slides: Slide[];
	sections: readonly Section[];
}

function Audience({ index, go, slides: SLIDES }: ViewProps) {
	return (
		<main className={cn("flex h-dvh w-full px-10 pt-10", PAPER)}>
			<Scaled
				slide={SLIDES[index]}
				className="flex-1"
				footer={
					<>
						<div className="flex gap-1">
							<Button
								iconOnly
								aria-label="Previous slide"
								disabled={index === 0}
								onClick={() => go(index - 1)}
								className={STEP}
							>
								<ChevronLeftIcon className="size-4" />
							</Button>
							<Button
								iconOnly
								aria-label="Next slide"
								disabled={index === SLIDES.length - 1}
								onClick={() => go(index + 1)}
								className={STEP}
							>
								<ChevronRightIcon className="size-4" />
							</Button>
							<div aria-hidden="true" className="mx-1 h-4 w-px self-center bg-gray-500/15" />
							<Button
								iconOnly
								aria-label="Back to the first slide"
								disabled={index === 0}
								onClick={() => go(0)}
								className={STEP}
							>
								<BackIcon size={16} />
							</Button>
						</div>
						<span className="text-xs text-gray-400 tabular-nums">
							{index + 1} / {SLIDES.length}
						</span>
					</>
				}
			/>
			<Agentation endpoint="http://localhost:4747" appName="Presentation" useHashLocation />
		</main>
	);
}

function formatTime(ms: number) {
	const total = Math.max(0, Math.floor(ms / 1000));
	const m = Math.floor(total / 60);
	const s = total % 60;
	return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function useClock() {
	const [start, setStart] = useState<number | null>(null);
	const [now, setNow] = useState(0);

	useEffect(() => {
		if (start === null) return;
		setNow(Date.now());
		const timer = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(timer);
	}, [start]);

	return {
		running: start !== null,
		elapsed: start === null ? 0 : now - start,
		start: () => setStart(Date.now()),
		reset: () => setStart(null),
	};
}

function Presenter({ index, go, slides: SLIDES, sections: SECTIONS }: ViewProps) {
	const slide = SLIDES[index];
	const next = SLIDES[index + 1];
	const clock = useClock();

	let cumulative = 0;
	const sections = SECTIONS.map((section) => {
		cumulative += section.minutes;
		return { ...section, end: cumulative };
	});
	const current = sections.find((section) => section.name === slide.section);
	const behind = current && clock.elapsed > current.end * 60_000;
	const inSection = SLIDES.filter((s) => s.section === slide.section);

	return (
		<main className="grid h-dvh grid-cols-[1.4fr_1fr] gap-px bg-gray-200 p-px text-gray-900">
			<div className={cn("flex min-h-0 flex-col gap-4 rounded-sm p-5", PAPER)}>
				<Scaled slide={slide} className="flex-[3]" />
				<div className="flex min-h-0 flex-[2] gap-4">
					<div className="flex w-1/2 flex-col gap-2">
						<span className="text-xs font-[500] text-gray-400">Next</span>
						{next ? (
							<Scaled slide={next} className="flex-1" />
						) : (
							<span className="text-sm text-gray-500">End of deck</span>
						)}
					</div>
					<div className="flex w-1/2 flex-col gap-3">
						<span className="text-xs font-[500] text-gray-400">Sections</span>
						<ul className="flex flex-col gap-1 text-sm tabular-nums">
							{sections.map((section) => (
								<li
									key={section.name}
									className={cn(
										"flex justify-between rounded-md px-2 py-1",
										section.name === slide.section ? "bg-white text-gray-900 ring-1 ring-gray-500/10" : "text-gray-500",
									)}
								>
									<span>
										{section.name} · {section.minutes}m
									</span>
									<span>by {section.end}:00</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>

			<div className="panel flex min-h-0 flex-col">
				<header className="flex items-center justify-between gap-4 border-b border-gray-200 p-5">
					<div className="flex items-center gap-3">
						<span className={cn("font-pixel text-4xl tabular-nums", behind ? "text-red-600" : "text-gray-900")}>
							{formatTime(clock.elapsed)}
						</span>
						<Button onClick={clock.running ? clock.reset : clock.start} className="min-w-16 justify-center">
							{clock.running ? "Reset" : "Start"}
						</Button>
					</div>
					<div className="flex items-center gap-2 text-sm text-gray-500 tabular-nums">
						<Button
							iconOnly
							aria-label="Previous slide"
							disabled={index === 0}
							onClick={() => go(index - 1)}
							className={STEP}
						>
							<ChevronLeftIcon className="size-4" />
						</Button>
						<span>
							{index + 1} / {SLIDES.length}
						</span>
						<Button
							iconOnly
							aria-label="Next slide"
							disabled={index === SLIDES.length - 1}
							onClick={() => go(index + 1)}
							className={STEP}
						>
							<ChevronRightIcon className="size-4" />
						</Button>
					</div>
				</header>
				<div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6">
					<div className="flex flex-col gap-1">
						<span className="text-xs font-[500] text-gray-400">
							{slide.section} · {inSection.indexOf(slide) + 1} of {inSection.length}
						</span>
						<h1 className="text-xl font-[550]">{slide.label}</h1>
					</div>
					<ul className="flex flex-col gap-4 text-[22px] leading-snug text-gray-800">
						{slide.notes.map((note) => (
							<li key={note} className="text-pretty">
								{note}
							</li>
						))}
					</ul>
				</div>
			</div>
		</main>
	);
}
