import type { ReactNode } from "react";
import { RaidLogCover } from "@ui-kit/covers/RaidLogCover";
import { WikiTreeCover } from "@ui-kit/covers/WikiTreeCover";

export interface CoverVariant {
	name: string;
	render: () => ReactNode;
}

export const VARIANTS: CoverVariant[] = [
	{ name: "RAID log", render: () => <RaidLogCover /> },
	{ name: "RAID log · page", render: () => <RaidLogCover variant="page" /> },
	{ name: "Wiki tree", render: () => <WikiTreeCover /> },
	{ name: "Wiki tree · page", render: () => <WikiTreeCover variant="page" /> },
];
