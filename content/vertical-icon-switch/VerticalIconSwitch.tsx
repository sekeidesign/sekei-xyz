import { cn } from "@ui-kit/cn";
import {
	AnimatePresence,
	animate,
	MotionConfig,
	m,
	type Transition,
	useMotionTemplate,
	useMotionValue,
	useTransform,
} from "motion/react";
import { useState } from "react";

const VerticalIconSwitch = () => {
	const [trip, setTrip] = useState<"oneWay" | "return">("oneWay");
	const [animationSpeed, setAnimationSpeed] = useState(1);

	const spring: Transition = {
		type: "spring",
		duration: 0.35 / animationSpeed,
		bounce: 0.2,
	};

	const tripValue = useMotionValue(0);
	const switchClipPathTop = useTransform(tripValue, [0, 1], [1, 26]);
	const switchClipPathBottom = useTransform(tripValue, [0, 1], [26, 1]);
	const switchClipPath = useMotionTemplate`inset(${switchClipPathTop}px 0px ${switchClipPathBottom}px 0px)`;
	const rectangleClipPathTop = useTransform(tripValue, [0, 1], [4, 28]);
	const rectangleClipPathBottom = useTransform(tripValue, [0, 1], [28, 4]);
	const rectangleClipPath = useMotionTemplate`inset(${rectangleClipPathTop}px 0% ${rectangleClipPathBottom}px 0%)`;

	return (
		<>
			<MotionConfig transition={spring}>
				<button
					type="button"
					role="switch"
					aria-checked={trip === "return"}
					aria-label="Return trip"
					className="flex items-center justify-center gap-1.5 cursor-pointer"
					onClick={() => {
						setTrip(trip === "oneWay" ? "return" : "oneWay");
						animate(tripValue, trip === "oneWay" ? 1 : 0, {
							...spring,
						});
					}}
				>
					{/* Each state is painted twice, one layer clipped against the other, so
					    the pair is hidden and the switch is named by its own label. */}
					<div className="relative" aria-hidden="true">
						<div
							className={cn(
								"w-7 h-12 bg-gray-100 rounded-md overflow-hidden p-0.5 flex flex-col inset-shadow-sm outline outline-gray-200",
								trip === "oneWay" ? "justify-start" : "justify-end",
							)}
						>
							<m.div
								layout
								className="w-6 h-5 bg-orange-500 rounded-sm shadow-md"
							/>
						</div>
						<m.div
							className="absolute inset-0 p-0.5 flex flex-col justify-between text-white z-20"
							style={{
								clipPath: switchClipPath,
							}}
						>
							<div className="w-6 h-5 flex items-center justify-center">
								<OneWayIcon isActive={trip === "oneWay"} />
							</div>
							<div className="w-6 h-5 flex items-center justify-center">
								<ReturnIcon isActive={trip === "return"} />
							</div>
						</m.div>
						<div className="absolute inset-0 p-0.5 flex flex-col justify-between text-gray-300 z-10">
							<div className="w-6 h-5 flex items-center justify-center">
								<OneWayIcon isActive={trip === "oneWay"} />
							</div>
							<div className="w-6 h-5 flex items-center justify-center">
								<ReturnIcon isActive={trip === "return"} />
							</div>
						</div>
					</div>
					<div className="relative" aria-hidden="true">
						<m.div
							className="p-0.5 flex relative flex-col h-12 items-start text-xs font-[500] justify-between text-orange-500 z-20"
							style={{ clipPath: rectangleClipPath }}
						>
							<div className=" h-5 flex items-center justify-center">
								One way
							</div>
							<div className=" h-5 flex items-center justify-center">
								Return
							</div>
						</m.div>
						<div className="p-0.5 absolute inset-0 flex flex-col items-start text-xs font-[500] justify-between text-gray-300 z-10">
							<div className=" h-5 flex items-center justify-center">
								One way
							</div>
							<div className=" h-5 flex items-center justify-center">
								Return
							</div>
						</div>
					</div>
				</button>

				<button
					type="button"
					className="bg-gray-100 hover:bg-gray-200 hover:text-gray-500 cursor-pointer rounded-md px-2 py-1 text-xs font-[500] text-gray-400 absolute bottom-2 right-2"
					onClick={() => setAnimationSpeed(animationSpeed === 1 ? 0.15 : 1)}
				>
					{animationSpeed}x speed
				</button>
			</MotionConfig>
		</>
	);
};

