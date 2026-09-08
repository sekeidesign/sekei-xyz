"use client";

import { AnimatePresence, m, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../cn";
import { FigureFrame } from "./FigureFrame";
import { CursorIcon } from "./review-icons";
import { StatusDial } from "./StatusDial";
import { STATUS_ORDER } from "./status";

type Phase = "idle" | "toCell" | "openClick" | "reach" | "pick" | "settle";

const SEQUENCE: { phase: Phase; ms: number }[] = [
	{ phase: "idle", ms: 600 },
	{ phase: "toCell", ms: 600 },
	{ phase: "openClick", ms: 300 },
	{ phase: "reach", ms: 800 },
	{ phase: "pick", ms: 350 },
	{ phase: "settle", ms: 1000 },
];

const SPRING = { type: "spring", bounce: 0, duration: 0.5 } as const;

/** Which status the loop picks, in turn. */
const PICKS = [2, 3, 1];

/** The cell, and the menu that opens under it. Everything is placed off these. */
const CELL = 36;
const ITEM = 36;
const GAP = 8;

/** The table around it is skeleton: only the status cell is drawn for real. */
const ROWS = [300, 250, 330, 270, 290];
const TARGET = 1;

const BAR = "h-2.5 rounded-full bg-stone-200";

export function StatusChange() {
	const ref = useRef<HTMLDivElement>(null);
	const inView = useInView(ref, { amount: 0.4 });
	const [step, setStep] = useState(0);
	const [pick, setPick] = useState(0);
	const [status, setStatus] = useState(1);

	useEffect(() => {
		if (!inView) {
			setStep(0);
			return;
		}
		const timer = setTimeout(() => {
			const next = (step + 1) % SEQUENCE.length;
			if (SEQUENCE[next].phase === "pick") setStatus(PICKS[pick]);
			if (next === 0) setPick((count) => (count + 1) % PICKS.length);
			setStep(next);
		}, SEQUENCE[step].ms);
		return () => clearTimeout(timer);
	}, [inView, step, pick]);

	const { phase } = SEQUENCE[step];
	const open = phase === "openClick" || phase === "reach" || phase === "pick";
	const onCell = phase === "toCell" || phase === "openClick";
	const reaching = phase === "reach" || phase === "pick";
	const pressing = phase === "openClick" || phase === "pick";
	const target = PICKS[pick];

	return (
		<FigureFrame ratio="3 / 2" scale={1}>
			<div ref={ref} className="h-full overflow-hidden bg-white">
				<div className="flex h-12 items-center gap-4 border-b border-stone-400/20 bg-stone-100 pl-4">
					<span className="size-5 shrink-0 rounded-md bg-white ring-1 ring-stone-400/20" />
					{[40, 32, 56, 44, 48].map((width, index) => (
						<span
							key={index}
							style={{ width }}
							className={cn(BAR, "shrink-0", index === 3 && "ml-72")}
						/>
					))}
				</div>
				{ROWS.map((title, row) => (
					<div
						key={title}
						className={cn(
							"flex h-14 items-center gap-4 border-b border-stone-400/20 pl-4",
							row % 2 ? "bg-stone-50" : "bg-white",
						)}
					>
						<span className="size-5 shrink-0 rounded-md bg-white ring-1 ring-stone-400/20" />
						<span style={{ width: 56 }} className={cn(BAR, "shrink-0")} />
						<span className="size-4 shrink-0 rounded-full bg-stone-200" />
						<span style={{ width: title }} className={cn(BAR, "shrink-0")} />
						<span className="flex shrink-0 items-center gap-2">
							<span className="size-5 shrink-0 rounded-full bg-stone-200" />
							<span style={{ width: 72 }} className={cn(BAR, "shrink-0")} />
						</span>
						{row === TARGET ? (
							<div className="relative">
								<span
									className={cn(
										"flex h-9 w-40 items-center gap-2 rounded-lg px-2.5",
										open && "bg-stone-100",
									)}
								>
									<StatusDial
										status={STATUS_ORDER[status]}
										size={18}
										animated
									/>
									<span className="text-sm text-stone-900">
										{STATUS_ORDER[status]}
									</span>
								</span>

								<AnimatePresence>
									{open && (
										<m.div
											initial={{ opacity: 0, scale: 0.96, y: -4 }}
											animate={{ opacity: 1, scale: 1, y: 0 }}
											exit={{ opacity: 0, scale: 0.98, y: -2 }}
											transition={{ duration: 0.15, ease: "easeOut" }}
											style={{ originX: 0, originY: 0, top: CELL + GAP }}
											className="absolute left-0 z-10 w-64 rounded-xl bg-white p-1 ring-1 ring-stone-400/20 shadow-xl"
										>
											{STATUS_ORDER.map((entry, index) => (
												<span
													key={entry}
													className={cn(
														"flex h-9 items-center gap-2.5 rounded-lg px-2.5",
														phase !== "openClick" &&
															index === target &&
															"bg-stone-100",
													)}
												>
													<StatusDial status={entry} size={18} />
													<span className="text-sm font-[500] text-stone-900">
														{entry}
													</span>
													{index === status && (
														<CheckIcon className="ml-auto text-stone-600" />
													)}
												</span>
											))}
										</m.div>
									)}
								</AnimatePresence>

								<m.span
									animate={{
										x: onCell ? 44 : reaching ? 68 : 210,
										y: onCell
											? 20
											: reaching
												? CELL + GAP + 4 + target * ITEM + 15
												: 60,
										scale: pressing ? 0.9 : 1,
									}}
									transition={{ ...SPRING, scale: { duration: 0.12 } }}
									className="absolute top-0 left-0 z-20 text-stone-900 drop-shadow-md drop-shadow-black/25"
								>
									<CursorIcon />
								</m.span>
							</div>
						) : (
							<span className="flex shrink-0 items-center gap-2 px-2.5">
								<span className="size-4 shrink-0 rounded-full bg-stone-200" />
								<span style={{ width: 56 }} className={cn(BAR, "shrink-0")} />
							</span>
						)}
						<span className="flex shrink-0 items-center gap-2">
							<span className="size-4 shrink-0 rounded-full bg-stone-200" />
							<span style={{ width: 48 }} className={cn(BAR, "shrink-0")} />
						</span>
					</div>
				))}
			</div>
		</FigureFrame>
	);
}

function CheckIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 16 16"
			width={16}
			height={16}
			fill="none"
			className={cn("shrink-0", className)}
			aria-hidden="true"
			focusable="false"
		>
			<path
				d="M3.5 8.5L6.5 11.5L12.5 4.5"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
