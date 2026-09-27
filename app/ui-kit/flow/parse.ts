export type Side = "T" | "B" | "L" | "R";

export interface FlowNode {
	id: string;
	label: string;
}

export interface FlowEnd {
	node: string;
	side?: Side;
}

export interface FlowEdge {
	from: FlowEnd;
	to: FlowEnd;
	arrow: boolean;
}

export interface FlowGraph {
	nodes: FlowNode[];
	edges: FlowEdge[];
}

const LINK = /\s*(-->|---)\s*/;

// `T:id[Label]:B` — a side before the id is where edges come in, a side after
// is where they leave, following Mermaid's architecture-beta syntax.
const NODE = /^(?:([TBLR]):)?([\w-]+)(?:\[([^\]]*)\])?(?::([TBLR]))?$/;

export function parseFlow(source: string): FlowGraph {
	const nodes = new Map<string, FlowNode>();
	const edges: FlowEdge[] = [];

	for (const raw of source.split("\n")) {
		const line = raw.trim();
		if (!line || line.startsWith("%%") || /^(flowchart|graph)\b/.test(line)) {
			continue;
		}

		const parts = line.split(LINK);
		const ends = parts.filter((_, index) => index % 2 === 0).map((token) => {
			const match = NODE.exec(token.trim());
			if (!match) throw new Error(`Can't read “${token.trim()}”`);
			const [, into, id, label, out] = match;
			const known = nodes.get(id);
			if (!known) nodes.set(id, { id, label: label ?? id });
			else if (label !== undefined) known.label = label;
			return { id, into: into as Side | undefined, out: out as Side | undefined };
		});

		for (let index = 1; index < ends.length; index++) {
			const from = ends[index - 1];
			const to = ends[index];
			edges.push({
				from: { node: from.id, side: from.out },
				to: { node: to.id, side: to.into },
				arrow: parts[index * 2 - 1] === "-->",
			});
		}
	}

	return { nodes: [...nodes.values()], edges };
}
