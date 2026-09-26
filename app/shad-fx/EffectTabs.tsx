"use client";

import { Tabs } from "@base-ui/react/tabs";
import { cn } from "@ui-kit/cn";
import { type Kind, KINDS } from "./playground-config";
import { FOCUS_RING } from "@ui-kit/focus";

const TAB =
	"relative z-10 flex h-[26px] cursor-pointer items-center rounded-full px-3 text-[14px] leading-[1.43] font-[500] whitespace-nowrap";
const TAB_OFF =
	"bg-gray-500/5 text-gray-500/75 hover:bg-gray-500/15 hover:text-gray-700";

export function EffectTabs({
	value,
	onChange,
}: {
	value: Kind;
	onChange: (value: Kind) => void;
}) {
	return (
		<Tabs.Root value={value} onValueChange={(next) => onChange(next as Kind)}>
			<Tabs.List className="relative -m-1 flex items-center gap-1 overflow-x-auto p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
				<Tabs.Indicator
					renderBeforeHydration
					className="absolute top-0 left-0 h-[var(--active-tab-height)] w-[var(--active-tab-width)] rounded-full bg-white shadow-skew ring-1 ring-gray-500/10 [translate:var(--active-tab-left)_var(--active-tab-top)] transition-[translate,width] duration-200 ease-out motion-reduce:transition-none"
				/>
				{KINDS.map((kind) => (
					<Tabs.Tab
						key={kind}
						value={kind}
						className={cn(
							TAB,
							FOCUS_RING,
							kind === value ? "text-gray-900/75" : TAB_OFF,
						)}
					>
						{kind}
					</Tabs.Tab>
				))}
			</Tabs.List>
		</Tabs.Root>
	);
}
