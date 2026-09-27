"use client";

import { type CSSProperties, useState } from "react";
import {
	ControlPanel,
	ControlSection,
} from "@ui-kit/controls/ControlPanel";
import { Slider } from "@ui-kit/controls/Slider";
import { Toggle } from "@ui-kit/controls/Toggle";
import { SocialBar } from "@ui-kit/social/SocialBar";
import { SocialProvider } from "@ui-kit/social/SocialProvider";

/** Starting counts, so the digit roll has something to roll. */
const SEED = { "playground": { fire: 132, link: 16 } };

/** The live social bar plus its knobs, on the memory transport — clicking never reaches Redis. */
export function SocialBarPlayground() {
	const [gap, setGap] = useState(3);
	const [dot, setDot] = useState(0.5);
	const [rippleMs, setRippleMs] = useState(800);
	const [rippleDelay, setRippleDelay] = useState(80);
	const [pressScale, setPressScale] = useState(0.8);
	const [pressReturn, setPressReturn] = useState(340);
	const [lattice, setLattice] = useState(false);

	// Cascades to the bar below; every value is read with a var() fallback, so
	// these override the shipped defaults without touching them.
	const vars = {
		"--dot-gap": `${gap}px`,
		"--dot-size": `${dot}px`,
		"--ripple-duration": `${rippleMs}ms`,
		"--ripple-delay": `${rippleDelay}ms`,
		"--press-scale": `${pressScale}`,
		"--press-return": `${pressReturn}ms`,
		...(lattice ? { "--dot-color": "var(--color-gray-400)" } : {}),
	} as CSSProperties;

	return (
		// The stage's own padding is off (previewClassName: p-0), so the panel sits
		// flush and the bar side carries the padding instead.
		<div
			style={vars}
			className="flex flex-col md:flex-row items-stretch w-full self-stretch"
		>
			<div className="flex-1 flex items-center justify-center p-8 md:p-10">
				<SocialProvider transport="memory" seed={SEED} slugs={["playground"]}>
					<SocialBar slug="playground" sharePath="/p/social-bar" />
				</SocialProvider>
			</div>

			<ControlPanel className="w-full md:w-2/5 shrink-0 rounded-none ring-0 shadow-none border-t md:border-t-0 md:border-l border-gray-200">
				<ControlSection label="Lattice" />
				<Slider label="Spacing" value={gap} min={2} max={8} step={1} showSteps unit="px" onChange={setGap} />
				<Slider label="Dot size" value={dot} min={0.5} max={1.5} step={0.25} showSteps unit="px" onChange={setDot} />
				<Toggle label="Visibility" checked={lattice} onChange={setLattice} />

				<ControlSection label="Wave" />
				<Slider label="Duration" value={rippleMs} min={100} max={4000} step={100} unit="ms" onChange={setRippleMs} />
				<Slider label="Delay" value={rippleDelay} min={0} max={600} step={20} unit="ms" onChange={setRippleDelay} />

				<ControlSection label="Press" />
				<Slider label="Depth" value={pressScale} min={0.5} max={1} step={0.05} showSteps unit="×" onChange={setPressScale} />
				<Slider label="Spring back" value={pressReturn} min={60} max={600} step={20} unit="ms" onChange={setPressReturn} />
			</ControlPanel>
		</div>
	);
}
