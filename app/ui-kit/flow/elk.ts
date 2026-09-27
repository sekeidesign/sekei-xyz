import ELK, { type ElkExtendedEdge, type ElkNode, type ElkPort } from "elkjs/lib/elk.bundled.js";
import type { FlowEdge, FlowGraph, Side } from "./parse";

export interface Point {
	x: number;
	y: number;
}

export interface PlacedNode {
	id: string;
	label: string;
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface PlacedEdge {
	from: string;
	to: string;
	points: Point[];
	arrow: boolean;
}

export interface FlowLayout {
	width: number;
	height: number;
	nodes: PlacedNode[];
	edges: PlacedEdge[];
}

export interface LayoutSpacing {
	/** Gap between a label and the lines that meet it. */
	padding: number;
	/** Distance between neighbouring labels in a column. */
	rows: number;
	/** Length of the line between columns. */
	columns: number;
	/** Gap between a label and a line routed past it, like a loop over the top. */
	clearance: number;
}

const ELK_SIDE: Record<Side, string> = {
	T: "NORTH",
	B: "SOUTH",
	L: "WEST",
	R: "EAST",
};

const elk = new ELK();

const portId = (node: string, side: Side) => `${node}:${side}`;

const vertical = (side?: Side) => side === "T" || side === "B";

/**
 * ELK can't draw an edge between two nodes in the same layer, and turns a
 * `port:T --> B:completed` into a loop to the next layer instead. Leaving
 * edges between opposite top and bottom sides out lets the layers fall where
 * they would anyway, and they're drawn here once the nodes are placed.
 */
const stacked = ({ from, to }: FlowEdge) =>
	vertical(from.side) && vertical(to.side) && from.side !== to.side;

function connect(edge: FlowEdge, from: PlacedNode, to: PlacedNode): Point[] {
	const y = (node: PlacedNode, side?: Side) =>
		side === "T" ? node.y : node.y + node.height;
	const start = { y: y(from, edge.from.side) };
	const end = { y: y(to, edge.to.side) };

	const left = Math.max(from.x, to.x);
	const right = Math.min(from.x + from.width, to.x + to.width);
	if (left < right) {
		const x = (left + right) / 2;
		return [
			{ x, y: start.y },
			{ x, y: end.y },
		];
	}

	const fromX = from.x + from.width / 2;
	const toX = to.x + to.width / 2;
	const middle = (start.y + end.y) / 2;
	return [
		{ x: fromX, y: start.y },
		{ x: fromX, y: middle },
		{ x: toX, y: middle },
		{ x: toX, y: end.y },
	];
}

export async function layoutFlow(
	graph: FlowGraph,
	measure: (label: string) => { width: number; height: number },
	{ padding, rows, columns, clearance }: LayoutSpacing,
): Promise<FlowLayout> {
	const routed = graph.edges.filter((edge) => !stacked(edge));
	const ports = new Map<string, Set<Side>>();
	for (const { from, to } of routed) {
		for (const end of [from, to]) {
			if (!end.side) continue;
			const sides = ports.get(end.node) ?? new Set();
			sides.add(end.side);
			ports.set(end.node, sides);
		}
	}

	const children: ElkNode[] = graph.nodes.map(({ id, label }) => {
		const size = measure(label);
		const sides = ports.get(id);
		return {
			id,
			width: size.width + padding * 2,
			height: size.height,
			layoutOptions: {
				"elk.alignment": "LEFT",
				...(sides && { "elk.portConstraints": "FIXED_SIDE" }),
			},
			ports: sides
				? [...sides].map(
						(side): ElkPort => ({
							id: portId(id, side),
							width: 0,
							height: 0,
							layoutOptions: { "elk.port.side": ELK_SIDE[side] },
						}),
					)
				: undefined,
		};
	});

	const graphRoot: ElkNode = {
		id: "root",
		layoutOptions: {
			"elk.algorithm": "layered",
			"elk.direction": "RIGHT",
			"elk.edgeRouting": "ORTHOGONAL",
			"elk.padding": "[top=0,left=0,bottom=0,right=0]",
			"elk.spacing.nodeNode": String(rows),
			"elk.spacing.edgeNode": String(clearance),
			"elk.layered.spacing.nodeNodeBetweenLayers": String(columns),
			"elk.layered.spacing.edgeNodeBetweenLayers": String(columns / 2),
			// Siblings share one trunk, so a fan-out draws as a single branch.
			"elk.layered.mergeEdges": "true",
			// Source order decides which edges are the loop-backs and keeps
			// branches top-to-bottom as written, instead of ELK's own choice.
			"elk.layered.cycleBreaking.strategy": "MODEL_ORDER",
			"elk.layered.considerModelOrder.strategy": "PREFER_NODES",
			"elk.layered.crossingMinimization.forceNodeModelOrder": "true",
			"elk.layered.layering.strategy": "LONGEST_PATH_SOURCE",
		},
		children,
		edges: routed.map(({ from, to }, index): ElkExtendedEdge => ({
			id: `e${index}`,
			sources: [from.side ? portId(from.node, from.side) : from.node],
			targets: [to.side ? portId(to.node, to.side) : to.node],
		})),
	};
	const root = await elk.layout(graphRoot);

	const labels = new Map(graph.nodes.map(({ id, label }) => [id, label]));
	const nodes: PlacedNode[] = (root.children ?? []).map((node) => ({
		id: node.id,
		label: labels.get(node.id) ?? node.id,
		x: node.x ?? 0,
		y: node.y ?? 0,
		width: node.width ?? 0,
		height: node.height ?? 0,
	}));
	const placed = new Map(nodes.map((node) => [node.id, node]));
	const sections = new Map(
		(root.edges ?? []).map((edge, index) => [
			routed[index],
			(edge.sections ?? []).flatMap((section) => [
				section.startPoint,
				...(section.bendPoints ?? []),
				section.endPoint,
			]),
		]),
	);

	return {
		width: root.width ?? 0,
		height: root.height ?? 0,
		nodes,
		edges: graph.edges.map((edge) => {
			const from = placed.get(edge.from.node);
			const to = placed.get(edge.to.node);
			return {
				from: edge.from.node,
				to: edge.to.node,
				arrow: edge.arrow,
				points:
					sections.get(edge) ?? (from && to ? connect(edge, from, to) : []),
			};
		}),
	};
}
