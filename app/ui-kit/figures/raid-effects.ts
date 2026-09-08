import { KIND } from "../covers/raid-log";
import { beam, type BeamOptions } from "../dither/effects/beam";
import { bolt, type BoltOptions } from "../dither/effects/bolt";
import { fire, type FireOptions } from "../dither/effects/fire";
import { fluid, type FluidOptions } from "../dither/effects/fluid";
import { rings, type RingsOptions } from "../dither/effects/rings";
import { type Anchor, type DitherEffect, hex } from "../dither/engine";
import type { RAID_KINDS } from "./kinds";

export type RaidKind = (typeof RAID_KINDS)[number]["kind"];

export interface RaidEffectTweaks {
	decision?: "fluid" | "beam";
	fire?: FireOptions;
	bolt?: BoltOptions;
	rings?: RingsOptions;
	fluid?: FluidOptions;
	beam?: BeamOptions;
}

/**
 * The hover effect for one RAID type, in its tint. `anchor` is the disc's
 * centre within the cell, so rings pulse from it and bolts land on it.
 */
export function raidEffect(
	kind: RaidKind,
	anchor: Anchor,
	tweaks: RaidEffectTweaks = {},
): DitherEffect {
	switch (kind) {
		case "risk":
			return fire({
				colors: [hex("#e5343a"), hex(KIND.risk.hex), hex(KIND.action.hex)],
				...tweaks.fire,
			});
		case "action":
			return bolt({ color: hex(KIND.action.hex), target: anchor, ...tweaks.bolt });
		case "issue":
			return rings({ color: hex(KIND.issue.hex), origin: anchor, ...tweaks.rings });
		case "decision":
			return tweaks.decision === "beam"
				? beam({ color: hex(KIND.decision.hex), origin: anchor, ...tweaks.beam })
				: fluid({ color: hex(KIND.decision.hex), ...tweaks.fluid });
	}
}
