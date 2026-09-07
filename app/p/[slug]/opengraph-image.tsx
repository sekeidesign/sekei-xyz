import { ImageResponse } from "next/og";
import { geistForOg, type OgFont } from "@/lib/og/fonts";
import {
	BOOK_DEPTH,
	BOOK_HEIGHT,
	BOOK_WIDTH,
} from "@ui-kit/book-shelf/constants";
import { bookCardEntry } from "@/lib/og/book-card";
import type { TimelineEntry } from "@/lib/timeline";
import { DotField, RaidLogPlate } from "@/lib/og/raid-log-card";
import { shareCard } from "@/lib/og/share-card";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const GRAY = {
	50: "#f9fafb",
	100: "#f3f4f6",
	300: "#d1d5dc",
	400: "#99a1af",
	500: "#6a7282",
	900: "#101828",
} as const;

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	year: "numeric",
	timeZone: "UTC",
});

export async function generateImageMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const found = shareCard(slug);
	if (!found) return [];

	const { entry, card } = found;
	const alt =
		card === "book"
			? `${entry.title}${entry.author ? ` by ${entry.author}` : ""}`
			: entry.title;

	return [{ id: card, alt, size, contentType }];
}

/**
 * Satori has no 3D transforms, so Book3D's open pose is projected to 2D here.
 * Turning the assembly COVER_ANGLE about the spine edge foreshortens the cover
 * to cos θ of its width and swings the fore-edge sin θ of the depth past its
 * right side. The spine lands behind the cover, so nothing draws one.
 */
const COVER_ANGLE = 16;
const RADIANS = (COVER_ANGLE * Math.PI) / 180;

const PLATE_HEIGHT = 560;
const PLATE_SCALE = PLATE_HEIGHT / BOOK_HEIGHT;

const COVER_WIDTH = BOOK_WIDTH * Math.cos(RADIANS) * PLATE_SCALE;
const EDGE_WIDTH = BOOK_DEPTH * Math.sin(RADIANS) * PLATE_SCALE;
const PLATE_WIDTH = COVER_WIDTH + EDGE_WIDTH;

const PAD_X = 72;
const PAD_Y = 64;
const GAP = 56;
const PLATE_BLEED = 44;
const PLATE_FADE = Math.round(PLATE_HEIGHT * 0.42);
const COPY_WIDTH = size.width - PAD_X * 2 - PLATE_WIDTH - GAP;

// Alpha-zero gray-100, not `transparent` — that interpolates through black.
const PLATE_FADE_RAMP = [
	"rgba(243, 244, 246, 0) 0%",
	"rgba(243, 244, 246, 0.72) 46%",
	`${GRAY[100]} 100%`,
].join(", ");

const PLATE_SHADOW = [
	`0 ${26 * PLATE_SCALE}px ${24 * PLATE_SCALE}px rgba(15,23,42,0.22)`,
	`0 ${10 * PLATE_SCALE}px ${10 * PLATE_SCALE}px rgba(15,23,42,0.16)`,
].join(", ");

function BookPlate({ cover, alt }: { cover: string; alt: string }) {
	return (
		<div
			style={{
				display: "flex",
				position: "absolute",
				right: PAD_X,
				bottom: -PLATE_BLEED,
				width: PLATE_WIDTH,
				height: PLATE_HEIGHT,
			}}
		>
			<div
				style={{
					display: "flex",
					position: "relative",
					width: COVER_WIDTH,
					height: PLATE_HEIGHT,
					borderRadius: 4,
					overflow: "hidden",
					boxShadow: PLATE_SHADOW,
				}}
			>
				{/** biome-ignore lint/performance/noImgElement: Satori renders raw img, not next/image */}
				<img
					src={cover}
					alt={alt}
					width={COVER_WIDTH}
					height={PLATE_HEIGHT}
					style={{ width: "100%", height: "100%", objectFit: "cover" }}
				/>
				<div
					style={{
						position: "absolute",
						inset: 0,
						background:
							"linear-gradient(135deg, rgba(255,255,255,0.15), rgba(0,0,0,0.02) 50%, rgba(0,0,0,0.15))",
					}}
				/>
			</div>

			<div
				style={{
					display: "flex",
					width: EDGE_WIDTH,
					height: PLATE_HEIGHT,
					borderTopRightRadius: 4,
					borderBottomRightRadius: 4,
					background: "linear-gradient(to bottom, #fff, #f1efe8 50%, #fff)",
					boxShadow: "inset -1px 0 2px rgba(0,0,0,0.12)",
				}}
			/>
		</div>
	);
}

