"use client";

import {
	ControlPanel,
	ControlRow,
	ControlSection,
} from "@ui-kit/controls/ControlPanel";
import { Slider } from "@ui-kit/controls/Slider";
import { ArrowIcon } from "@ui-kit/icons/ArrowIcon";
import {
	WIPE_BOUNDS,
	WIPE_DIRECTIONS,
	type WipeParams,
} from "@ui-kit/loading-wipe/wipe-shader";
import {
	type CSSProperties,
	type Dispatch,
	type RefObject,
	type SetStateAction,
	useCallback,
} from "react";

const COLOR_LABELS = ["Edge", "Mid 1", "Mid 2", "Tail"] as const;

type Stops = readonly [string, string, string, string];

/** Whole-ribbon presets, so landing on a combination that reads isn't four pickers of dialling. */
const PRESETS: readonly { name: string; colors: Stops }[] = [
	{ name: "Sky", colors: ["#6366f1", "#38bdf8", "#67e8f9", "#e0f2fe"] },
	{ name: "Ember", colors: ["#7c2d12", "#f54a00", "#fbbf24", "#fef3c7"] },
	{ name: "Dusk", colors: ["#312e81", "#7c3aed", "#c084fc", "#f3e8ff"] },
	{ name: "Moss", colors: ["#14532d", "#16a34a", "#86efac", "#ecfdf5"] },
	{ name: "Mono", colors: ["#111827", "#4b5563", "#9ca3af", "#e5e7eb"] },
];

