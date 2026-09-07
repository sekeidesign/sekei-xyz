/**
 * Shared by the drawn cover and the Satori card. Satori parses no oklch, so the
 * accent is here twice — the design's value, and its sRGB equivalent.
 */

export const ACCENT = "oklch(67% 0.129 39.1)";
export const ACCENT_HEX = "#d77757";

export interface WikiNode {
	prefix: string;
	name: string;
	visited?: boolean;
	/** Where the still card's marks sit, since it has no loop to run. */
	parked?: boolean;
}

/**
 * A stand-in, not an extract: vendor and product names identify accounts through
 * their stacks, so they stay out, along with named laws and certifications.
 */
export const TREE: WikiNode[] = [
	{ prefix: "", name: "customer-knowledge/" },
	{ prefix: "├── ", name: "companies/" },
	{ prefix: "│   ├── ", name: "acme", visited: true },
	{ prefix: "│   └── ", name: "loggify" },
	{ prefix: "├── ", name: "industry/" },
	{
		prefix: "│   ├── ",
		name: "aerospace-and-defense",
		visited: true,
		parked: true,
	},
	{ prefix: "│   └── ", name: "construction" },
	{ prefix: "├── ", name: "signals/" },
	{ prefix: "│   ├── ", name: "false-green-status", visited: true },
	{ prefix: "│   └── ", name: "fixed-price-vendor-contract" },
	{ prefix: "├── ", name: "themes/" },
	{ prefix: "│   ├── ", name: "accountability-as-buying-driver" },
	{ prefix: "│   └── ", name: "business-led-it-governance" },
	{ prefix: "└── ", name: "vocabulary/" },
	{ prefix: "    ├── ", name: "change-order" },
	{ prefix: "    └── ", name: "fit-gap-analysis" },
];

export const PROMPT =
	"Can you update the uses cases section in Linear with the use case John Doe from Acme described in our latest call?";

/** Claude's mark, on a 12 viewBox. */
export const MARK_PATH =
	"M2.352 7.98l2.364-1.32 0.036-0.12-0.036-0.06h-0.12l-0.396-0.024-1.344-0.036L1.68 6.36l-1.14-0.06-0.288-0.06L0 5.88l0.024-0.18 0.24-0.156 0.348 0.024 0.756 0.06 1.14 0.072 0.828 0.048L4.56 5.892h0.192l0.024-0.084-0.06-0.048-0.048-0.048L3.48 4.92l-1.272-0.84-0.672-0.492-0.36-0.24-0.18-0.24-0.072-0.504 0.324-0.36 0.444 0.036 0.108 0.024 0.444 0.348 0.96 0.732L4.44 4.32l0.18 0.144 0.072-0.048 0.012-0.036-0.084-0.132L3.96 3l-0.72-1.248-0.324-0.516-0.084-0.312c-0.036-0.12-0.048-0.24-0.048-0.36l0.36-0.504L3.36 0l0.504 0.072L4.056 0.24l0.312 0.72 0.492 1.116L5.64 3.588l0.24 0.456 0.12 0.408 0.036 0.12h0.084v-0.06l0.06-0.864 0.12-1.044 0.12-1.344 0.036-0.384 0.192-0.456 0.36-0.24L7.32 0.312l0.24 0.348-0.036 0.216-0.132 0.924L7.08 3.252l-0.18 0.984h0.108l0.12-0.132 0.492-0.648 0.828-1.032 0.36-0.42L9.24 1.56l0.276-0.216h0.516l0.372 0.564-0.168 0.588-0.528 0.672-0.444 0.564-0.636 0.852-0.384 0.684 0.036 0.048h0.084l1.44-0.312 0.768-0.132 0.912-0.156 0.42 0.192 0.048 0.192-0.168 0.408-0.984 0.24-1.152 0.24-1.716 0.396-0.024 0.012 0.024 0.036 0.768 0.072 0.336 0.024h0.816l1.512 0.12 0.396 0.24 0.228 0.324-0.036 0.24-0.612 0.312-0.816-0.192-1.92-0.456-0.648-0.156h-0.096v0.048l0.552 0.54 0.996 0.9L10.68 9.612l0.06 0.288-0.156 0.24-0.168-0.024-1.104-0.84-0.432-0.36-0.96-0.816h-0.06v0.084l0.216 0.324 1.176 1.764 0.06 0.54-0.084 0.168-0.312 0.12-0.324-0.072-0.696-0.96-0.72-1.08-0.564-0.984-0.06 0.048-0.348 3.624-0.156 0.18-0.36 0.144-0.3-0.24-0.168-0.36 0.168-0.744 0.192-0.96 0.156-0.768 0.144-0.948 0.084-0.312v-0.024H5.88L5.16 8.64l-1.08 1.476-0.864 0.912-0.204 0.084-0.36-0.18 0.036-0.336L2.88 10.32l1.2-1.536 0.72-0.948 0.48-0.552-0.012-0.06h-0.036L2.064 9.288l-0.564 0.072-0.24-0.24 0.024-0.36 0.12-0.12 0.96-0.66Z";