// No <title> in these: Satori has no accessibility tree and paints it as
// visible text on the card.
function BookMark({ size: px }: { size: number }) {
	return (
		<svg width={px} height={px} viewBox="0 0 16 16" fill="none">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M3.114 14.063C3.289 14.237 3.52 14.333 3.767 14.333 3.925 14.333 4.081 14.292 4.219 14.215L8.017 12.086 11.778 14.211C11.993 14.333 12.241 14.362 12.479 14.296 12.717 14.231 12.914 14.075 13.035 13.861 13.113 13.722 13.155 13.566 13.155 13.408L13.151 4.391C13.151 2.634 12.022 1.667 9.971 1.667H6.027C4.005 1.667 2.845 2.618 2.845 4.277V13.411C2.845 13.657 2.94 13.888 3.114 14.063ZM8.849 8.567H7.151C6.875 8.567 6.651 8.343 6.651 8.067 6.651 7.791 6.875 7.567 7.151 7.567H8.849C9.125 7.567 9.349 7.791 9.349 8.067 9.349 8.343 9.125 8.567 8.849 8.567ZM6.249 5.937H9.751C10.027 5.937 10.251 5.713 10.251 5.437 10.251 5.161 10.027 4.937 9.751 4.937H6.249C5.973 4.937 5.749 5.161 5.749 5.437 5.749 5.713 5.973 5.937 6.249 5.937Z"
				fill={GRAY[400]}
			/>
		</svg>
	);
}

function Star({ size: px, filled }: { size: number; filled: boolean }) {
	return (
		<svg width={px} height={px} viewBox="0 0 24 24" fill="none">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M20.02 8.58L15.92 7.99C15.69 7.96 15.49 7.81 15.38 7.6L13.55 3.94C13.55 3.94 13.55 3.93 13.54 3.93C13.38 3.62 13.11 3.36 12.8 3.19C11.95 2.76 10.9 3.09 10.45 3.94L8.62 7.6C8.52 7.81 8.31 7.96 8.07 7.99L3.98 8.58C3.58 8.64 3.24 8.81 2.98 9.09C2.66 9.42 2.49 9.85 2.5 10.31C2.51 10.77 2.7 11.19 3.02 11.5L5.99 14.36C6.16 14.51 6.23 14.75 6.19 14.98L5.49 19C5.43 19.37 5.5 19.76 5.67 20.08C5.89 20.49 6.25 20.79 6.69 20.92C6.86 20.97 7.03 21 7.2 21C7.48 21 7.75 20.93 8 20.8L11.66 18.91C11.87 18.79 12.13 18.79 12.35 18.91L15.99 20.79C16.32 20.97 16.69 21.04 17.08 20.98C18.02 20.82 18.66 19.93 18.51 18.99L17.81 14.98C17.77 14.74 17.85 14.51 18.02 14.35L20.98 11.5C21.25 11.24 21.44 10.88 21.49 10.5C21.61 9.57 20.95 8.71 20.02 8.58Z"
				fill={filled ? "#1e2939" : GRAY[300]}
			/>
		</svg>
	);
}

function titleSize(title: string) {
	if (title.length <= 14) return 76;
	if (title.length <= 24) return 64;
	return 54;
}

