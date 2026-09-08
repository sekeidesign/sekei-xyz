/**
 * A RAID status drawn as one measure: a dashed outline for nothing started, an
 * outline filling with a wedge as the work is done, and a filled disc with a
 * mark punched out for the three ways an item can finish. Colours are hex
 * alongside the class because motion interpolates them and cannot read a
 * custom property.
 */
export interface Glyph {
	fraction?: number;
	mark?: "tick" | "cross" | "bang";
	dashed?: boolean;
	tone: string;
	colour: string;
}

export const STATUS: Record<string, Glyph> = {
	Monitoring: { dashed: true, tone: "text-stone-300", colour: "#d6d3d1" },
	Open: { fraction: 0.25, tone: "text-amber-400", colour: "#ffb900" },
	Mitigating: { fraction: 0.5, tone: "text-amber-400", colour: "#ffb900" },
	Mitigated: { fraction: 0.75, tone: "text-blue-500", colour: "#2b7fff" },
	Realized: { mark: "bang", tone: "text-orange-600", colour: "#f54900" },
	Closed: { mark: "tick", tone: "text-stone-400", colour: "#a8a29e" },
	Dismissed: { mark: "cross", tone: "text-stone-400", colour: "#a8a29e" },
};

export const STATUS_ORDER = Object.keys(STATUS);
