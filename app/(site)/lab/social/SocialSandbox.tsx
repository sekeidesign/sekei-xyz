"use client";

import { type CSSProperties, useState } from "react";
import { Post } from "@ui-kit/post/Post";
import { SocialBar } from "@ui-kit/social/SocialBar";
import { SocialProvider } from "@ui-kit/social/SocialProvider";

const CASES = [
	{ slug: "lab-zero", label: "Fresh — both at zero" },
	{ slug: "lab-small", label: "A few reactions" },
	{ slug: "lab-large", label: "Four figures, to check the roll and width" },
	{ slug: "lab-code", label: "With the source link, as on an experiment" },
];

const SEED = {
	"lab-zero": { fire: 0, link: 0 },
	"lab-small": { fire: 7, link: 2 },
	"lab-large": { fire: 1298, link: 461 },
	"lab-code": { fire: 132, link: 16 },
};

function Slider({
	label,
	value,
	min,
	max,
	step,
	unit = "px",
	onChange,
}: {
	label: string;
	value: number;
	min: number;
	max: number;
	step: number;
	unit?: string;
	onChange: (value: number) => void;
}) {
	return (
		<label className="flex items-center gap-3 text-[13px] leading-[1.43] font-[420] text-gray-500">
			<span className="w-24 shrink-0">{label}</span>
			<input
				type="range"
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={(event) => onChange(Number(event.target.value))}
				className="w-48 accent-gray-900"
			/>
			<span className="tabular-nums text-gray-900 w-14">
				{value}
				{unit}
			</span>
		</label>
	);
}

export function SocialSandbox() {
	const [gap, setGap] = useState(3);
	const [size, setSize] = useState(0.5);
	const [rippleMs, setRippleMs] = useState(800);
	const [rippleDelay, setRippleDelay] = useState(80);
	const [pressScale, setPressScale] = useState(0.8);
	const [pressReturn, setPressReturn] = useState(340);
	const [visible, setVisible] = useState(false);

	// Cascades to every .dot-matrix and .dot-ripple below, which read these with
	// var() fallbacks rather than declaring their own defaults.
	const lattice = {
		"--dot-gap": `${gap}px`,
		"--dot-size": `${size}px`,
		"--ripple-duration": `${rippleMs}ms`,
		"--ripple-delay": `${rippleDelay}ms`,
		"--press-scale": `${pressScale}`,
		"--press-return": `${pressReturn}ms`,
		...(visible ? { "--dot-color": "var(--color-gray-400)" } : {}),
	} as CSSProperties;

	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col gap-3 rounded-xl bg-gray-500/5 outline outline-1 outline-gray-500/10 p-4">
				<Slider
					label="Spacing"
					value={gap}
					min={2}
					max={20}
					step={1}
					onChange={setGap}
				/>
				<Slider
					label="Dot size"
					value={size}
					min={0.5}
					max={4}
					step={0.5}
					onChange={setSize}
				/>
				<Slider
					label="Ripple time"
					value={rippleMs}
					min={100}
					max={4000}
					step={100}
					unit="ms"
					onChange={setRippleMs}
				/>
				<Slider
					label="Ripple delay"
					value={rippleDelay}
					min={0}
					max={600}
					step={20}
					unit="ms"
					onChange={setRippleDelay}
				/>
				<Slider
					label="Press depth"
					value={pressScale}
					min={0.5}
					max={1}
					step={0.05}
					unit="×"
					onChange={setPressScale}
				/>
				<Slider
					label="Spring back"
					value={pressReturn}
					min={60}
					max={600}
					step={20}
					unit="ms"
					onChange={setPressReturn}
				/>
				<label className="flex items-center gap-3 text-[13px] leading-[1.43] font-[420] text-gray-500">
					<span className="w-24 shrink-0">Show lattice</span>
					<input
						type="checkbox"
						checked={visible}
						onChange={(event) => setVisible(event.target.checked)}
						className="size-4 accent-gray-900"
					/>
					<span className="text-gray-400">
						debug only — hidden by default, so only the ripple lights dots
					</span>
				</label>
			</div>

			<SocialProvider
				transport="memory"
				seed={SEED}
				slugs={CASES.map((c) => c.slug)}
			>
				<div style={lattice} className="flex flex-col gap-8">
					{CASES.map(({ slug, label }) => (
						<div key={slug} className="flex flex-col gap-2">
							<span className="text-[13px] leading-[1.43] font-[420] text-gray-500">
								{label}
							</span>
							<Post.Footer>
								<SocialBar slug={slug} sharePath={`/lab/social#${slug}`} />
								{slug === "lab-code" && (
									<Post.CodeLink href="https://github.com/sekeidesign/sekei-xyz" />
								)}
							</Post.Footer>
						</div>
					))}
				</div>
			</SocialProvider>
		</div>
	);
}
