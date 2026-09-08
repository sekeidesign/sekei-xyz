/** The glyphs this figure needs that the icon set doesn't already carry. */

const STROKE = {
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 2,
	strokeLinecap: "round",
	strokeLinejoin: "round",
} as const;

function Glyph({
	size = 16,
	className,
	children,
}: {
	size?: number;
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			style={{ flexShrink: 0 }}
			aria-hidden="true"
			focusable="false"
		>
			{children}
		</svg>
	);
}

export const PlayIcon = ({ className }: { className?: string }) => (
	<Glyph size={20} className={className}>
		<path
			d="M13.941 6.337C15.573 7.265 16.857 7.994 17.771 8.661C18.691 9.334 19.372 10.037 19.616 10.963C19.795 11.643 19.795 12.357 19.616 13.037C19.372 13.963 18.691 14.666 17.771 15.338C16.857 16.006 15.573 16.735 13.941 17.663C12.363 18.559 11.033 19.315 10.023 19.744C9.005 20.177 8.077 20.397 7.175 20.141C6.513 19.953 5.909 19.597 5.424 19.107C4.764 18.441 4.5 17.522 4.374 16.415C4.25 15.317 4.25 13.879 4.25 12.05V11.95C4.25 10.121 4.25 8.683 4.374 7.585C4.5 6.478 4.764 5.559 5.424 4.893C5.909 4.403 6.513 4.047 7.175 3.859C8.077 3.603 9.005 3.823 10.023 4.256C11.033 4.685 12.363 5.441 13.941 6.337Z"
			fill="currentColor"
		/>
	</Glyph>
);

export const VolumeIcon = ({ className }: { className?: string }) => (
	<Glyph className={className}>
		<path
			d="M14 14.813V9.186C14 6.041 14 4.469 13.075 4.077C12.149 3.686 11.06 4.798 8.882 7.022C7.754 8.174 7.111 8.429 5.506 8.429C4.103 8.429 3.401 8.429 2.897 8.773C1.85 9.487 2.009 10.882 2.009 12C2.009 13.118 1.85 14.513 2.897 15.227C3.401 15.571 4.103 15.571 5.506 15.571C7.111 15.571 7.754 15.826 8.882 16.978C11.06 19.202 12.149 20.314 13.075 19.923C14 19.531 14 17.959 14 14.813Z"
			{...STROKE}
		/>
		<path d="M17 9C17.625 9.82 18 10.863 18 12C18 13.137 17.625 14.18 17 15" {...STROKE} />
		<path d="M20 7C21.251 8.366 22 10.106 22 12C22 13.894 21.251 15.634 20 17" {...STROKE} />
	</Glyph>
);

export const CollapseIcon = ({ className }: { className?: string }) => (
	<Glyph className={className}>
		<path
			d="M6.502 13.264C7.347 13.252 10.143 12.671 10.736 13.264C11.329 13.856 10.748 16.653 10.736 17.497M13.268 6.497C13.257 7.342 12.676 10.138 13.268 10.731C13.861 11.324 16.658 10.743 17.502 10.731M20.999 2.999L13.61 10.381M10.369 13.624L3 21.001"
			{...STROKE}
		/>
	</Glyph>
);

export const DismissIcon = ({
	size,
	className,
}: {
	size?: number;
	className?: string;
}) => (
	<Glyph size={size} className={className}>
		<path d="M18 6L6.001 17.999M17.999 18L6 6.001" {...STROKE} />
	</Glyph>
);

/** The flame's own outline, which the tracked fill is clipped to. */
export const FLAME =
	"M13.856 22C26.078 19 19.234 7 10.923 2C9.945 5.5 8.478 6.5 5.545 10C1.661 14.634 3.59 20 8.967 22C8.152 21 6.05 18.901 7.5 16C8 15 9 14 8.5 12C9.478 12.5 11.5 13 12 15.5C12.815 14.5 13.66 12.4 12.878 10C19 14.5 16.5 19 13.856 22Z";

export const TrackIcon = ({
	size,
	filled,
	className,
}: {
	size?: number;
	filled?: boolean;
	className?: string;
}) => (
	<Glyph size={size} className={className}>
		<path d={FLAME} {...STROKE} fill={filled ? "currentColor" : "none"} />
	</Glyph>
);

const POINTER = "M5 3L18.5 12.5L11 13.8L5 18Z";

/**
 * The pointer that drives the press figure, after Figma's: no tail, the corners
 * softened by stroking the same path it fills, and a white outline from a
 * wider stroke of that path underneath.
 */
