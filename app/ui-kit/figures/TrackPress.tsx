"use client";

import { m, useInView } from "motion/react";
import { type CSSProperties, useEffect, useId, useRef, useState } from "react";
import { cn } from "../cn";
import { SURFACE_INNER, SURFACE_OUTER } from "../post/surface";
import { usePrefersReducedMotion } from "../use-prefers-reduced-motion";
import { CursorIcon, DismissIcon, FLAME, TrackIcon } from "./review-icons";

type Phase = "away" | "over" | "press" | "held" | "leaving" | "reset";

/** One pass of the loop: approach, press, hold the tracked state, let go. */
const SEQUENCE: { phase: Phase; ms: number }[] = [
	{ phase: "away", ms: 2000 },
	{ phase: "over", ms: 700 },
	{ phase: "press", ms: 150 },
	{ phase: "held", ms: 1000 },
	{ phase: "leaving", ms: 900 },
	{ phase: "reset", ms: 100 },
];

/** Critically damped: it settles into place without overshooting. */
const SPRING = { type: "spring", bounce: 0, duration: 0.55 } as const;

/**
 * Where the pointer waits, and where it lands: below and right of the button's
 * centre, so the flame it presses stays in view. It waits to the left, where
 * the row leaves room — to the right it would sit outside the card.
 */
const AWAY = { x: -76, y: 54 };
const ON = { x: 8, y: 7 };

const BUTTON = 56;

/** Seconds the flame lags the release, in step with the ripple's own delay. */
const FILL_DELAY = 0.075;

/** The row's own control at twice its size, where the press is legible. */
export function TrackPress() {
	const ref = useRef<HTMLDivElement>(null);
	const inView = useInView(ref, { amount: 0.5 });
	const reduced = usePrefersReducedMotion();
	const [step, setStep] = useState(0);
	// The ripple plays once per press, so it is keyed on the pass rather than
	// the step — a step change inside the tracked state would replay it.
	const [pass, setPass] = useState(0);
	const clip = useId();

	useEffect(() => {
		if (!inView || reduced) {
			setStep(0);
			return;
		}
		const timer = setTimeout(() => {
			const next = (step + 1) % SEQUENCE.length;
			if (SEQUENCE[next].phase === "press") setPass((count) => count + 1);
			setStep(next);
		}, SEQUENCE[step].ms);
		return () => clearTimeout(timer);
	}, [inView, reduced, step]);

	const { phase } = SEQUENCE[step];
	const onButton = phase === "over" || phase === "press" || phase === "held";
	const pressed = phase === "press";
	// Tracked from the release rather than the press, so the button is on its
	// way back up as it takes the state. The flame waits out FILL_DELAY on top
	// of that, which leaves dismiss a moment to fold away first.
	const tracked = phase === "held" || phase === "leaving";

	return (
		<div className={cn("my-6 w-full rounded-xl", SURFACE_OUTER)}>
			<div
				ref={ref}
				role="img"
				aria-label="A cursor pressing track on a RAID item: the dismiss action folds away and the flame fills orange"
				className={cn(
					"flex h-60 items-center rounded-lg",
					SURFACE_INNER,
					"bg-gray-50",
				)}
			>
				{/* The control sits in a row of its own, as it does in the list, so
				    it stays against the right edge while it folds down. */}
				<div className="flex w-full items-center gap-6 px-8">
					<div className="flex min-w-0 grow items-center gap-4">
						<span className="size-7 shrink-0 rounded-full bg-gray-500/10" />
						<span className="h-4 w-full max-w-72 rounded-full bg-gray-500/10" />
						<span className="h-4 w-14 shrink-0 rounded-full bg-gray-500/10" />
					</div>
					<div className="flex shrink-0 items-center rounded-full bg-white ring-1 ring-gray-500/10 shadow-skew">
						{/* Tracking leaves one action, so dismiss and its rule fold away
						    and the pill lands on a circle. */}
						<m.span
							animate={{ width: tracked ? 0 : BUTTON, opacity: tracked ? 0 : 1 }}
							transition={SPRING}
							className="flex h-14 shrink-0 items-center justify-center overflow-hidden rounded-full text-gray-600"
						>
							<DismissIcon size={32} />
						</m.span>
						{/* The rule overlaps its neighbours by a pixel a side, which has to
						    go with it — left in, the collapsed pill lands 2px narrower
						    than it is tall and the flame sits off centre. */}
						<m.span
							animate={{
								width: tracked ? 0 : 1,
								marginLeft: tracked ? 0 : -1,
								marginRight: tracked ? 0 : -1,
								opacity: tracked ? 0 : 1,
							}}
							transition={SPRING}
							className="h-6 shrink-0 bg-gray-400/20"
						/>
						<m.span
							animate={{ scale: pressed ? 0.94 : 1 }}
							transition={SPRING}
							className="relative flex size-14 shrink-0 items-center justify-center rounded-full text-gray-600"
						>
							{/* Clipped here rather than on the button, which would cut off
							    the pointer on its way in. */}
							<span className="absolute inset-0 overflow-hidden rounded-full">
								{tracked && (
									<span
										key={pass}
										className="dot-ripple"
										style={
											{
												"--ripple-y": "100%",
											// Twice the row's own lattice, for a button at twice its size.
											"--dot-size": "0.75px",
											"--dot-gap": "4px",
												"--ripple-color": "var(--color-orange-600)",
												"--ripple-duration": "600ms",
												"--ripple-delay": "75ms",
											} as CSSProperties
										}
									/>
								)}
							</span>
							{/* The fill is an orange disc rising out of the flame's base,
							    clipped to the flame itself. */}
							<svg
								viewBox="0 0 24 24"
								className="absolute size-8 text-orange-600"
								aria-hidden="true"
								focusable="false"
							>
								<defs>
									<clipPath id={clip}>
										<path d={FLAME} />
									</clipPath>
								</defs>
								<g clipPath={`url(#${clip})`}>
									<m.circle
										cx="12"
										cy="23"
										fill="currentColor"
										initial={{ r: 0 }}
										animate={{ r: tracked ? 25 : 0 }}
										transition={{ duration: tracked ? 0.45 : 0.2, ease: "easeOut" }}
									/>
								</g>
							</svg>
							<m.span
								animate={{ opacity: tracked ? 0 : 1 }}
								transition={{ duration: 0.15, delay: tracked ? FILL_DELAY : 0 }}
								className="relative"
							>
								<TrackIcon size={32} />
							</m.span>
							<m.span
								animate={{ opacity: tracked ? 1 : 0 }}
								transition={{ duration: 0.15, delay: tracked ? FILL_DELAY : 0 }}
								className="absolute text-orange-600"
							>
								<TrackIcon size={32} />
							</m.span>
							<m.span
								initial={AWAY}
								animate={{
									...(onButton ? ON : AWAY),
									scale: pressed ? 0.88 : 1,
								}}
								transition={{ ...SPRING, scale: { duration: 0.12 } }}
								className="absolute top-1/2 left-1/2 text-gray-900 drop-shadow-md drop-shadow-black/25"
							>
								<CursorIcon />
							</m.span>
						</m.span>
					</div>
				</div>
			</div>
		</div>
	);
}