/** Every knob behind the sweep. Writes to `params`; reads nothing about playback but the scrub position. */
export function WipeControls({
	params,
	setParams,
	scrub,
	scrubInputRef,
	onScrub,
}: {
	params: WipeParams;
	setParams: Dispatch<SetStateAction<WipeParams>>;
	scrub: number;
	scrubInputRef: RefObject<HTMLInputElement | null>;
	onScrub: (value: number) => void;
}) {
	const setNumber = useCallback(
		(key: keyof typeof WIPE_BOUNDS, value: number) => {
			setParams((prev) => ({ ...prev, [key]: value }));
		},
		[setParams],
	);

	const setColor = useCallback(
		(index: number, hex: string) => {
			setParams((prev) => {
				const colors = [...prev.colors] as [string, string, string, string];
				colors[index] = hex;
				return { ...prev, colors };
			});
		},
		[setParams],
	);

	return (
		<ControlPanel className="max-h-[320px] w-full shrink-0 overflow-y-auto rounded-none border-t border-gray-200 shadow-none ring-0 md:max-h-none md:w-2/5 md:border-t-0 md:border-l">
			<ControlSection label="Colour">
				<div className="flex flex-wrap gap-1.5 px-3 py-2">
					{PRESETS.map((preset) => {
						const active =
							preset.colors.length === params.colors.length &&
							preset.colors.every((c, i) => c === params.colors[i]);
						return (
							<button
								key={preset.name}
								type="button"
								aria-pressed={active}
								onClick={() =>
									setParams((prev) => ({ ...prev, colors: preset.colors }))
								}
								className={
									active
										? "flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-900 py-1 pr-2.5 pl-1 text-[12px] font-[450] text-white shadow-skew"
										: "flex cursor-pointer items-center gap-1.5 rounded-full bg-white py-1 pr-2.5 pl-1 text-[12px] font-[450] text-gray-500 shadow-skew ring-1 ring-gray-500/10 hover:bg-gray-50"
								}
							>
								<span
									className="h-4 w-6 shrink-0 rounded-full ring-1 ring-gray-900/10"
									style={{
										background: `linear-gradient(90deg, ${preset.colors.join(", ")})`,
									}}
								/>
								{preset.name}
							</button>
						);
					})}
				</div>
				<ControlRow label="Ribbon">
					<div className="grid w-full grid-cols-4 gap-1.5">
						{params.colors.map((hex, i) => (
							<input
								key={COLOR_LABELS[i]}
								type="color"
								value={hex}
								aria-label={COLOR_LABELS[i]}
								title={COLOR_LABELS[i]}
								onChange={(event) => setColor(i, event.target.value)}
								className="control-swatch"
							/>
						))}
					</div>
				</ControlRow>
			</ControlSection>

			<ControlSection label="Sweep">
				<div className="px-3 py-2">
					<div className="grid grid-cols-8 gap-1">
						{WIPE_DIRECTIONS.map((direction) => {
							const active = Math.round(params.angleDeg) === direction.angleDeg;
							return (
								<button
									key={direction.angleDeg}
									type="button"
									title={direction.name}
									aria-label={direction.name}
									aria-pressed={active}
									onClick={() => setNumber("angleDeg", direction.angleDeg)}
									className={
										active
											? "flex h-6 cursor-pointer items-center justify-center rounded-md bg-gray-900 text-white shadow-skew"
											: "flex h-6 cursor-pointer items-center justify-center rounded-md bg-white text-gray-500 shadow-skew ring-1 ring-gray-500/10 hover:bg-gray-50"
									}
								>
									{/* One glyph, turned: the icon is drawn pointing up, and the sweep angle is
									    measured from left-to-right. */}
									<ArrowIcon size={14} rotate={direction.angleDeg + 90} />
								</button>
							);
						})}
					</div>
				</div>
				<Slider
					label="Angle"
					value={params.angleDeg}
					{...WIPE_BOUNDS.angleDeg}
					unit="°"
					onChange={(v) => setNumber("angleDeg", v)}
				/>
				<Slider
					label="Duration"
					value={params.durationMs}
					{...WIPE_BOUNDS.durationMs}
					unit="ms"
					onChange={(v) => setNumber("durationMs", v)}
				/>
				<ControlRow label="Scrub" value={scrub.toFixed(2)}>
					<input
						ref={scrubInputRef}
						type="range"
						min={0}
						max={1}
						step={0.01}
						value={scrub}
						aria-label="Scrub"
						onChange={(event) => onScrub(Number(event.target.value))}
						style={{ "--fill": `${scrub * 100}%` } as CSSProperties}
						className="control-slider w-full"
					/>
				</ControlRow>
			</ControlSection>

			<ControlSection label="Ribbon">
				<Slider
					label="Spread"
					value={params.band}
					{...WIPE_BOUNDS.band}
					onChange={(v) => setNumber("band", v)}
				/>
				<Slider
					label="Bleed"
					value={params.bleed}
					{...WIPE_BOUNDS.bleed}
					onChange={(v) => setNumber("bleed", v)}
				/>
				<Slider
					label="Feather"
					value={params.feather}
					{...WIPE_BOUNDS.feather}
					onChange={(v) => setNumber("feather", v)}
				/>
				<Slider
					label="Swirl"
					value={params.swirl}
					{...WIPE_BOUNDS.swirl}
					onChange={(v) => setNumber("swirl", v)}
				/>
			</ControlSection>

			<ControlSection label="Edge noise">
				<Slider
					label="Turbulence"
					value={params.turbulence}
					{...WIPE_BOUNDS.turbulence}
					onChange={(v) => setNumber("turbulence", v)}
				/>
				<Slider
					label="Scale"
					value={params.noiseScale}
					{...WIPE_BOUNDS.noiseScale}
					onChange={(v) => setNumber("noiseScale", v)}
				/>
			</ControlSection>

			<ControlSection label="Grain">
				<Slider
					label="Size"
					value={params.grainSize}
					{...WIPE_BOUNDS.grainSize}
					unit="px"
					onChange={(v) => setNumber("grainSize", v)}
				/>
				<Slider
					label="Intensity"
					value={params.grainAmount}
					{...WIPE_BOUNDS.grainAmount}
					onChange={(v) => setNumber("grainAmount", v)}
				/>
			</ControlSection>
		</ControlPanel>
	);
}
