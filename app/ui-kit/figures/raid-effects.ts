import { beam, type BeamOptions } from "@/components/shad-fx/effects/beam";
import { bolt, type BoltOptions } from "@/components/shad-fx/effects/bolt";
import { fire, type FireOptions } from "@/components/shad-fx/effects/fire";
import { fluid, type FluidOptions } from "@/components/shad-fx/effects/fluid";
import { rings, type RingsOptions } from "@/components/shad-fx/effects/rings";
import { type FxFactory, hex } from "@/components/shad-fx/engine";
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

export interface RaidEffect {
	factory: FxFactory<unknown>;
	options: object;
	/** The option that takes the disc's centre, so rings pulse from it and bolts land on it. */
	anchor?: "origin" | "target";
}

const entry = <O extends object>(
	factory: FxFactory<O>,
	options: O,
	anchor?: RaidEffect["anchor"],
): RaidEffect => ({ factory: factory as FxFactory<unknown>, options, anchor });

/** The hover effect for one RAID type, in its tint. */
export function raidEffect(kind: RaidKind, tweaks: RaidEffectTweaks = {}): RaidEffect {
	switch (kind) {
		case "risk":
			return entry(fire, {
				colors: [hex("#e5343a"), hex(KIND.risk.hex), hex(KIND.action.hex)],
				...tweaks.fire,
			});
		case "action":
			return entry(bolt, { color: hex(KIND.action.hex), ...tweaks.bolt }, "target");
		case "issue":
			return entry(rings, { color: hex(KIND.issue.hex), ...tweaks.rings }, "origin");
		case "decision":
			return tweaks.decision === "beam"
				? entry(beam, { color: hex(KIND.decision.hex), ...tweaks.beam }, "origin")
				: entry(fluid, { color: hex(KIND.decision.hex), ...tweaks.fluid });
	}
}