const OneWayIcon = ({ isActive }: { isActive: boolean }) => {
	return (
		<div className="w-full h-full flex items-center justify-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 16 16"
				fill="currentColor"
				className="h-4 w-full"
				aria-hidden="true"
				focusable="false"
			>
				<MotionConfig transition={{ delay: 0.15 }}>
					<AnimatePresence mode="popLayout" initial={false}>
						{isActive ? (
							<m.path
								key="default"
								initial={{ opacity: 0, x: -12 }}
								animate={{
									opacity: 1,
									x: 0,
								}}
								exit={{
									opacity: 1,
									x: 0,
								}}
								fillRule="evenodd"
								d="M2 8a0.75 0.75 0 0 1 0.75-0.75h8.69L8.22 4.03a0.75 0.75 0 0 1 1.06-1.06l4.5 4.5a0.75 0.75 0 0 1 0 1.06l-4.5 4.5a0.75 0.75 0 0 1-1.06-1.06l3.22-3.22H2.75A0.75 0.75 0 0 1 2 8Z"
								clipRule="evenodd"
							/>
						) : (
							<m.path
								key="animate"
								initial={{ opacity: 1, x: 0 }}
								animate={{
									opacity: 1,
									x: 0,
								}}
								exit={{
									opacity: 0,
									x: 16,
									filter: "blur(2px)",
								}}
								fillRule="evenodd"
								d="M2 8a0.75 0.75 0 0 1 0.75-0.75h8.69L8.22 4.03a0.75 0.75 0 0 1 1.06-1.06l4.5 4.5a0.75 0.75 0 0 1 0 1.06l-4.5 4.5a0.75 0.75 0 0 1-1.06-1.06l3.22-3.22H2.75A0.75 0.75 0 0 1 2 8Z"
								clipRule="evenodd"
							/>
						)}
					</AnimatePresence>
				</MotionConfig>
			</svg>
		</div>
	);
};

