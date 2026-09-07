"use client";

import {
	BackwardIcon,
	ForwardIcon,
	PauseIcon,
	PlayIcon,
} from "@heroicons/react/24/solid";
import { cn } from "@ui-kit/cn";
import { AnimatePresence, m, type Transition } from "motion/react";
import { Ticker } from "motion-plus/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import useMeasure from "react-use-measure";

const springConfig: Transition = {
	type: "spring",
	duration: 0.6,
	bounce: 0.4,
};

const bigSpringConfig: Transition = {
	type: "spring",
	duration: 0.8,
	bounce: 0.2,
};

const VIDEO_DURATION = 15 * 60;

/**
 * Fixed peaks per bar rather than `Math.random()` in the keyframes: random
 * values differ between the server and the browser (a hydration mismatch), and
 * re-roll on every render, which restarted the loop on each duration tick.
 */
const WAVEFORM_BARS = [
	{ id: "bar-1", peaks: ["7px", "3px"] },
	{ id: "bar-2", peaks: ["4px", "9px"] },
	{ id: "bar-3", peaks: ["10px", "5px"] },
	{ id: "bar-4", peaks: ["5px", "8px"] },
	{ id: "bar-5", peaks: ["8px", "4px"] },
];

const REST_HEIGHT = "2px";

