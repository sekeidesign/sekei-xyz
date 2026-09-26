import { beam, type BeamOptions } from "@/components/shad-fx/effects/beam";
import { bolt, type BoltOptions } from "@/components/shad-fx/effects/bolt";
import { fire, type FireOptions } from "@/components/shad-fx/effects/fire";
import { fluid, type FluidOptions } from "@/components/shad-fx/effects/fluid";
import { rings, type RingsOptions } from "@/components/shad-fx/effects/rings";
import { type Anchor, type FxEffect, hex } from "@/components/shad-fx/engine";
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
): FxEffect {
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
