import type { ReactNode } from "react";
import { RaidLogCover } from "@ui-kit/covers/RaidLogCover";

export interface CoverVariant {
	name: string;
	render: () => ReactNode;
}

export const VARIANTS: CoverVariant[] = [
	{ name: "RAID log", render: () => <RaidLogCover /> },
];
