"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "./cn";

const OPEN_MS = 420;
const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
/** Fraction of the viewport the expanded photo may occupy. */
const FIT = 0.9;

// Read at module scope: `document` is unavailable while React renders on the
// server, and this component is only ever mounted from a click.
const portalTarget = typeof document === "undefined" ? null : document.body;

export interface LightboxRect {
	left: number;
	top: number;
	width: number;
	height: number;
}

export interface LightboxPhoto {
	src: string;
	alt: string;
	width: number;
	height: number;
}

function computeTarget(aspect: number): LightboxRect {
	const vw = window.innerWidth;
	const vh = window.innerHeight;
	const width = Math.min(vw * FIT, (vh * FIT) / aspect);
	const height = width * aspect;
	return { left: (vw - width) / 2, top: (vh - height) / 2, width, height };
}

export function PhotoLightbox({
	photo,
	start,
	getHome,
	onClosed,
}: {
	photo: LightboxPhoto;
	/** The thumbnail's geometry at click time. */
	start: LightboxRect;
	/** Re-measures the thumbnail at dismiss time. */
	getHome: () => LightboxRect | null;
	onClosed: () => void;
}) {
	const aspect = photo.height / photo.width;
	// Measured once, at mount: the FLIP's destination must not move under it.
	const [{ left, top, width, height }] = useState(() => computeTarget(aspect));

	const reduceMotion = usePrefersReducedMotion();

	const toTransform = useCallback(
		(home: LightboxRect) =>
			`translate(${home.left - left}px, ${home.top - top}px) scale(${home.width / width}, ${home.height / height})`,
		[left, top, width, height],
	);

	const [entered, setEntered] = useState(reduceMotion);
	// Drives the will-change hint below: promoted for the flight, released once
	// the transform lands. Starts settled under reduced motion, where there is
	// no transition and so no transitionend.
	const [settled, setSettled] = useState(reduceMotion);
	const [transform, setTransform] = useState(() =>
		reduceMotion ? "none" : toTransform(start),
	);
	const closing = useRef(false);

	// FLIP: first paint sits over the thumbnail, next frame eases to center.
	useLayoutEffect(() => {
		if (reduceMotion) return;
		let inner = 0;
		const outer = requestAnimationFrame(() => {
			inner = requestAnimationFrame(() => {
				setEntered(true);
				setTransform("translate(0px, 0px) scale(1, 1)");
			});
		});
		return () => {
			cancelAnimationFrame(outer);
			cancelAnimationFrame(inner);
		};
	}, [reduceMotion]);

	const dismiss = useCallback(() => {
		if (closing.current) return;
		closing.current = true;
		if (reduceMotion) {
			onClosed();
			return;
		}
		setSettled(false);
		setEntered(false);
		setTransform(toTransform(getHome() ?? start));
		// transitionend is the primary signal; this is the safety net.
		window.setTimeout(onClosed, OPEN_MS + 80);
	}, [reduceMotion, onClosed, toTransform, getHome, start]);

	// A native modal dialog, for the focus trap and Escape a role="dialog" div
	// doesn't get. Opened in a layout effect so the FLIP's first frame paints
	// with it already in the top layer.
	const dialogRef = useRef<HTMLDialogElement>(null);
	useLayoutEffect(() => {
		dialogRef.current?.showModal();
	}, []);

	if (!portalTarget) return null;

	return createPortal(
		<dialog
			ref={dialogRef}
			aria-label={photo.alt}
			className="fixed inset-0 z-[999] h-auto w-auto max-h-none max-w-none overflow-hidden bg-transparent backdrop:bg-transparent"
			// Escape runs the dismiss flight rather than closing outright.
			onCancel={(event) => {
				event.preventDefault();
				dismiss();
			}}
		>
			<button
				type="button"
				aria-label="Close"
				className={cn(
					"absolute inset-0 cursor-zoom-out bg-black/70 transition-opacity outline-hidden",
					entered ? "opacity-100" : "opacity-0",
				)}
				style={{ transitionDuration: `${OPEN_MS}ms` }}
				onClick={dismiss}
			/>
			<figure
				className="absolute overflow-hidden rounded-sm shadow-2xl"
				style={{
					left,
					top,
					width,
					height,
					transform,
					transformOrigin: "top left",
					transition: reduceMotion
						? undefined
						: `transform ${OPEN_MS}ms ${EASE}`,
					willChange: settled ? undefined : "transform",
				}}
				onTransitionEnd={(event) => {
					if (event.propertyName !== "transform") return;
					if (closing.current) onClosed();
					else setSettled(true);
				}}
			>
				<button
					type="button"
					aria-label="Close"
					onClick={dismiss}
					className="block h-full w-full cursor-zoom-out"
				>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img // react-doctor-disable-line nextjs-no-img-element -- arbitrary media, with no intrinsic size for next/image to work from
						src={photo.src}
						alt={photo.alt}
						className="block h-full w-full object-cover"
					/>
				</button>
			</figure>
		</dialog>,
		portalTarget,
	);
}
