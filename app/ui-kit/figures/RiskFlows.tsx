"use client";

import { Flow } from "../flow/Flow";
import { Pan } from "../flow/Pan";
import { Surface } from "../Surface";

const TRIAGE = `flowchart LR
  risk[Risk created/updated] --- dismiss[Dismiss] --- dismissed[Status: Dismissed]
  risk --- track[Track] --- open[Status: Open+]
  risk --- none[No action] --- monitoring[Status: Monitoring+]`;

const LIFECYCLE = `flowchart LR
  risk[Risk] --- link[Link action] --- mitigating[Status: Mitigating] --- completed[Actions completed] --- mitigated[Status: Mitigated] --- closed[Status: Closed]
  mitigated:T --> T:link
  risk --- realized[Status: Realized]
  risk --- certain[Likelihood: Certain]
  realized --- issue[Convert to Issue] --- port[Port Actions + Decisions]
  certain --- issue
  port:T --> B:completed
  risk --- score6[Risk score: 6+] --- owner6[Alert owner]
  risk --- score8[Risk score: 8+] --- owner8[Alert owner] --- pm[Alert PM]`;

const DOTS =
	"dot-matrix bg-gray-50 [--dot-color:var(--color-gray-200)] [--dot-gap:14px] [--dot-size:0.75px]";

function RiskFlow({ source, label }: { source: string; label: string }) {
	return (
		<Surface className="my-6 w-full" inner={{ className: `flex items-center ${DOTS}` }}>
			<Pan aria-label={label}>
				<Flow source={source} aria-label={label} className="p-10" />
			</Pan>
		</Surface>
	);
}

export function RiskTriage() {
	return <RiskFlow source={TRIAGE} label="Risk triage flow" />;
}

export function RiskLifecycle() {
	return <RiskFlow source={LIFECYCLE} label="Risk lifecycle flow" />;
}