export default async function Image({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const found = shareCard(slug);
	if (!found) return new Response("Not found", { status: 404 });

	const fonts = await geistForOg();

	if (found.card === "raid") return raidCard(found.entry, fonts);

	const entry = bookCardEntry(slug);
	if (!entry || !entry.cover) return new Response("Not found", { status: 404 });

	return new ImageResponse(
		<div
			style={{
				display: "flex",
				position: "relative",
				width: "100%",
				height: "100%",
				alignItems: "center",
				padding: `${PAD_Y}px ${PAD_X}px`,
				backgroundColor: GRAY[100],
				fontFamily: "Geist",
			}}
		>
			<BookPlate cover={entry.cover} alt={entry.title} />

			<div
				style={{
					display: "flex",
					position: "absolute",
					left: 0,
					right: 0,
					bottom: 0,
					height: PLATE_FADE,
					backgroundImage: `linear-gradient(to bottom, ${PLATE_FADE_RAMP})`,
				}}
			/>

			{/* Satori ignores z-index and paints in tree order, so the copy comes last. */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					width: COPY_WIDTH,
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: 8,
						color: GRAY[400],
						fontSize: 26,
						fontWeight: 500,
					}}
				>
					<BookMark size={30} />
					<span>Book</span>
					<span style={{ padding: "0 8px" }}>•</span>
					<span>{DATE_FORMAT.format(new Date(`${entry.date}T00:00:00Z`))}</span>
				</div>

				<div
					style={{
						marginTop: 20,
						color: GRAY[900],
						fontSize: titleSize(entry.title),
						fontWeight: 600,
						lineHeight: 1.15,
						letterSpacing: "-0.02em",
					}}
				>
					{entry.title}
				</div>

				{entry.author && (
					<div
						style={{
							marginTop: 14,
							color: GRAY[500],
							fontSize: 30,
							fontWeight: 400,
						}}
					>
						{`by ${entry.author}`}
					</div>
				)}

				{entry.rating !== undefined && (
					<div style={{ display: "flex", gap: 5, marginTop: 30 }}>
						{Array.from({ length: 5 }, (_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: fixed-length star row
							<Star key={i} size={38} filled={i < (entry.rating ?? 0)} />
						))}
					</div>
				)}
			</div>
		</div>,
		{ ...size, fonts },
	);
}

const RAID_PLATE = { width: 620, height: size.height };
const RAID_COPY = 480;

function raidCard(entry: TimelineEntry, fonts: OgFont[]) {
	return new ImageResponse(
		<div
			style={{
				display: "flex",
				position: "relative",
				width: "100%",
				height: "100%",
				padding: `${PAD_Y}px ${PAD_X}px`,
				backgroundColor: GRAY[50],
				fontFamily: "Geist",
			}}
		>
			<DotField width={size.width} height={size.height} />
			<RaidLogPlate
				width={RAID_PLATE.width}
				height={RAID_PLATE.height}
				insetTop={PAD_Y}
			/>

			{/* Satori ignores z-index and paints in tree order, so the copy comes last. */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					width: RAID_COPY,
					height: "100%",
				}}
			>
				<div style={{ display: "flex", flexDirection: "column" }}>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 8,
							color: GRAY[400],
							fontSize: 26,
							fontWeight: 500,
						}}
					>
						<span>Writing</span>
						<span style={{ padding: "0 8px" }}>•</span>
						<span>
							{DATE_FORMAT.format(new Date(`${entry.date}T00:00:00Z`))}
						</span>
					</div>

					<div
						style={{
							marginTop: 20,
							color: GRAY[900],
							fontSize: titleSize(entry.title),
							fontWeight: 600,
							lineHeight: 1.15,
							letterSpacing: "-0.02em",
						}}
					>
						{entry.title}
					</div>
				</div>

				<div style={{ display: "flex", color: GRAY[500], fontSize: 26, fontWeight: 500 }}>
					PG Gonni
				</div>
			</div>
		</div>,
		{ ...size, fonts },
	);
}
