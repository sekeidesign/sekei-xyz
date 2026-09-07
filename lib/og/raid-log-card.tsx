import { KIND, ROWS } from "@ui-kit/covers/raid-log";

/**
 * The cover redone for Satori: no custom properties, no animation. Geometry
 * lives twice because a share card is read at a glance and takes the design at
 * 2x; content and tints come from raid-log.
 */

const GRAY = {
	50: "#f9fafb",
	200: "#e5e7eb",
	300: "#d1d5dc",
	400: "#99a1af",
} as const;

const SCALE = 1.75;

/** Rounded: at 1.75x a 2px cell lands on 3.5, which rasterises as a rectangle. */
const px = (n: number) => Math.round(n * SCALE);

const M = {
	inset: px(40),
	radius: px(12),
	header: px(32),
	pad: px(12),
	gap: px(8),
	icon: px(20),
	id: px(64),
	title: px(300),
	date: px(72),
	impact: px(72),
	text: px(14),
	line: px(18),
	chip: px(8),
	pill: px(56),
	cell: px(2),
};

/** Alpha, not flat gray, so the zebra reads over the field too. */
const SHADE = "rgba(106, 114, 130, 0.05)";
const LINE = "rgba(106, 114, 130, 0.1)";
const BAR = "rgba(106, 114, 130, 0.15)";

/**
 * Satori paints a gradient once rather than tiling it, so the field is nodes —
 * a thousand of them, affordable only because the card is generated.
 */
export function DotField({ width, height }: { width: number; height: number }) {
	const pitch = px(14);
	const dot = px(1.5);
	const columns = Math.ceil(width / pitch);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				position: "absolute",
				inset: 0,
				gap: pitch - dot,
				overflow: "hidden",
			}}
		>
			{Array.from({ length: Math.ceil(height / pitch) }, (_, row) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: a fixed lattice
				<div
					key={row}
					style={{
						display: "flex",
						flexShrink: 0,
						height: dot,
						gap: pitch - dot,
					}}
				>
					{Array.from({ length: columns }, (_, column) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: as above
						<div
							key={column}
							style={{
								display: "flex",
								flexShrink: 0,
								width: dot,
								height: dot,
								borderRadius: dot,
								backgroundColor: GRAY[200],
							}}
						/>
					))}
				</div>
			))}
		</div>
	);
}

export function RaidLogPlate({
	width,
	height,
	/** Lines the window's top up with the copy. */
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
					width: width,
					height: height,
					borderRadius: M.radius,
					overflow: "hidden",
					backgroundColor: "#ffffff",
					border: `1px solid ${BAR}`,
					boxShadow: `0 ${px(16)}px ${px(32)}px rgba(153,161,175,0.18)`,
				}}
			>
				<Chrome />
				{ROWS.map((row, index) => (
					<Line key={row.id} row={row} shaded={index % 2 === 1} />
				))}
			</div>
		</div>
	);
}

function Chrome() {
	return (
		<>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					flexShrink: 0,
					height: M.header,
					gap: M.gap,
					padding: `0 ${M.pad}px`,
					backgroundColor: LINE,
				}}
			>
				<Lane width={M.icon} center>
					<Bar width={M.chip} />
				</Lane>
				<Lane width={M.id}>
					<Bar width={M.pill} />
				</Lane>
				<Lane width={M.title}>
					<Bar width={M.pill} />
				</Lane>
				<Lane width={M.date}>
					<Bar width={M.pill} />
				</Lane>
				<Lane width={M.impact}>
					<Bar width={M.pill} />
				</Lane>
			</div>
			<Divider />
		</>
	);
}

function Lane({
	width,
	center,
	children,
}: {
	width: number;
	center?: boolean;
	children: React.ReactNode;
}) {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: center ? "center" : "flex-start",
				flexShrink: 0,
				width,
				height: M.line,
			}}
		>
			{children}
		</div>
	);
}

function Bar({ width }: { width: number }) {
	return (
		<div
			style={{
				display: "flex",
				flexShrink: 0,
				width,
				height: M.chip,
				borderRadius: M.chip,
				backgroundColor: BAR,
			}}
		/>
	);
}

function Divider() {
	return (
		<div style={{ display: "flex", flexShrink: 0, height: 2, backgroundColor: LINE }} />
	);
}

function Line({
	row,
	shaded,
}: {
	row: (typeof ROWS)[number];
	shaded: boolean;
}) {
	const { Icon, hex } = KIND[row.kind];

	return (
		<>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					flexShrink: 0,
					gap: M.gap,
					padding: M.pad,
					...(shaded ? { backgroundColor: SHADE } : {}),
				}}
			>
				<div style={{ display: "flex", flexShrink: 0, color: hex }}>
					<Icon size={M.icon} />
				</div>
				<Cell width={M.id} mono color={GRAY[300]}>
					{row.id}
				</Cell>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						flexShrink: 0,
						width: M.title,
						gap: px(4),
						overflow: "hidden",
					}}
				>
					{row.pending && <ArrowLoader />}
					<span
						style={{
							fontSize: M.text,
							lineHeight: `${M.line}px`,
							color: row.pending ? GRAY[300] : GRAY[400],
						}}
					>
						{row.title}
					</span>
				</div>
				<Cell width={M.date} mono color={GRAY[300]}>
					{row.date ?? ""}
				</Cell>
				<Cell width={M.impact} color={GRAY[300]}>
					{row.impact ?? ""}
				</Cell>
			</div>
			<Divider />
		</>
	);
}

function Cell({
	width,
	mono,
	color,
	children,
}: {
	width: number;
	mono?: boolean;
	color: string;
	children: React.ReactNode;
}) {
	return (
		<div
			style={{
				display: "flex",
				flexShrink: 0,
				width,
				fontFamily: mono ? "Geist Mono" : "Geist",
				fontSize: M.text,
				lineHeight: `${M.line}px`,
				color,
			}}
		>
			{children}
		</div>
	);
}

/** The DOM loader's resting frame. */
function ArrowLoader() {
	return (
		<div
			style={{
				display: "flex",
				flexShrink: 0,
				flexDirection: "column",
				gap: M.cell,
			}}
		>
			{[0, 1, 2].map((row) => (
				<div key={row} style={{ display: "flex", gap: M.cell }}>
					{[0, 1, 2].map((column) => (
						<div
							key={column}
							style={{
								display: "flex",
								width: M.cell,
								height: M.cell,
								backgroundColor: GRAY[400],
								opacity:
									column === 0 || (column === 1 && row === 1) ? 1 : 0.2,
							}}
						/>
					))}
				</div>
			))}
		</div>
	);
}
