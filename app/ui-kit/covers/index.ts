import type { ComponentType } from "react";
import { RaidLogCover } from "./RaidLogCover";
import { WikiTreeCover } from "./WikiTreeCover";

interface CodeCover {
	Cover: ComponentType<{ variant?: "card" | "page" }>;
	/** The page's lead box: a drawn cover has no file to read a ratio off. */
	aspect: string;
}

/** Entries whose cover is drawn in code, keyed by slug, in place of an image. */
export const CODE_COVERS: Record<string, CodeCover> = {
	"raid-2-0": { Cover: RaidLogCover, aspect: "2 / 1" },
	"customer-knowledge-base": { Cover: WikiTreeCover, aspect: "2 / 1" },
};
