"use client";

import { AnimatePresence, m } from "motion/react";
import { useEffect, useState } from "react";

const statuses = {
	analyzing: {
		label: "Analyzing Transaction",
		color: "bg-sky-100 text-sky-500",
	},
	success: {
		label: "Transaction Safe",
		color: "bg-green-100 text-green-500",
	},
	warning: {
		label: "Transaction Warning",
		color: "bg-red-100 text-red-500",
	},
} as const;

const FamilyStatusButton = () => {
	const [status, setStatus] = useState<keyof typeof statuses>("analyzing");

	useEffect(() => {
		const timers = new Set<number>();
		const at = (delay: number, run: () => void) => {
			timers.add(
				window.setTimeout(() => {
					run();
				}, delay),
			);
		};

		const cycle = () => {
			timers.clear();
			at(1800, () => setStatus("success"));
			at(3200, () => setStatus("analyzing"));
			at(4800, () => setStatus("warning"));
			at(6400, () => {
				setStatus("analyzing");
				at(0, cycle);
			});
		};

		cycle();
		return () => {
			for (const timer of timers) window.clearTimeout(timer);
		};
	}, []);

	return (
		// Nothing to press — the status cycles on its own, so it announces itself
		// instead of posing as a control.
		<m.div
			layout
			role="status"
			transition={{ duration: 0.2 }}
			className={`rounded-full font-[550] cursor-pointer text-lg flex items-center justify-center pr-6 pl-4 gap-2 py-3 overflow-hidden relative ${statuses[status].color}`}
		>
			<AnimatePresence mode="popLayout" initial={false}>
				<Icon key={`${status}-icon`} status={status} />
				<m.span
					layoutId={status}
					initial={{ opacity: 0, x: -24 }}
					animate={{
						opacity: 1,
						x: 0,
						transition: { type: "spring", duration: 0.9, bounce: 0.3 },
					}}
					exit={{
						opacity: 0,
						x: 24,
						transition: { type: "spring", duration: 0.3, bounce: 0.1 },
					}}
					key={`${status}-label`}
					className="text-nowrap"
				>
					{statuses[status].label}
				</m.span>
			</AnimatePresence>
		</m.div>
	);
};

const iconVariants = {
	initial: { scale: 0, opacity: 0 },
	animate: { scale: 1, opacity: 1 },
	exit: { scale: 0.3, opacity: 0 },
};

const Icon = ({ status }: { status: keyof typeof statuses }) => {
	return (
		<div className="flex items-center justify-center size-6">
			<AnimatePresence mode="popLayout" initial={true}>
				<m.div
					key={status}
					variants={iconVariants}
					initial="initial"
					animate="animate"
					exit="exit"
					transition={{ duration: 0.25 }}
				>
					{status === "success" && (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="size-6"
							aria-hidden="true"
						>
							<path
								fillRule="evenodd"
								d="M2.25 12c0-5.38 4.37-9.75 9.75-9.75s9.75 4.37 9.75 9.75-4.37 9.75-9.75 9.75S2.25 17.39 2.25 12Zm13.36-1.81a0.75 0.75 0 1 0-1.22-0.87l-3.24 4.53L9.53 12.22a0.75 0.75 0 0 0-1.06 1.06l2.25 2.25a0.75 0.75 0 0 0 1.14-0.09l3.75-5.25Z"
								clipRule="evenodd"
							/>
						</svg>
					)}
					{status === "analyzing" && (
						<m.svg
							width="20"
							height="20"
							viewBox="0 0 20 20"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							key="analyzing-icon"
							initial={{ rotate: 0 }}
							animate={{ rotate: 360 }}
							transition={{
								duration: 0.75,
								repeat: Infinity,
								ease: "easeInOut",
								repeatDelay: 0.5,
							}}
							aria-hidden="true"
						>
							<m.path
								initial={{ rotate: 0 }}
								animate={{ rotate: 360 }}
								transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
								d="M10 1.5C14.69 1.5 18.5 5.31 18.5 10C18.5 14.69 14.69 18.5 10 18.5C5.31 18.5 1.5 14.69 1.5 10C1.5 5.31 5.31 1.5 10 1.5Z"
								stroke="currentColor"
								strokeWidth="3"
								strokeDasharray={0.5}
								strokeDashoffset={0.5}
								strokeLinecap="round"
								pathLength={0.75}
							/>
							<path
								d="M10 1.5C14.69 1.5 18.5 5.31 18.5 10C18.5 14.69 14.69 18.5 10 18.5C5.31 18.5 1.5 14.69 1.5 10C1.5 5.31 5.31 1.5 10 1.5Z"
								stroke="currentColor"
								opacity={0.2}
								strokeWidth="3"
							/>
						</m.svg>
					)}
					{status === "warning" && (
						<m.svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="size-6"
							animate={{
								x: [0, -4, 4, -2, 2, -1, 1, 0],
								transition: {
									duration: 0.25,
									delay: 0.75,
								},
							}}
							aria-hidden="true"
						>
							<path
								fillRule="evenodd"
								d="M9.4 3c1.16-2 4.04-2 5.2 0l7.36 12.75c1.15 2-0.29 4.5-2.6 4.5H4.64c-2.31 0-3.75-2.5-2.6-4.5L9.4 3ZM12 8.25a0.75 0.75 0 0 1 0.75 0.75v3.75a0.75 0.75 0 0 1-1.5 0V9a0.75 0.75 0 0 1 0.75-0.75Zm0 8.25a0.75 0.75 0 1 0 0-1.5 0.75 0.75 0 0 0 0 1.5Z"
								clipRule="evenodd"
							/>
						</m.svg>
					)}
				</m.div>
			</AnimatePresence>
		</div>
	);
};

export { FamilyStatusButton };
