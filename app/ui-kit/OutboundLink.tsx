import { ArrowUpRightIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { ICON_PRESS } from "./press";

export function OutboundLink({
	href,
	label = "Download",
}: {
	href: string;
	label?: string;
}) {
	return (
		<Link
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className="group inline-flex items-center justify-center gap-1 h-6.5 w-fit shrink-0 rounded-full pl-2.5 pr-2 text-[14px] leading-[1.43] font-[550] text-white bg-gray-900 bg-linear-to-b from-gray-800 hover:from-gray-950 ring ring-gray-950 inset-shadow-xs inset-shadow-gray-100/20 hover:inset-shadow-none shadow-md hover:shadow-sm transition-shadow duration-100"
		>
			{label}
			<ArrowUpRightIcon className={`size-3.5 ${ICON_PRESS}`} />
		</Link>
	);
}
