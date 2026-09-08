"use client";

import { BackIcon } from "@/app/ui-kit/icons/BackIcon";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { canGoBack } from "./nav-history";

export function BackLink() {
	const pathname = usePathname();
	const router = useRouter();
	const segments = pathname.split("/").filter(Boolean);
	// Where the post sits, for a visitor who arrived here directly:
	// /case-studies/<x> goes home; anything deeper goes up one level.
	const href =
		segments.length > 2 ? `/${segments.slice(0, -1).join("/")}` : "/";

	return (
		<Link
			href={href}
			onClick={(event) => {
				// A modified click is the browser's to handle, and the href is what
				// it opens in the new tab.
				if (
					event.metaKey ||
					event.ctrlKey ||
					event.shiftKey ||
					event.altKey ||
					event.button !== 0
				)
					return;
				if (!canGoBack()) return;
				event.preventDefault();
				router.back();
			}}
			className="inline-flex items-center gap-1 h-6.5 w-fit rounded-full pl-1.5 pr-2 bg-white ring-1 ring-gray-500/10 shadow-skew text-[14px] font-[500] text-gray-500 hover:bg-gray-50"
		>
			<BackIcon size={16} />
			Back
		</Link>
	);
}
