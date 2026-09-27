"use client";

import createGlobe from "cobe";
import { animate } from "motion";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface GlobeProps {
	location?: [number, number];
	className?: string;
}

const MONTREAL: [number, number] = [45.5019, -73.5674];

// Apple Maps-style light blue, as an RGB 0-1 triple for cobe's markerColor.
const MARKER_COLOR: [number, number, number] = [0.31, 0.616, 1];

// Off-pole camera, so the globe shows curvature rather than a flat
// front-facing point.
const CAMERA_OFFSET = { lat: -8, long: 40 };

function locationToAngles(lat: number, long: number): [number, number] {
	return [
		Math.PI - ((long * Math.PI) / 180 - Math.PI / 2),
		(lat * Math.PI) / 180,
	];
}

// Shortest angular path, so animating across the ±180° meridian doesn't spin
// the long way round.
function shortestDelta(from: number, to: number) {
	const raw = (to - from) % (Math.PI * 2);
	return ((raw + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
}

function anglesFor(location: [number, number]) {
	return locationToAngles(
		location[0] + CAMERA_OFFSET.lat,
		location[1] + CAMERA_OFFSET.long,
	);
}

export const Globe = ({ location = MONTREAL, className }: GlobeProps) => {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
	const angleRef = useRef({ phi: 0, theta: 0 });
	const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
	const reduced = usePrefersReducedMotion();

	useEffect(() => {
		const wrapper = wrapperRef.current;
		if (!wrapper) return;

		const observer = new ResizeObserver(([entry]) => {
			const { width, height } = entry.contentRect;
			setContainerSize({ width, height });
		});
		observer.observe(wrapper);

		return () => observer.disconnect();
	}, []);

	// Canvas is 2x the panel's width and height independently, so the sphere's
	// center lands on the panel's bottom-right corner at any aspect ratio.
	const width = containerSize.width * 2;
	const height = containerSize.height * 2;

	// Recreate only on size change — a location change animates the existing
	// instance instead of snapping.
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || !width || !height) return;

		const [phi, theta] = anglesFor(location);
		angleRef.current = { phi, theta };

		const scale = (0.6 * Math.max(width, height)) / (0.8 * height);

		const globe = createGlobe(canvas, {
			devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
			width,
			height,
			phi,
			theta,
			dark: 0,
			diffuse: 1.2,
			mapSamples: 48000,
			mapBrightness: 6,
			baseColor: [1, 1, 1],
			markerColor: MARKER_COLOR,
			glowColor: [1, 1, 1],
			// Controls the sphere's apparent size independently of canvas
			// size/position — tune this instead of the canvas dimensions.
			scale,
			markers: [{ location, size: 0.04 }],
		});
		globeRef.current = globe;

		// cobe draws once, synchronously, before its base map texture has decoded,
		// and never redraws — force a few frames so the map appears.
		let frame = 0;
		let raf = requestAnimationFrame(function settle() {
			globe.update({});
			frame += 1;
			if (frame < 30) raf = requestAnimationFrame(settle);
		});

		return () => {
			cancelAnimationFrame(raf);
			globe.destroy();
			globeRef.current = null;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [width, height]);

	// Rotate to the new location whenever it changes, instead of snapping.
	useEffect(() => {
		const globe = globeRef.current;
		if (!globe || !width || !height) return;

		const [targetPhi, targetTheta] = anglesFor(location);
		const { phi: fromPhi, theta: fromTheta } = angleRef.current;
		const deltaPhi = shortestDelta(fromPhi, targetPhi);
		const deltaTheta = targetTheta - fromTheta;

		if (reduced) {
			angleRef.current = { phi: targetPhi, theta: targetTheta };
			globe.update({
				phi: targetPhi,
				theta: targetTheta,
				markers: [{ location, size: 0.045 }],
			});
			return;
		}

		const controls = animate(0, 1, {
			type: "spring",
			bounce: 0.15,
			duration: 0.9,
			onUpdate: (t) => {
				const phi = fromPhi + deltaPhi * t;
				const theta = fromTheta + deltaTheta * t;
				angleRef.current = { phi, theta };
				globe.update({ phi, theta, markers: [{ location, size: 0.045 }] });
			},
		});

		return () => controls.stop();
	}, [location, width, height, reduced]);

	return (
		<div ref={wrapperRef} className={className}>
			<canvas
				ref={canvasRef}
				className="absolute -top-10 -left-16"
				style={{ width, height }}
			/>
		</div>
	);
};

export type { GlobeProps };
