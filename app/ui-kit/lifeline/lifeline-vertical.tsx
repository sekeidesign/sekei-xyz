"use client";

import {
	forwardRef,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	type CSSProperties,
} from "react";
import { Film, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "../cn";
import { LifelineEventText } from "./lifeline-event";
import {
	getLifelineEventEffect,
	getLifelineEventImage,
	getLifelineEventKey,
	getLifelineEventTitle,
} from "./lifeline-event-utils";
import { useLifelineFireworks } from "./lifeline-fireworks";
import {
	LifelineLightbox,
	type LifelineLightboxStart,
} from "./lifeline-lightbox";
import { LifelineCaseStudiesButton } from "./lifeline-case-studies-button";
import { LifelinePeople } from "./lifeline-people";
import { aggregateLifelinePeople } from "./lifeline-people-utils";
import type { LifelineEvent, LifelineMarker, LifelineProps } from "./types";
import { getMarkerHeight, hasMarkerContent } from "./lifeline-utils";
import { useLifelineIntro } from "./use-lifeline-intro";
import { useLifelineVerticalScroll } from "./use-lifeline-vertical-scroll";

const GRID_CLASS = "grid grid-cols-[1rem_1fr] gap-x-3";
const RAIL_LEFT = "0.5rem";

/**
 * Above this many entries, the delay-armed intro fades would promote every
 * entry to a compositor layer at once and crash mobile Safari. Longer
 * timelines fade entries in as they enter the viewport instead.
 */
const MAX_ARMED_ENTRIES = 80;

function RailTick() {
	return (
		<span
			aria-hidden="true"
			className="block h-[6px] w-[6px] bg-zinc-400 transition-colors duration-300 rounded-full"
		/>
	);
}

function MediaIcon({ video }: { video?: string }) {
	const Icon = video ? Film : ImageIcon;
	return (
		<Icon
			className="ml-0.5 inline-block h-3 w-3 -translate-y-px text-zinc-400 transition-colors duration-300"
			strokeWidth={1.75}
			aria-hidden="true"
		/>
	);
}

/**
 * One event line. Touch layouts have no hover reveal, so an event with media
 * becomes tappable and expands into the lightbox from its text.
 * `interactive={false}` drops that — the icon still hints at the photos.
 */
function LifelineVerticalEvent({
	event,
	interactive = true,
}: {
	event: LifelineEvent;
	interactive?: boolean;
}) {
	const fireworks = useLifelineFireworks();
	const image = getLifelineEventImage(event);
	const effect = getLifelineEventEffect(event);
	const textRef = useRef<HTMLParagraphElement>(null);
	const aspectRef = useRef(3 / 4);
	const [lightboxStart, setLightboxStart] =
		useState<LifelineLightboxStart | null>(null);

	// The event text has no card geometry — synthesize a seed centered on it,
	// carrying the media's aspect.
	const measureText = useCallback((): LifelineLightboxStart | null => {
		const el = textRef.current;
		if (!el) return null;
		const rect = el.getBoundingClientRect();
		const w = 96;
		return {
			cx: rect.left + rect.width / 2,
			cy: rect.top + rect.height / 2,
			w,
			h: w * aspectRef.current,
		};
	}, []);

	const openMedia = () => {
		if (!image || lightboxStart) return;
		// The poster sets the frame; for videos it shares the clip's aspect.
		const probe = new window.Image();
		probe.src = image.src;
		const open = () => {
			if (probe.naturalWidth > 0) {
				aspectRef.current = probe.naturalHeight / probe.naturalWidth;
			}
			setLightboxStart(measureText());
		};
		if (probe.complete) {
			open();
		} else {
			probe.onload = open;
			probe.onerror = open;
		}
	};

	const activate = !interactive
		? undefined
		: image
			? openMedia
			: effect && fireworks
				? () => fireworks.launch(effect)
				: undefined;

	return (
		<>
			<p
				ref={textRef}
				className={cn(
					"max-w-full text-left text-sm leading-[1.55] tracking-[-0.01em]",
					activate && "cursor-pointer",
				)}
				// The line can hold links, so it can't be a control itself. The media
				// icon below is the real button; this is a redundant click area, and
				// an entry whose only action is the fireworks has no keyboard path.
				onClick={activate}
			>
				<LifelineEventText event={event} />
				{image && (
					// Glued to the last word with a no-break space so the icon
					// can never wrap onto a line of its own.
					<span className="whitespace-nowrap">
						{" "}
						{interactive ? (
							<button
								type="button"
								aria-label={image.video ? "Play clip" : "View photo"}
								onClick={(event) => {
									event.stopPropagation();
									openMedia();
								}}
								className="inline-flex cursor-pointer appearance-none border-0 bg-transparent p-0 align-baseline leading-none"
							>
								<MediaIcon video={image.video} />
							</button>
						) : (
							<MediaIcon video={image.video} />
						)}
					</span>
				)}
			</p>
			{interactive && lightboxStart && image && (
				<LifelineLightbox
					photo={image}
					rotate={0}
					start={lightboxStart}
					getHome={measureText}
					onClosed={() => setLightboxStart(null)}
				/>
			)}
		</>
	);
}

const LifelineVerticalEntry = forwardRef<
	HTMLLIElement,
	{
		marker: LifelineMarker;
		animateIntro?: boolean;
		introDelay?: number;
		introDuration?: number;
		revealPending?: boolean;
		/**
		 * Drops the lightbox/drag and makes the whole entry a link to the marker's
		 * case study, when its company declares one.
		 */
		staticMedia?: boolean;
	}
>(function LifelineVerticalEntry(
	{
		marker,
		animateIntro = false,
		introDelay = 0,
		introDuration = 420,
		revealPending = false,
		staticMedia = false,
	},
	ref,
) {
	const primaryHref = marker.companies?.find((company) => company.href)?.href;
	const linkHref = staticMedia ? primaryHref : undefined;
	const firstTitle =
		marker.events.length > 0
			? getLifelineEventTitle(marker.events[0])
			: undefined;
	const people = aggregateLifelinePeople(marker);
	const photos = marker.photos ?? [];
	const hasContent = hasMarkerContent(marker) || photos.length > 0;

	const body = (
		<div
			className={cn(
				animateIntro && "lifeline-marker-intro",
				revealPending && "opacity-0",
				"pb-8",
			)}
			style={{
				animationDelay: animateIntro ? `${introDelay}ms` : undefined,
				...(animateIntro
					? ({
							"--lifeline-marker-fade-ms": `${introDuration}ms`,
						} as CSSProperties)
					: {}),
			}}
		>
			<div className={`${GRID_CLASS} items-center`}>
				<div className="flex items-center justify-center">
					<RailTick />
				</div>

				<p className="whitespace-nowrap text-[11px] font-medium leading-4 tabular-nums text-zinc-500 transition-colors duration-300">
					{marker.label ?? marker.year}
				</p>
			</div>

			{hasContent && (
				<div className={`${GRID_CLASS} mt-2`}>
					<div aria-hidden="true" />
					<div className="min-w-0 text-zinc-500 transition-colors duration-300">
						{marker.badges && marker.badges.length > 0 && (
							<div className="mb-3 flex items-center justify-start gap-2">
								{marker.badges.map((badge) => (
									// eslint-disable-next-line @next/next/no-img-element
									<img // react-doctor-disable-line nextjs-no-img-element -- arbitrary media, with no intrinsic size for next/image to work from
										key={badge.src}
										src={badge.src}
										alt={badge.alt}
										className="h-6 w-6 object-contain opacity-80"
									/>
								))}
							</div>
						)}

						{firstTitle && (
							<p className="mb-1 max-w-[18rem] text-[15px] font-semibold leading-snug text-zinc-800 transition-colors duration-300">
								{firstTitle}
							</p>
						)}

						{marker.companies && marker.companies.length > 0 && (
							<p className="mb-2 max-w-[18rem] text-[13px] font-medium text-zinc-500">
								{marker.companies.map((company, index) => (
									<span key={company.id}>
										{index > 0 && ", "}
										{/* Already linked by the whole-entry wrapper below in staticMedia mode. */}
										{company.href && !staticMedia ? (
											<Link
												href={company.href}
												className="underline decoration-zinc-300 hover:decoration-zinc-600 underline-offset-2 transition-colors duration-300"
											>
												{company.name}
											</Link>
										) : (
											company.name
										)}
									</span>
								))}
							</p>
						)}

						{marker.events.length > 0 && (
							<div className="space-y-4">
								{marker.events.map((event, index) => (
									<LifelineVerticalEvent
										key={getLifelineEventKey(event, index)}
										event={event}
										interactive={!staticMedia}
									/>
								))}
							</div>
						)}

						{photos.length > 0 && (
							<div className="mt-6">
								{/* Already wrapped in linkHref's anchor below, so this renders plain. */}
								<LifelineCaseStudiesButton
									photos={photos}
									href={primaryHref}
									as={staticMedia ? "static" : "link"}
								/>
							</div>
						)}

						{people.length > 0 && (
							<div className="mt-6 border-t border-zinc-200/70 pt-5 transition-colors duration-300">
								<LifelinePeople people={people} allowWrap />
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);

	return (
		<li
			ref={ref}
			className={hasContent ? "pb-10" : "pb-3"}
			aria-label={marker.label ?? `${marker.year}`}
		>
			{linkHref ? (
				<Link href={linkHref} className="block">
					{body}
				</Link>
			) : (
				body
			)}
		</li>
	);
});

export function LifelineVertical({
	markers,
	title = "Lifeline",
	mode = "auto",
	staticMedia = false,
}: LifelineProps & {
	/** See `LifelineVerticalEntry`'s `staticMedia` prop. */
	staticMedia?: boolean;
}) {
	// Only an explicit `mode` embeds the vertical layout: the mobile layout is
	// itself a vertical scroller inside a scrolling stage, so `auto`'s test would
	// read every full-page timeline as embedded.
	const isEmbed = mode === "embed";
	const heights = useMemo(
		() =>
			markers.map((marker, index) =>
				getMarkerHeight(marker, markers[index + 1]?.year),
			),
		[markers],
	);

	const intro = useLifelineIntro(heights);
	const isIntroAnimating = intro.shouldPlay && intro.isPlaying;

	// Warm the event media posters during idle — the lightbox measures its frame
	// from these, and a cold fetch at tap time reads as lag.
	useEffect(() => {
		const sources: string[] = [];
		for (const marker of markers) {
			for (const event of marker.events) {
				const image = getLifelineEventImage(event);
				if (image) sources.push(image.src);
			}
		}
		if (sources.length === 0) return;

		const warm = () => {
			sources.forEach((src) => {
				const image = new window.Image();
				image.src = src;
			});
		};

		if (typeof window.requestIdleCallback === "function") {
			const handle = window.requestIdleCallback(warm);
			return () => window.cancelIdleCallback(handle);
		}
		const timeout = window.setTimeout(warm, 2000);
		return () => window.clearTimeout(timeout);
	}, [markers]);

	const { sectionRef, setEntryRef, isLayoutReady } = useLifelineVerticalScroll(
		markers.length,
		{
			isEmbed,
			introLocked: isIntroAnimating,
			introAnimating: isIntroAnimating,
			// Embedded, the sweep would play out unseen below the fold — and
			// lock the module's own scroller while doing it.
			introSkipped: !intro.shouldPlay || isEmbed,
			introRailMs: intro.railDuration,
			introGetTrackProgress: intro.getTrackProgressAtTime,
			onIntroScrollStart: intro.startIntroTimer,
			onIntroSettleComplete: intro.completeIntro,
		},
	);

	const showIntro = isIntroAnimating && isLayoutReady && !isEmbed;
	const revealOnScroll = markers.length > MAX_ARMED_ENTRIES;
	const animateEntries = showIntro && !revealOnScroll;

	// Rail-synced fades for long timelines: each entry fades in when
	// --lifeline-intro-progress crosses its position, then drops its animation
	// (and compositor layer).
	useEffect(() => {
		if (!showIntro || !revealOnScroll) return;
		const section = sectionRef.current;
		const ol = section?.querySelector("ol");
		if (!section || !ol) return;

		const entries = Array.from(ol.children) as HTMLElement[];
		const targets = entries.map(
			(li) => li.firstElementChild as HTMLElement | null,
		);

		const onAnimationEnd = (event: AnimationEvent) => {
			if (event.animationName !== "lifeline-marker-in") return;
			(event.target as HTMLElement).classList.remove("lifeline-marker-intro");
		};
		section.addEventListener("animationend", onAnimationEnd);

		let next = 0;
		let frame = 0;
		const tick = () => {
			const progress = parseFloat(
				section.style.getPropertyValue("--lifeline-intro-progress") || "0",
			);
			const tip = progress * ol.offsetHeight;

			while (next < entries.length && entries[next].offsetTop <= tip) {
				const el = targets[next];
				if (el) {
					el.classList.remove("opacity-0");
					el.classList.add("lifeline-marker-intro");
				}
				next++;
			}

			if (next < entries.length) {
				frame = requestAnimationFrame(tick);
			}
		};
		frame = requestAnimationFrame(tick);

		return () => {
			cancelAnimationFrame(frame);
			section.removeEventListener("animationend", onAnimationEnd);
			targets.forEach((el) => {
				el?.classList.remove("opacity-0", "lifeline-marker-intro");
			});
		};
	}, [showIntro, revealOnScroll, sectionRef]);

	const introStyle = {
		"--lifeline-labels-ms": `${intro.labelsDuration}ms`,
		"--lifeline-rail-ms": `${intro.railDuration}ms`,
	} as CSSProperties;

	return (
		<article
			ref={sectionRef}
			aria-label={title}
			className={cn(
				"relative select-none px-6 pb-10 pt-4 [&_a]:cursor-pointer",
				!isLayoutReady && "invisible",
			)}
			style={showIntro ? introStyle : undefined}
		>
			<div className="mb-6 h-4" aria-hidden="true" />

			<div className="relative">
				<div
					aria-hidden="true"
					className="pointer-events-none absolute bottom-0 top-0 overflow-hidden -translate-x-1/2"
					style={{ left: RAIL_LEFT, width: 1 }}
				>
					<div
						className={cn(
							"h-full w-px border-l border-dashed border-zinc-300 transition-colors duration-300",
							showIntro && "lifeline-rail-intro-vertical",
						)}
					/>
				</div>

				<ol className="relative">
					{markers.map((marker, index) => (
						<LifelineVerticalEntry
							key={marker.id}
							ref={(node) => setEntryRef(index, node)}
							marker={marker}
							animateIntro={animateEntries}
							revealPending={showIntro && revealOnScroll}
							introDelay={intro.getMarkerDelay(index)}
							introDuration={intro.getMarkerFadeDuration(index)}
							staticMedia={staticMedia}
						/>
					))}
				</ol>
			</div>
		</article>
	);
}
