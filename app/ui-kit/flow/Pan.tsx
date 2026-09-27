"use client";

import { m, useMotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../cn";

const STEP = 48;

/**
 * A horizontal viewport that's dragged rather than scrolled. Content narrower
 * than the viewport sits centred and stays put.
 */
export function Pan({
	className,
	children,
	"aria-label": label = "Diagram",
}: {
	className?: string;
	children: React.ReactNode;
	"aria-label"?: string;
}) {
	const viewport = useRef<HTMLDivElement>(null);
	const content = useRef<HTMLDivElement>(null);
	const x = useMotionValue(0);
	const [min, setMin] = useState(0);
	const [dragging, setDragging] = useState(false);
	const drag = useRef<{ pointer: number; from: number } | null>(null);
	const overflows = min < 0;

	useEffect(() => {
		const outer = viewport.current;
		const inner = content.current;
		if (!outer || !inner) return;

		// offsetWidth, not getBoundingClientRect: the content's own translate
		// would otherwise feed back into its measured position.
		const measure = () => {
			const room = outer.offsetWidth - inner.offsetWidth;
			if (room >= 0) {
				setMin(0);
				x.set(room / 2);
			} else {
				setMin(room);
				x.set(Math.min(0, Math.max(room, x.get())));
			}
		};

		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(outer);
		observer.observe(inner);
		return () => observer.disconnect();
	}, [x]);

	const clamp = (value: number) => Math.min(0, Math.max(min, value));

	useEffect(() => {
		const outer = viewport.current;
		if (!outer || !overflows) return;

		// React's onWheel is passive, and a sideways trackpad swipe has to be
		// kept from turning into browser back/forward navigation.
		const onWheel = (event: WheelEvent) => {
			if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
			event.preventDefault();
			x.set(Math.min(0, Math.max(min, x.get() - event.deltaX)));
		};

		outer.addEventListener("wheel", onWheel, { passive: false });
		return () => outer.removeEventListener("wheel", onWheel);
	}, [min, overflows, x]);

	return (
		<div
			ref={viewport}
			role="group"
			aria-label={overflows ? `${label}, drag or use arrow keys to pan` : label}
			tabIndex={overflows ? 0 : undefined}
			onPointerDown={(event) => {
				if (!overflows || event.button !== 0) return;
				event.currentTarget.setPointerCapture(event.pointerId);
				drag.current = { pointer: event.clientX, from: x.get() };
				setDragging(true);
			}}
			onPointerMove={(event) => {
				if (!drag.current) return;
				x.set(clamp(drag.current.from + event.clientX - drag.current.pointer));
			}}
			onPointerUp={() => {
				drag.current = null;
				setDragging(false);
			}}
			onPointerCancel={() => {
				drag.current = null;
				setDragging(false);
			}}
			onKeyDown={(event) => {
				if (!overflows) return;
				if (event.key === "ArrowLeft") x.set(clamp(x.get() + STEP));
				else if (event.key === "ArrowRight") x.set(clamp(x.get() - STEP));
				else return;
				event.preventDefault();
			}}
			className={cn(
				"relative w-full overflow-hidden focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
				overflows && "touch-pan-y select-none",
				overflows && (dragging ? "cursor-grabbing" : "cursor-grab"),
				className,
			)}
		>
			<m.div ref={content} style={{ x }} className="w-max">
				{children}
			</m.div>
		</div>
	);
}
