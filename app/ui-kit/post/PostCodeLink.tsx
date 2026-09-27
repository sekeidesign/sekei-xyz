import Link from "next/link";
import { Button } from "../Button";
import { CodeIcon } from "../icons/KindIcons";
import { ICON_PRESS } from "../press";
import { TooltipTrigger } from "../Tooltip";

/** The "view source" affordance in a card's footer. */
export function CodeLink({ href }: { href: string }) {
	return (
		<TooltipTrigger
			payload="View code"
			// render, so the trigger IS the anchor rather than a button
			// wrapping one — nested interactive elements would break both.
			render={
				<Button
					iconOnly
					render={
						<Link href={href} target="_blank" rel="noopener noreferrer" />
					}
				/>
			}
			aria-label="View code"
			className="group"
		>
			<CodeIcon filled className={ICON_PRESS} />
		</TooltipTrigger>
	);
}
