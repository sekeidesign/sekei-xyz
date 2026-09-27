"use client";

import { useState } from "react";
import { Button } from "@ui-kit/Button";
import { Globe, SPHERE } from "@ui-kit/Globe";
import { ProfileCard } from "@ui-kit/ProfileCard";

export function ProfileThumb() {
	return (
		// The card is 169px tall in a 192px preview, which leaves 12px above and
		// below; 8px past full width brings the sides to the same 12px.
		<div className="w-[calc(100%+8px)]">
			<ProfileCard />
		</div>
	);
}

/** The sphere's width as a share of the card's. */
const THUMB_GLOBE = 0.9;

export function GlobeThumb() {
	const box = THUMB_GLOBE / SPHERE.diameter;
	const rise = 1 - SPHERE.diameter / 2;

	return (
		<div className="relative -m-4 flex-1 self-stretch">
			<div
				className="absolute top-4 left-1/2 aspect-square"
				style={{
					width: `${box * 100}%`,
					translate: `calc(${SPHERE.offset.x}px - 100%) calc(${SPHERE.offset.y}px - ${rise * 100}%)`,
				}}
			>
				<Globe className="absolute inset-0" />
			</div>
		</div>
	);
}

export function Profile() {
	return (
		<div className="w-full max-w-xs">
			<ProfileCard />
		</div>
	);
}

const CITIES: [string, [number, number]][] = [
	["Montréal", [45.5019, -73.5674]],
	["Tokyo", [35.6762, 139.6503]],
	["Lisbon", [38.7223, -9.1393]],
];

export function GlobeDemo() {
	const [city, setCity] = useState(0);

	return (
		<div className="flex flex-col items-center gap-4">
			<div className="relative w-72 h-44 overflow-hidden rounded-xl bg-white ring ring-gray-500/10 shadow-skew">
				<Globe location={CITIES[city][1]} className="absolute inset-0" />
			</div>
			<div className="flex gap-1.5">
				{CITIES.map(([name], index) => (
					<Button
						key={name}
						className="pl-2.5"
						aria-pressed={index === city}
						onClick={() => setCity(index)}
					>
						{name}
					</Button>
				))}
			</div>
		</div>
	);
}
