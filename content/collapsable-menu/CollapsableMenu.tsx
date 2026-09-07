import { BellIcon, EnvelopeIcon, HomeIcon } from "@heroicons/react/20/solid";
import { cn } from "@ui-kit/cn";
import { m, useDragControls } from "motion/react";
import {
	createContext,
	type ReactNode,
	useContext,
	useMemo,
	useRef,
	useState,
} from "react";
import useMeasure from "react-use-measure";

const DRAG_THRESHOLD = 88;

interface CollapsableMenuContextValue {
	isDetached: boolean;
	setIsDetached: (detached: boolean) => void;
}

const CollapsableMenuContext =
	createContext<CollapsableMenuContextValue | null>(null);

interface CollapsableMenuProviderProps {
	children: ReactNode;
}

const CollapsableMenuProvider = ({
	children,
}: CollapsableMenuProviderProps) => {
	const [isDetached, setIsDetached] = useState(false);
	const value = useMemo(() => ({ isDetached, setIsDetached }), [isDetached]);

	return (
		<CollapsableMenuContext.Provider value={value}>
			{children}
		</CollapsableMenuContext.Provider>
	);
};

const CollapsableMenuItem = ({
	icon,
	label,
}: {
	icon: ReactNode;
	label: string;
}) => {
	const { isDetached } = useCollapsableMenu();
	const [ref, { width }] = useMeasure();
	return (
		<m.div className="py-1 px-2 bg-gray-100 h-8 min-w-8 overflow-hidden hover:bg-gray-200 rounded-full text-sm text-gray-500 flex items-center justify-center">
			{icon}
			<m.div
				animate={{
					x: isDetached ? 8 : 0,
					width: isDetached ? 0 : width,
					transition: { type: "spring", duration: 0.4, bounce: 0.1 },
				}}
			>
				<span className="font-[500] pl-1" ref={ref}>
					{label}
				</span>
			</m.div>
		</m.div>
	);
};

const useCollapsableMenu = () => {
	const context = useContext(CollapsableMenuContext);
	if (!context) {
		throw new Error(
			"useCollapsableMenu must be used within a CollapsableMenuProvider",
		);
	}
	return context;
};

const CollapsableMenu = () => {
	const dragWrapperRef = useRef<HTMLDivElement>(null);
	const { isDetached, setIsDetached } = useCollapsableMenu();
	const dragControls = useDragControls();
	const [debug, setDebug] = useState(false);
	const [isOverHome, setIsOverHome] = useState(false);
	const islandHome = useRef<HTMLDivElement>(null);
	const startDrag = (event: React.PointerEvent<Element>) => {
		dragControls.start(event, { snapToCursor: false });
	};

	const isWithinIslandHome = (
		event: PointerEvent | MouseEvent | TouchEvent,
	) => {
		const islandHomeRect = islandHome?.current?.getBoundingClientRect();
		if (!islandHomeRect) return false;

		const pointerX = "clientX" in event ? event.clientX : 0;
		const pointerY = "clientY" in event ? event.clientY : 0;
		return (
			pointerX >= islandHomeRect.left &&
			pointerX <= islandHomeRect.right &&
			pointerY >= islandHomeRect.top &&
			pointerY <= islandHomeRect.bottom
		);
	};

	const endDrag = (event: PointerEvent | MouseEvent | TouchEvent) => {
		if (!islandHome.current) return;

		if (isWithinIslandHome(event) && isDetached) {
			if (debug) console.log("Snapping back to home");
			setIsDetached(false);
		}

		setIsOverHome(false);
	};

	return (
		<div
			ref={dragWrapperRef}
			className="w-full h-full flex items-end justify-center p-4 relative"
		>
			<div
				ref={islandHome}
				className={cn(
					`absolute bottom-0 left-0 w-full h-[100px] bg-gray-100/50 z-0 border-t border-gray-200 border-dashed flex items-start justify-center text-xs text-gray-300 font-[450]`,
					debug ? "opacity-100" : "opacity-0",
					isOverHome && isDetached && "opacity-100",
				)}
			>
				<span className={cn("-mt-6", isDetached && "opacity-0")}>
					Drag outside this area to detach
				</span>
				<span
					className={cn(
						"-mt-6 absolute left-1/2 -translate-x-1/2 opacity-0",
						isOverHome && isDetached && "opacity-100",
					)}
				>
					Release to snap back
				</span>
			</div>
			<m.div
				drag
				dragControls={dragControls}
				dragConstraints={
					isDetached ? dragWrapperRef : { top: 0, right: 0, bottom: 0, left: 0 }
				}
				dragTransition={{ bounceStiffness: 400, bounceDamping: 15 }}
				dragElastic={0.7}
				whileDrag={{ cursor: "grabbing" }}
				onDrag={(event, info) => {
					const dragDistance = Math.sqrt(info.offset.y ** 2);
					if (!isDetached && dragDistance > DRAG_THRESHOLD) {
						if (debug) console.log("Detached");
						setIsDetached(true);
					}

					if (isDetached && islandHome.current) {
						const isWithinBounds = isWithinIslandHome(event);

						setIsOverHome(isWithinBounds);

						if (isWithinBounds && debug) {
							console.log("Over home area");
						}
					}
				}}
				onDragEnd={(event) => {
					endDrag(event);
				}}
				className="flex relative items-center justify-center p-1 rounded-full gap-1 bg-white shadow-xl border border-gray-100 z-10"
			>
				<button
					type="button"
					aria-label="Drag to detach menu"
					className={cn(
						"w-7 h-1 bg-gray-300 rounded-full absolute -top-3 left-1/2 transition-transform duration-200 hover:scale-110 cursor-grab active:cursor-grabbing active:scale-100 -translate-x-1/2",
						"after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-[150%] after:rounded-full after:border after:border-red-500 after:border-dashed after:aspect-video",
						debug ? "after:opacity-100" : "after:opacity-0",
					)}
					onPointerDown={startDrag}
					onPointerUp={(event) => endDrag(event.nativeEvent)}
				/>

				<CollapsableMenuItem
					icon={<HomeIcon className="w-4 h-4" />}
					label="Home"
				/>
				<CollapsableMenuItem
					icon={<BellIcon className="w-4 h-4" />}
					label="Notifications"
				/>
				<CollapsableMenuItem
					icon={<EnvelopeIcon className="w-4 h-4" />}
					label="Messages"
				/>
			</m.div>
			<button
				type="button"
				className="bg-gray-100 hover:bg-gray-200 hover:text-gray-500 cursor-pointer rounded-md px-2 py-1 text-xs font-[500] text-gray-400 absolute bottom-2 right-2"
				onClick={() => setDebug(!debug)}
			>
				{debug ? "Hide" : "Debug"}
			</button>
		</div>
	);
};

export { CollapsableMenuProvider, useCollapsableMenu };
export default CollapsableMenu;
