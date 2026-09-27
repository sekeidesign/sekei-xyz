"use client";

import { useState } from "react";
import { Button } from "@ui-kit/Button";
import { cn } from "@ui-kit/cn";
import { ControlPanel, ControlSection } from "@ui-kit/controls/ControlPanel";
import { Slider } from "@ui-kit/controls/Slider";
import { Flow } from "@ui-kit/flow/Flow";
import { Pan } from "@ui-kit/flow/Pan";
import { ResetIcon } from "@ui-kit/icons/ResetIcon";

const TRIAGE = `flowchart LR
  risk[Risk created/updated] --- dismiss[Dismiss] --- dismissed[Status: Dismissed]
  risk --- track[Track] --- open[Status: Open+]
  risk --- none[No action] --- monitoring[Status: Monitoring+]`;

const LIFECYCLE = `flowchart LR
  risk[Risk] --- link[Link action] --- mitigating[Status: Mitigating] --- completed[Actions completed] --- mitigated[Status: Mitigated] --- closed[Status: Closed]
  mitigated:T --> T:link
  risk --- realized[Status: Realized] --- issue[Create Issue] --- port[Port Actions + Decisions]
  port:T --> B:completed
  risk --- none[No action] --- monitoring[Status: Monitoring+]`;

const DOTS =
	"dot-matrix bg-gray-50 [--dot-color:var(--color-gray-200)] [--dot-gap:14px] [--dot-size:0.75px]";

function Replayable({ source, label }: { source: string; label: string }) {
	const [run, setRun] = useState(0);

	return (
		<div className={cn("relative flex min-h-72 items-center", DOTS)}>
			<Pan aria-label={label}>
				<Flow key={run} source={source} aria-label={label} className="p-12" />
			</Pan>
			<Button className="absolute right-3 bottom-3" onClick={() => setRun(run + 1)}>
				<ResetIcon />
				Replay
			</Button>
		</div>
	);
}

export function FlowThumb() {
	return <Flow source={TRIAGE} animate={false} aria-label="Risk triage flow" />;
}

export function FlowTriage() {
	return <Replayable source={TRIAGE} label="Risk triage flow" />;
}

export function FlowLifecycle() {
	return <Replayable source={LIFECYCLE} label="Risk lifecycle flow" />;
}

export function FlowPlayground() {
	const [source, setSource] = useState(LIFECYCLE);
	const [padding, setPadding] = useState(6);
	const [rows, setRows] = useState(30);
	const [columns, setColumns] = useState(40);
	const [clearance, setClearance] = useState(16);
	const [speed, setSpeed] = useState(500);
	const [run, setRun] = useState(0);

	return (
		<div className="flex flex-col lg:flex-row">
			<div className={cn("flex min-h-80 min-w-0 flex-1 items-center", DOTS)}>
				<Pan aria-label="Flow preview">
					<Flow
						key={run}
						source={source}
						padding={padding}
						rows={rows}
						columns={columns}
						clearance={clearance}
						speed={speed}
						className="p-12"
					/>
				</Pan>
			</div>
			<ControlPanel
				className={cn(
					"shrink-0 rounded-none bg-transparent shadow-none ring-0 lg:w-72",
					"border-t border-gray-200 lg:border-t-0 lg:border-l",
				)}
			>
				<ControlSection label="Source">
					<div className="p-2">
						<textarea
							aria-label="Mermaid source"
							value={source}
							rows={9}
							wrap="off"
							spellCheck={false}
							onChange={(event) => setSource(event.target.value)}
							className="w-full resize-y rounded-md bg-white px-2 py-1.5 font-mono text-[11px] leading-[1.6] text-gray-900 ring ring-gray-500/15 shadow-skew focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
						/>
					</div>
				</ControlSection>
				<ControlSection label="Layout">
					<Slider label="Padding" value={padding} min={0} max={24} step={1} unit="px" onChange={setPadding} />
					<Slider label="Rows" value={rows} min={8} max={80} step={1} unit="px" onChange={setRows} />
					<Slider label="Columns" value={columns} min={12} max={120} step={1} unit="px" onChange={setColumns} />
					<Slider label="Clearance" value={clearance} min={4} max={40} step={1} unit="px" onChange={setClearance} />
				</ControlSection>
				<ControlSection label="Motion">
					<Slider label="Speed" value={speed} min={100} max={2000} step={50} unit="px/s" onChange={setSpeed} />
					<div className="px-2 py-2">
						<Button onClick={() => setRun(run + 1)}>
							<ResetIcon />
							Replay
						</Button>
					</div>
				</ControlSection>
			</ControlPanel>
		</div>
	);
}