function formatTime(seconds: number) {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

interface WaveformProps {
	isPlaying: boolean;
}

function Waveform({ isPlaying }: WaveformProps) {
	return (
		<div className="flex gap-0.5 h-3 items-center justify-center flex-shrink-0">
			{WAVEFORM_BARS.map((bar) => (
				<m.div
					key={bar.id}
					className="bg-slate-50 rounded-full w-0.5"
					animate={
						isPlaying
							? {
									height: [
										REST_HEIGHT,
										bar.peaks[0],
										bar.peaks[1],
										REST_HEIGHT,
									],
								}
							: { height: REST_HEIGHT }
					}
					transition={{
						duration: 0.5,
						repeat: isPlaying ? Infinity : 0,
						repeatType: "reverse",
						ease: "easeInOut",
					}}
				/>
			))}
		</div>
	);
}

interface MediaContentProps {
	title: string;
	subtitle: string;
	isPlaying: boolean;
	duration: number;
	formatTime: (seconds: number) => string;
	progress: number;
	VIDEO_DURATION: number;
	onTogglePlay: () => void;
}

function MediaContent({
	title,
	subtitle,
	isPlaying,
	duration,
	formatTime,
	progress,
	VIDEO_DURATION,
	onTogglePlay,
}: MediaContentProps) {
	return (
		<div className="flex flex-col gap-2 pt-7 pb-4 px-4 w-full items-center justify-center">
			<div className="flex gap-1 items-center justify-center relative w-full pointer-events-none">
				<div className="h-7 relative aspect-video overflow-hidden rounded-md w-12 flex-shrink-0 bg-zinc-800 flex items-center justify-center">
					<Image
						src="https://i.ytimg.com/vi/LEdYbuwn7DE/maxresdefault.jpg"
						alt="Podcast thumbnail"
						width={48}
						height={27}
						className="object-cover w-full h-full"
					/>
				</div>

				<div className="flex flex-col gap-px grow overflow-hidden items-start px-3 min-w-0">
					<div className="relative overflow-hidden w-full">
						<Ticker
							items={[
								<span
									key="title"
									className="font-semibold text-sm text-white whitespace-nowrap overflow-hidden"
								>
									{title}
								</span>,
							]}
							velocity={20}
							gap={16}
							align="start"
							style={{
								maskImage:
									"linear-gradient(to right, transparent 0px, black 12px, black calc(100% - 12px), transparent 100%)",
								WebkitMaskImage:
									"linear-gradient(to right, transparent 0px, black 12px, black calc(100% - 12px), transparent 100%)",
							}}
						/>
					</div>
					<p className="font-normal leading-4 opacity-50 text-xs text-white whitespace-nowrap">
						{subtitle}
					</p>
				</div>

				<Waveform isPlaying={isPlaying} />
			</div>

			<div className="flex gap-2 items-center justify-center relative w-full">
				<p className="font-semibold leading-4 opacity-50 text-xs text-white whitespace-nowrap tabular-nums">
					{formatTime(duration)}
				</p>
				<div
					role="progressbar"
					aria-label="Playback progress"
					aria-valuemin={0}
					aria-valuemax={VIDEO_DURATION}
					aria-valuenow={duration}
					aria-valuetext={formatTime(duration)}
					className="bg-zinc-800 grow h-1.5 relative rounded-full overflow-hidden"
				>
					<div
						className="absolute bg-zinc-400 h-1.5 left-0 top-1/2 -translate-y-1/2"
						style={{ width: `${progress * 100}%` }}
					/>
				</div>
				<p className="font-semibold leading-4 opacity-50 text-xs text-white whitespace-nowrap tabular-nums">
					-{formatTime(VIDEO_DURATION - duration)}
				</p>
			</div>

			<div className="flex gap-2 items-center w-full justify-center">
				<button
					type="button"
					disabled
					aria-label="Previous track"
					className="flex items-center justify-center rounded-2xl w-12 h-12 hover:bg-zinc-800 transition-colors"
				>
					<BackwardIcon className="w-8 h-8 text-white opacity-50" />
				</button>

				<button
					type="button"
					onClick={onTogglePlay}
					aria-label={isPlaying ? "Pause" : "Play"}
					className="flex items-center justify-center rounded-2xl relative z-20 w-12 h-12 active:scale-90 hover:bg-zinc-800 transition-[transform,background-color]"
				>
					<AnimatePresence mode="popLayout" initial={false}>
						{isPlaying ? (
							<m.div
								key="pause"
								initial={{ scale: 0.5, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.5, opacity: 0 }}
								transition={springConfig}
							>
								<PauseIcon className="w-9 h-9 text-white" />
							</m.div>
						) : (
							<m.div
								key="play"
								initial={{ scale: 0.5, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.5, opacity: 0 }}
								transition={springConfig}
							>
								<PlayIcon className="w-9 h-9 text-white" />
							</m.div>
						)}
					</AnimatePresence>
				</button>

				<button
					type="button"
					disabled
					aria-label="Next track"
					className="flex items-center justify-center rounded-2xl w-12 h-12 hover:bg-zinc-800 transition-colors"
				>
					<ForwardIcon className="w-8 h-8 text-white opacity-50" />
				</button>
			</div>
		</div>
	);
}

function ClosedState({ isPlaying }: { isPlaying: boolean }) {
	return (
		<div className="p-3 w-full">
			<div className="flex items-center justify-between relative w-full">
				<div className="h-3 relative rounded-xs aspect-video overflow-hidden w-5 flex-shrink-0 bg-zinc-800 flex items-center justify-center">
					<Image
						src="https://i.ytimg.com/vi/LEdYbuwn7DE/maxresdefault.jpg"
						alt="Podcast thumbnail"
						width={20}
						height={11}
						className="object-cover w-full h-full"
					/>
				</div>

				<Waveform isPlaying={isPlaying} />
			</div>
		</div>
	);
}

export default function DynamicIsland({
	title = "Can the iPhone 17 Pro Beat a Leica Camera",
	subtitle = "WVFRM Podcast",
}: {
	title: string;
	subtitle: string;
}) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [duration, setDuration] = useState(0);
	const [isExpanded, setIsExpanded] = useState(false);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const [expandedRef, expandedBounds] = useMeasure();
	const [closedRef, closedBounds] = useMeasure();

	const togglePlay = () => {
		setIsPlaying(!isPlaying);
	};

	const handleWheel = (e: React.WheelEvent) => {
		if (e.deltaY < -4) {
			setIsExpanded(true);
		}
	};

	useEffect(() => {
		if (isPlaying) {
			intervalRef.current = setInterval(() => {
				setDuration((prev) => {
					const newDuration = prev + 1;
					return newDuration >= VIDEO_DURATION ? 0 : newDuration;
				});
			}, 1000);
		} else {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [isPlaying]);

	const progress = Math.min(duration / VIDEO_DURATION, 1);

	return (
		<m.div
			className={cn(
				"w-fit h-fit mx-auto flex items-start justify-center origin-top group",
			)}
			whileHover={{
				scale: isExpanded ? 1 : 1.05,
			}}
			onMouseLeave={() => setIsExpanded(false)}
			transition={bigSpringConfig}
		>
			<div className="w-4 h-4 -mr-[0.5px]">
				<svg
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
					focusable="false"
				>
					<path
						d="M16 16V0H0C5.33333 0 16 3.2 16 16Z"
						fill="black"
						style={{ fill: "black", fillOpacity: 1 }}
					/>
				</svg>
			</div>
			<m.div
				className="bg-zinc-950 flex flex-col gap-2 items-center overflow-hidden justify-center shadow-2xl relative border-0"
				animate={{
					width: isExpanded ? expandedBounds.width : closedBounds.width,
					height: isExpanded ? expandedBounds.height : closedBounds.height,
					borderRadius: isExpanded ? "0 0 32px 32px" : "0 0 12px 12px",
				}}
				transition={bigSpringConfig}
			>
				<button
					type="button"
					onClick={() => setIsExpanded(true)}
					onWheel={handleWheel}
					aria-label="Expand now playing"
					className="w-full h-full absolute inset-0 cursor-pointer z-10"
				/>
				<AnimatePresence mode="popLayout">
					{isExpanded ? (
						<m.div
							key="expanded"
							initial={{ opacity: 0, filter: "blur(16px)", y: -24 }}
							animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
							exit={{ opacity: 0, filter: "blur(16px)", y: -24 }}
							transition={bigSpringConfig}
							className="w-full min-w-[min(384px,75vw)] flex items-center justify-center z-20 relative"
						>
							<div
								ref={expandedRef}
								className="w-full flex items-center justify-center"
							>
								<MediaContent
									title={title}
									subtitle={subtitle}
									isPlaying={isPlaying}
									duration={duration}
									formatTime={formatTime}
									progress={progress}
									VIDEO_DURATION={VIDEO_DURATION}
									onTogglePlay={togglePlay}
								/>
							</div>
						</m.div>
					) : (
						<m.div
							key="closed"
							initial={{ opacity: 0, filter: "blur(16px)", y: 24 }}
							animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
							exit={{ opacity: 0, filter: "blur(16px)", y: 24 }}
							transition={bigSpringConfig}
							className="w-56"
						>
							<div ref={closedRef} className="w-full">
								<ClosedState isPlaying={isPlaying} />
							</div>
						</m.div>
					)}
				</AnimatePresence>
			</m.div>
			<div className="w-4 h-4 -ml-[0.5px]">
				<svg
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
					focusable="false"
				>
					<path
						d="M0 16V0H16C10.6667 0 0 3.2 0 16Z"
						fill="black"
						style={{ fill: "black", fillOpacity: 1 }}
					/>
				</svg>
			</div>
		</m.div>
	);
}
