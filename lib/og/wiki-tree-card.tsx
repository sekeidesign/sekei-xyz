import { ACCENT_HEX, MARK_PATH, TREE } from "@ui-kit/covers/wiki-tree";

/**
 * The cover redone for Satori: no custom properties, no animation, the mark and
 * crosshair parked on one node. Geometry lives twice because a share card is
 * read at a glance and takes the design at 2x; content comes from wiki-tree.
 */

const GRAY = { 200: "#e5e7eb", 300: "#d1d5dc" } as const;

const SCALE = 1.75;
const px = (n: number) => Math.round(n * SCALE);

const M = {
	inset: px(40),
	radius: px(12),
	pad: px(16),
	text: px(14),
	line: px(18),
	mark: px(14),
	box: px(16),
	corner: px(5),
	gutter: px(16),
};

const PARKED = TREE.findIndex((node) => node.parked);

export function WikiTreePlate({
	width,
	height,
	insetTop = M.inset,
}: {
	width: number;
	height: number;
	insetTop?: number;
}) {
	return (
		<div
			style={{
				display: "flex",
				position: "absolute",
				right: 0,
				top: 0,
				width,
				height,
				overflow: "hidden",
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					position: "absolute",
					left: M.inset,
					top: insetTop,
					width,
					height,
					padding: M.pad,
					borderRadius: M.radius,
					overflow: "hidden",
					backgroundColor: "#ffffff",
					border: `1px solid rgba(153, 161, 175, 0.15)`,
					boxShadow: `0 ${px(16)}px ${px(32)}px rgba(153,161,175,0.18)`,
					fontFamily: "Geist Mono",
					// Satori collapses runs of spaces, which are the tree's indentation.
					whiteSpace: "pre",
					fontSize: M.text,
					lineHeight: `${M.line}px`,
					color: GRAY[300],
				}}
			>
				{TREE.map((node, index) => (
					<div
						key={node.name}
						style={{
							display: "flex",
							position: "relative",
							flexShrink: 0,
							height: M.line,
						}}
					>
						<span style={{ flexShrink: 0 }}>{node.prefix}</span>
						{/* Satori won't take raw text beside an element, hence the wrap. */}
						<span
							style={{ display: "flex", position: "relative", flexShrink: 0 }}
						>
							<span>{node.name}</span>
							{index === PARKED && <Crosshair />}
						</span>
						{index === PARKED && <Mark />}
					</div>
				))}
			</div>
		</div>
	);
}

function Mark() {
	return (
		<svg
			viewBox="0 0 12 12"
			width={M.mark}
			height={M.mark}
			fill={ACCENT_HEX}
			style={{ position: "absolute", left: M.gutter, top: px(2) }}
		>
			<path d={MARK_PATH} />
		</svg>
	);
}

const EDGE = 2;

/**
 * Four boxes, since Satori has no partial borders — and only the keys each
 * corner needs: Satori trims every style value and undefined throws.
 */
const CORNERS = [
	{ top: 0, left: 0, borderTop: true, borderLeft: true },
	{ top: 0, right: 0, borderTop: true, borderRight: true },
	{ bottom: 0, left: 0, borderBottom: true, borderLeft: true },
	{ bottom: 0, right: 0, borderBottom: true, borderRight: true },
] as const;

function Crosshair() {
	const edge = `${px(1)}px solid ${ACCENT_HEX}`;

	return (
		<div
			style={{
				display: "flex",
				position: "absolute",
				left: -EDGE,
				right: -EDGE,
				top: (M.line - M.box) / 2,
				height: M.box,
			}}
		>
			{CORNERS.map((corner) => (
				<div
					key={Object.keys(corner).join()}
					style={{
						position: "absolute",
						width: M.corner,
						height: M.corner,
						...("top" in corner ? { top: corner.top } : {}),
						...("right" in corner ? { right: corner.right } : {}),
						...("bottom" in corner ? { bottom: corner.bottom } : {}),
						...("left" in corner ? { left: corner.left } : {}),
						...("borderTop" in corner ? { borderTop: edge } : {}),
						...("borderRight" in corner ? { borderRight: edge } : {}),
						...("borderBottom" in corner ? { borderBottom: edge } : {}),
						...("borderLeft" in corner ? { borderLeft: edge } : {}),
					}}
				/>
			))}
		</div>
	);
}
