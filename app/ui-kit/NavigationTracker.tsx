"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { markPath } from "./nav-history";

/** Mounted at the root, above every route, so it counts across navigation. */
export function NavigationTracker() {
	const pathname = usePathname();

	useEffect(() => {
		markPath(pathname);
	}, [pathname]);

	return null;
}
