import type { ComponentType } from "react";
import { RaidLogCover } from "./RaidLogCover";

interface CodeCover {
	Cover: ComponentType<{ variant?: "card" | "page" }>;
	/** The page's lead box, as CSS aspect-ratio. A drawn cover has no file to
	 * read a ratio off, so it names its own. */
	aspect: string;
}

/** Entries whose cover is drawn in code, keyed by slug, in place of an image. */
export const CODE_COVERS: Record<string, CodeCover> = {
	"raid-2-0": { Cover: RaidLogCover, aspect: "2 / 1" },
};
