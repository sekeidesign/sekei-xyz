import { beam, type BeamOptions } from "@/components/dither/effects/beam";
import { bolt, type BoltOptions } from "@/components/dither/effects/bolt";
import { fire, type FireOptions } from "@/components/dither/effects/fire";
import { fluid, type FluidOptions } from "@/components/dither/effects/fluid";
import { rings, type RingsOptions } from "@/components/dither/effects/rings";
import { type Anchor, type DitherEffect, hex } from "@/components/dither/engine";
import { KIND } from "../covers/raid-log";
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
