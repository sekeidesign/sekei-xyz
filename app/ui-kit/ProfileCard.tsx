"use client";

import {
	m,
	type MotionValue,
	useMotionTemplate,
	useSpring,
	useTransform,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { cn } from "./cn";

const MAX_TILT = 10;

const OFFSET_FACTOR = 100;

const SPRING = { stiffness: 350, damping: 20 };

const SEAL_MASK = 'url("/ai-seal.svg")';
const SEAL_SIZE = 97;

const SEAL_ROTATION = -12;

const SEAL_SHEEN =
	"linear-gradient(135deg, rgba(255,255,255,0.3) 0%, #fff 25%, rgba(255,255,255,0.35) 50%, #fff 75%, rgba(255,255,255,0.3) 100%)";

const MotionLink = m.create(Link);

export function ProfileCard({ className }: { className?: string }) {
	const cardRef = useRef<HTMLAnchorElement>(null);
	const z = useSpring(0);
	const rotateX = useSpring(0, SPRING);
	const rotateY = useSpring(0, SPRING);
	const offsetX = useSpring(0, SPRING);
	const offsetY = useSpring(0, SPRING);
	const sheen = useSpring(0, SPRING);
	const sealX = useSpring(50, SPRING);
	const sealY = useSpring(50, SPRING);
	const sealHighlight = useMotionTemplate`${sealX}% ${sealY}%`;
	const sealOpacity = useTransform(sheen, [0, 1], [0.5, 1]);

	const settle = () => {
		rotateX.set(0);
		rotateY.set(0);
		offsetX.set(0);
		offsetY.set(0);
		z.set(0);
		sheen.set(0);
		sealX.set(50);
		sealY.set(50);
	};

	return (
		<MotionLink
			ref={cardRef}
			href="/timeline"
			style={{ transformPerspective: 500, z, rotateX, rotateY }}
			onPointerMove={(event) => {
				if (event.pointerType !== "mouse" || !cardRef.current) return;

				const rect = cardRef.current.getBoundingClientRect();
				const xPercent = (event.clientX - rect.left) / rect.width;
				const yPercent = (event.clientY - rect.top) / rect.height;

				rotateX.set(MAX_TILT * (0.5 - yPercent));
				rotateY.set(MAX_TILT * (xPercent - 0.5));
				offsetX.set((1 - xPercent) * OFFSET_FACTOR);
				offsetY.set((1 - yPercent) * OFFSET_FACTOR);

				sealX.set(xPercent * 100);
				sealY.set(yPercent * 100);
			}}
			onPointerEnter={(event) => {
				if (event.pointerType !== "mouse") return;
				z.set(10);
				sheen.set(1);
			}}
			onPointerLeave={settle}
			onPointerCancel={settle}
			onPointerDown={(event) => {
				if (event.pointerType === "mouse") z.set(-10);
			}}
			onPointerUp={(event) => {
				if (event.pointerType === "mouse") z.set(10);
			}}
			className={cn(
				"bg-gray-100 p-4 flex flex-col gap-4 relative overflow-hidden hover:will-change-transform",
				"ring ring-transparent",
				"rounded-sm hover:rounded-xl hover:ring-gray-500/6 hover:shadow-skew",
				"transition-[border-radius,box-shadow] duration-300 ease-out",
				className,
			)}
		>
			<Sweep
				offsetX={offsetX}
				offsetY={offsetY}
				style={{ opacity: sheen }}
				className="z-20 from-white/0 via-white/75 to-white/0 from-20% via-35% to-50%"
			/>

			<m.div
				aria-hidden
				style={{
					width: SEAL_SIZE,
					height: SEAL_SIZE,
					rotate: SEAL_ROTATION,
					maskImage: SEAL_MASK,
					WebkitMaskImage: SEAL_MASK,
					maskSize: "contain",
					WebkitMaskSize: "contain",
					maskRepeat: "no-repeat",
					WebkitMaskRepeat: "no-repeat",
					backgroundImage: SEAL_SHEEN,
					backgroundSize: "200% 200%",
					backgroundPosition: sealHighlight,
					opacity: sealOpacity,
				}}
				// Touch never raises the sheen, so the seal would sit dimmed forever.
				className="absolute -right-3 -bottom-3 z-0 pointer-events-none max-md:opacity-100!"
			/>

			<div className="relative z-10 items-center flex md:items-start md:justify-between gap-2.5 md:gap-4">
				<Portrait offsetX={offsetX} offsetY={offsetY} />
				<div className="relative z-10 flex-1 block md:hidden">
					<h1 className="font-[550] text-gray-800 w-full">PG Gonni</h1>
					<h2 className="font-[450] text-xs text-gray-500 w-full">Design Engineer</h2>
				</div>
				<Coordinates />
			</div>

			<div className="relative z-10 hidden md:block">
				<h1 className="font-[550] text-gray-800 w-full">PG Gonni</h1>
				<h2 className="font-[450] text-gray-500 w-full">Design Engineer</h2>
			</div>
		</MotionLink>
	);
}

const PLACES = [
	{ place: "Forlì", lat: "44.2093° N", lon: "12.0673° E" },
	{ place: "Montréal", lat: "45.4905° N", lon: "73.5587° W" },
];

function Coordinates() {
	return (
		<div className="hidden md:flex flex-col items-end gap-0.5 shrink-0 font-mono text-[9px] leading-[1.5] font-[350] text-gray-300">
			{PLACES.map(({ place, lat, lon }) => (
				<span key={place}>
					<span className="sr-only">{`${place}: `}</span>
					{lat}, {lon}
				</span>
			))}
		</div>
	);
}

function Sweep({
	offsetX,
	offsetY,
	className,
	style,
	scale = 1,
}: {
	offsetX: MotionValue<number>;
	offsetY: MotionValue<number>;
	className?: string;
	style?: Record<string, unknown>;
	scale?: number | { x: number; y: number };
}) {
	const { x, y } = typeof scale === "number" ? { x: scale, y: scale } : scale;

	return (
		<m.div
			style={{
				translateX: offsetX,
				translateY: offsetY,
				width: `calc(${x * 100}% + ${OFFSET_FACTOR * 2}px)`,
				height: `calc(${y * 100}% + ${OFFSET_FACTOR * 2}px)`,
				...style,
			}}
			transition={{ type: "spring", ...SPRING }}
			className={cn(
				"hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-linear-to-br",
				className,
			)}
		/>
	);
}

function Portrait({
	offsetX,
	offsetY,
}: {
	offsetX: MotionValue<number>;
	offsetY: MotionValue<number>;
}) {
	return (
		<div className="relative z-10 w-8 h-10 md:w-16 md:h-19 shrink-0 rounded-sm overflow-hidden ring ring-gray-500/10 ring-inset inset-shadow-xs">
			<Sweep
				offsetX={offsetX}
				offsetY={offsetY}
				scale={1.25}
				className="z-20 from-white/0 via-white/90 to-white/0 from-30% via-35% to-40%"
			/>
			<m.div
				style={{
					translateX: offsetX,
					translateY: offsetY,
					width: `calc(150% + ${OFFSET_FACTOR * 2}px)`,
					height: `calc(125% + ${OFFSET_FACTOR * 2}px)`,
				}}
				transition={{ type: "spring", ...SPRING }}
				className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-radial-[at_50%_0%] from-violet-500 via-yellow-500 to-sky-500 to-80% opacity-25 brightness-135"
			/>
			<Image
				src="/avatar-cutout.webp"
				alt="PG Gonni"
				width={332}
				height={365}
				className="relative z-30 size-full object-cover -scale-x-100"
			/>
		</div>
	);
}