export const CursorIcon = ({ className }: { className?: string }) => (
	<svg
		width={26}
		height={26}
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		style={{ flexShrink: 0 }}
		aria-hidden="true"
		focusable="false"
	>
		<path
			d={POINTER}
			fill="white"
			stroke="white"
			strokeWidth="4.5"
			strokeLinejoin="round"
			strokeLinecap="round"
		/>
		<path
			d={POINTER}
			fill="currentColor"
			stroke="currentColor"
			strokeWidth="1.75"
			strokeLinejoin="round"
			strokeLinecap="round"
		/>
	</svg>
);

/** A quarter-turn dial for an item in progress, an open ring for one not started. */
export const StatusIcon = ({
	started,
	className,
}: {
	started?: boolean;
	className?: string;
}) => (
	<svg
		width={14}
		height={14}
		viewBox="0 0 16 16"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		style={{ flexShrink: 0 }}
		aria-hidden="true"
		focusable="false"
	>
		<circle
			cx="8"
			cy="8"
			r="7"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeDasharray={started ? undefined : "2 2.5"}
		/>
		{started && <path d="M 8 3 A 5 5 0 0 1 13 8 L 8 8 Z" fill="currentColor" />}
	</svg>
);

/**
 * Impact, as four quadrants around a centre: the first lit quadrant sits at
 * the bottom left and they fill clockwise, the centre only at the top step.
 */
const QUADRANTS = [
	"M9 4.614C9 4.867 8.81 5.078 8.562 5.125C6.638 5.487 5.487 6.638 5.125 8.562C5.078 8.81 4.867 9 4.614 9H2.631C2.33 9 2.096 8.736 2.154 8.441C2.78 5.274 5.274 2.779 8.441 2.153C8.736 2.095 9 2.329 9 2.63V4.614Z",
	"M11 2.63C11 2.329 11.264 2.095 11.559 2.153C14.726 2.779 17.22 5.274 17.846 8.441C17.904 8.736 17.67 9 17.369 9H15.386C15.133 9 14.922 8.81 14.875 8.562C14.513 6.638 13.362 5.487 11.438 5.125C11.19 5.078 11 4.867 11 4.614V2.63Z",
	"M17.369 11C17.67 11 17.904 11.264 17.846 11.559C17.22 14.726 14.726 17.22 11.559 17.846C11.264 17.904 11 17.67 11 17.369V15.385C11 15.132 11.19 14.921 11.438 14.874C13.361 14.512 14.513 13.361 14.875 11.438C14.922 11.19 15.133 11 15.386 11H17.369Z",
	"M4.614 11C4.867 11 5.078 11.19 5.125 11.438C5.487 13.361 6.638 14.512 8.562 14.874C8.81 14.921 9 15.132 9 15.385V17.369C9 17.67 8.736 17.904 8.441 17.846C5.274 17.22 2.78 14.726 2.154 11.559C2.096 11.264 2.33 11 2.631 11H4.614Z",
];

export const ImpactIcon = ({
	level,
	className,
}: {
	level: number;
	className?: string;
}) => (
	<svg
		width={18}
		height={18}
		viewBox="0 0 20 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		style={{ flexShrink: 0 }}
		aria-hidden="true"
		focusable="false"
	>
		<path
			d="M12 10C12 11.105 11.105 12 10 12C8.895 12 8 11.105 8 10C8 8.895 8.895 8 10 8C11.105 8 12 8.895 12 10Z"
			className={level > 3 ? "fill-current" : "fill-gray-400/20"}
		/>
		{QUADRANTS.map((d, index) => (
			<path
				key={d}
				d={d}
				className={index < level ? "fill-current" : "fill-gray-400/20"}
			/>
		))}
	</svg>
);

/** Likelihood, as three bars of rising height filled up to the level. */
export const LikelihoodIcon = ({
	level,
	className,
}: {
	level: number;
	className?: string;
}) => (
	<span
		aria-hidden="true"
		className={`flex h-3 shrink-0 items-end gap-0.5 ${className ?? ""}`}
	>
		{[1, 2, 3].map((step) => (
			<span
				key={step}
				className="flex h-3 flex-col justify-end rounded-[1px] bg-gray-400/20"
			>
				<span
					style={{ height: `${(step / 3) * 100}%` }}
					className={`w-0.75 rounded-[1px] ${step <= level ? "bg-current" : ""}`}
				/>
			</span>
		))}
	</span>
);
