import Link from "next/link";
import { cn } from "../cn";
import { CodeIcon } from "../icons/KindIcons";
import { ICON_PRESS } from "../press";
import { TooltipTrigger } from "../Tooltip";
import { CHIP } from "./surface";

/** The "view source" affordance in a card's footer. */
export function CodeLink({ href }: { href: string }) {
	return (
		<TooltipTrigger
			payload="View code"
			// render, so the trigger IS the anchor rather than a button
			// wrapping one — nested interactive elements would break both.
			render={(props) => (
				<Link
					{...props}
					href={href}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="View code"
				/>
			)}
			className={cn(
				"group flex items-center justify-center size-[26px] rounded-full shrink-0 text-gray-500 hover:bg-gray-50",
				CHIP,
			)}
		>
			<CodeIcon filled className={ICON_PRESS} />
		</TooltipTrigger>
	);
}
