"use client";

import { Tooltip } from "@base-ui/react/tooltip";

export const TooltipProvider = Tooltip.Provider;

/**
 * One tooltip instance shared by every trigger. A Root per control unmounts one
 * popup and mounts another, so there is nothing to animate between; a handle
 * lets detached triggers drive a single Root.
 */
const handle = Tooltip.createHandle<string | React.ReactElement>();

/** `payload` is the label this control should show. */
export function TooltipTrigger(
	props: React.ComponentProps<typeof Tooltip.Trigger> & { payload: string | React.ReactElement },
) {
	return <Tooltip.Trigger handle={handle} {...props} />;
}

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const DURATION = "duration-[0.35s]";

/**
 * Mounted once, in the root layout.
 *
 * Positioner holds the size (`--positioner-*`) and animates position only;
 * Popup animates its own size via `--popup-*`; Viewport clips and slides its
 * `data-current` / `data-previous` children. Sizing the Popup off the
 * Positioner (`w-full h-full`) animates nothing.
 *
 * `data-instant` turns transitions off, for the Provider's delay grouping.
 * z-50 clears Book3D's open cover (z-20) — being portaled isn't enough.
 */
export function TooltipSurface() {
	return (
		<Tooltip.Root handle={handle}>
			{({ payload }: { payload: string | React.ReactElement | undefined }) => (
				<Tooltip.Portal>
					<Tooltip.Positioner
						side="top"
						sideOffset={6}
						className={`z-50 h-[var(--positioner-height)] w-[var(--positioner-width)] max-w-[var(--available-width)]
							transition-[top,left,right,bottom,transform] ${DURATION} ${EASE}
							data-instant:transition-none`}
					>
						<Tooltip.Popup
							className={`relative h-[var(--popup-height,auto)] w-[var(--popup-width,auto)] max-w-[320px]
								rounded-lg bg-gray-900 text-gray-50 text-[15px] leading-[1.43] font-[450]
								ring-1 ring-black inset-ring inset-ring-white/10 shadow-lg
								origin-[var(--transform-origin)]
								transition-[width,height,opacity,transform] ${DURATION} ${EASE}
								data-starting-style:opacity-0 data-starting-style:[transform:scale(0.9)]
								data-ending-style:opacity-0 data-ending-style:[transform:scale(0.9)]
								data-instant:transition-none`}
						>
							<Tooltip.Viewport
								className={`[--viewport-inline-padding:0.625rem] relative h-full w-full overflow-clip
									px-[var(--viewport-inline-padding)] py-1
									[&_[data-previous]]:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding))]
									[&_[data-previous]]:translate-x-0 [&_[data-previous]]:opacity-100
									[&_[data-previous]]:transition-[translate,opacity] [&_[data-previous]]:duration-[350ms,175ms] [&_[data-previous]]:${EASE}
									[&_[data-current]]:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding))]
									[&_[data-current]]:translate-x-0 [&_[data-current]]:opacity-100
									[&_[data-current]]:transition-[translate,opacity] [&_[data-current]]:duration-[350ms,175ms] [&_[data-current]]:${EASE}
									data-[activation-direction~='left']:[&_[data-current][data-starting-style]]:-translate-x-1/2
									data-[activation-direction~='left']:[&_[data-current][data-starting-style]]:opacity-0
									data-[activation-direction~='right']:[&_[data-current][data-starting-style]]:translate-x-1/2
									data-[activation-direction~='right']:[&_[data-current][data-starting-style]]:opacity-0
									data-[activation-direction~='left']:[&_[data-previous][data-ending-style]]:translate-x-1/2
									data-[activation-direction~='left']:[&_[data-previous][data-ending-style]]:opacity-0
									data-[activation-direction~='right']:[&_[data-previous][data-ending-style]]:-translate-x-1/2
									data-[activation-direction~='right']:[&_[data-previous][data-ending-style]]:opacity-0
									[[data-instant]_&_[data-previous]]:transition-none
									[[data-instant]_&_[data-current]]:transition-none`}
							>
								{payload}
							</Tooltip.Viewport>
						</Tooltip.Popup>
					</Tooltip.Positioner>
				</Tooltip.Portal>
			)}
		</Tooltip.Root>
	);
}