const ReturnIcon = ({ isActive }: { isActive: boolean }) => {
	return (
		<div className="w-full h-full flex items-center justify-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 16 16"
				fill="currentColor"
				className="h-4 w-full"
				aria-hidden="true"
				focusable="false"
			>
				<MotionConfig transition={{ delay: 0.15 }}>
					<AnimatePresence mode="popLayout" initial={false}>
						{isActive ? (
							<m.path
								key="primary-default"
								initial={{ opacity: 0, x: -12 }}
								animate={{
									opacity: 1,
									x: 0,
								}}
								exit={{
									opacity: 1,
									x: 0,
								}}
								d="M10.47 2.22C10.61 2.08 10.8 2 11 2C11.2 2 11.39 2.08 11.53 2.22L13.78 4.47C13.92 4.61 14 4.8 14 5C14 5.2 13.92 5.39 13.78 5.53L11.53 7.78C11.46 7.85 11.38 7.91 11.29 7.95C11.19 7.99 11.1 8.02 10.99 8.02C10.89 8.02 10.79 8 10.7 7.96C10.61 7.93 10.52 7.87 10.45 7.8C10.38 7.73 10.32 7.64 10.29 7.55C10.25 7.46 10.23 7.36 10.23 7.26C10.23 7.15 10.26 7.06 10.3 6.96C10.34 6.87 10.4 6.79 10.47 6.72L11.44 5.75H5.75C5.55 5.75 5.36 5.67 5.22 5.53C5.08 5.39 5 5.2 5 5C5 4.8 5.08 4.61 5.22 4.47C5.36 4.33 5.55 4.25 5.75 4.25H11.44L10.47 3.28C10.33 3.14 10.25 2.95 10.25 2.75C10.25 2.55 10.33 2.36 10.47 2.22Z"
								fill="currentColor"
							/>
						) : (
							<m.path
								key="primary-animate"
								initial={{ opacity: 1, x: 0 }}
								animate={{
									opacity: 1,
									x: 0,
								}}
								exit={{
									opacity: 0,
									x: 16,
									filter: "blur(2px)",
								}}
								d="M10.47 2.22C10.61 2.08 10.8 2 11 2C11.2 2 11.39 2.08 11.53 2.22L13.78 4.47C13.92 4.61 14 4.8 14 5C14 5.2 13.92 5.39 13.78 5.53L11.53 7.78C11.46 7.85 11.38 7.91 11.29 7.95C11.19 7.99 11.1 8.02 10.99 8.02C10.89 8.02 10.79 8 10.7 7.96C10.61 7.93 10.52 7.87 10.45 7.8C10.38 7.73 10.32 7.64 10.29 7.55C10.25 7.46 10.23 7.36 10.23 7.26C10.23 7.15 10.26 7.06 10.3 6.96C10.34 6.87 10.4 6.79 10.47 6.72L11.44 5.75H5.75C5.55 5.75 5.36 5.67 5.22 5.53C5.08 5.39 5 5.2 5 5C5 4.8 5.08 4.61 5.22 4.47C5.36 4.33 5.55 4.25 5.75 4.25H11.44L10.47 3.28C10.33 3.14 10.25 2.95 10.25 2.75C10.25 2.55 10.33 2.36 10.47 2.22Z"
								fill="currentColor"
							/>
						)}
					</AnimatePresence>
					<AnimatePresence mode="popLayout" initial={false}>
						{isActive ? (
							<m.path
								key="secondary-default"
								initial={{ opacity: 0, x: 12 }}
								animate={{
									opacity: 1,
									x: 0,
								}}
								exit={{
									opacity: 1,
									x: 0,
								}}
								d="M5.53 8.22C5.67 8.36 5.75 8.55 5.75 8.75C5.75 8.95 5.67 9.14 5.53 9.28L4.56 10.25H10.25C10.45 10.25 10.64 10.33 10.78 10.47C10.92 10.61 11 10.8 11 11C11 11.2 10.92 11.39 10.78 11.53C10.64 11.67 10.45 11.75 10.25 11.75H4.56L5.53 12.72C5.6 12.79 5.66 12.87 5.7 12.96C5.74 13.06 5.77 13.15 5.77 13.26C5.77 13.36 5.75 13.46 5.71 13.55C5.68 13.64 5.62 13.73 5.55 13.8C5.48 13.87 5.39 13.93 5.3 13.96C5.21 14 5.11 14.02 5.01 14.02C4.9 14.02 4.81 13.99 4.71 13.95C4.62 13.91 4.54 13.85 4.47 13.78L2.22 11.53C2.08 11.39 2 11.2 2 11C2 10.8 2.08 10.61 2.22 10.47L4.47 8.22C4.61 8.08 4.8 8 5 8C5.2 8 5.39 8.08 5.53 8.22Z"
								fill="currentColor"
							/>
						) : (
							<m.path
								key="secondary-animate"
								initial={{ opacity: 1, x: 0 }}
								animate={{
									opacity: 1,
									x: 0,
								}}
								exit={{
									opacity: 0,
									x: -16,
									filter: "blur(2px)",
								}}
								d="M5.53 8.22C5.67 8.36 5.75 8.55 5.75 8.75C5.75 8.95 5.67 9.14 5.53 9.28L4.56 10.25H10.25C10.45 10.25 10.64 10.33 10.78 10.47C10.92 10.61 11 10.8 11 11C11 11.2 10.92 11.39 10.78 11.53C10.64 11.67 10.45 11.75 10.25 11.75H4.56L5.53 12.72C5.6 12.79 5.66 12.87 5.7 12.96C5.74 13.06 5.77 13.15 5.77 13.26C5.77 13.36 5.75 13.46 5.71 13.55C5.68 13.64 5.62 13.73 5.55 13.8C5.48 13.87 5.39 13.93 5.3 13.96C5.21 14 5.11 14.02 5.01 14.02C4.9 14.02 4.81 13.99 4.71 13.95C4.62 13.91 4.54 13.85 4.47 13.78L2.22 11.53C2.08 11.39 2 11.2 2 11C2 10.8 2.08 10.61 2.22 10.47L4.47 8.22C4.61 8.08 4.8 8 5 8C5.2 8 5.39 8.08 5.53 8.22Z"
								fill="currentColor"
							/>
						)}
					</AnimatePresence>
				</MotionConfig>
			</svg>
		</div>
	);
};

export { VerticalIconSwitch };
