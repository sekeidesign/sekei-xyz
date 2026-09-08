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

export const VolumeIcon = ({
	size,
	className,
}: {
	size?: number;
	className?: string;
}) => (
	<Glyph size={size} className={className}>
		<path
			d="M14 14.813V9.186C14 6.041 14 4.469 13.075 4.077C12.149 3.686 11.06 4.798 8.882 7.022C7.754 8.174 7.111 8.429 5.506 8.429C4.103 8.429 3.401 8.429 2.897 8.773C1.85 9.487 2.009 10.882 2.009 12C2.009 13.118 1.85 14.513 2.897 15.227C3.401 15.571 4.103 15.571 5.506 15.571C7.111 15.571 7.754 15.826 8.882 16.978C11.06 19.202 12.149 20.314 13.075 19.923C14 19.531 14 17.959 14 14.813Z"
			{...STROKE}
		/>
		<path d="M17 9C17.625 9.82 18 10.863 18 12C18 13.137 17.625 14.18 17 15" {...STROKE} />
		<path d="M20 7C21.251 8.366 22 10.106 22 12C22 13.894 21.251 15.634 20 17" {...STROKE} />
	</Glyph>
);

export const CollapseIcon = ({
	size,
	className,
}: {
	size?: number;
	className?: string;
}) => (
	<Glyph size={size} className={className}>
		<path
			d="M6.502 13.264C7.347 13.252 10.143 12.671 10.736 13.264C11.329 13.856 10.748 16.653 10.736 17.497M13.268 6.497C13.257 7.342 12.676 10.138 13.268 10.731C13.861 11.324 16.658 10.743 17.502 10.731M20.999 2.999L13.61 10.381M10.369 13.624L3 21.001"
			{...STROKE}
		/>
	</Glyph>
);

/** The meeting a version came from, and the link out to it. */
export const CalendarIcon = ({
	size,
	className,
}: {
	size?: number;
	className?: string;
}) => (
	<Glyph size={size} className={className}>
		<path
			d="M21.75 11.928V14.026C21.75 15.808 21.75 17.244 21.599 18.374C21.441 19.547 21.105 20.535 20.322 21.319C19.54 22.103 18.554 22.441 17.384 22.598C16.257 22.75 14.824 22.75 13.046 22.75H10.954C9.176 22.75 7.743 22.75 6.616 22.598C5.446 22.441 4.46 22.103 3.678 21.319C2.895 20.535 2.559 19.547 2.401 18.374C2.25 17.244 2.25 15.808 2.25 14.026V11.928C2.25 11.135 2.25 10.41 2.263 9.75H4.214C4.2 10.396 4.2 11.138 4.2 12V13.954C4.2 15.825 4.202 17.129 4.334 18.114C4.462 19.07 4.697 19.576 5.057 19.937C5.417 20.297 5.922 20.532 6.876 20.661C7.858 20.793 9.159 20.796 11.025 20.796H12.975C14.841 20.796 16.142 20.793 17.125 20.661C18.078 20.532 18.584 20.297 18.943 19.937C19.303 19.576 19.538 19.07 19.666 18.114C19.798 17.129 19.8 15.825 19.8 13.954V12C19.8 11.138 19.8 10.396 19.786 9.75H21.737C21.75 10.41 21.75 11.135 21.75 11.928Z"
			fill="currentColor"
			opacity="0.4"
		/>
		<path
			d="M8.1 1.25C8.638 1.25 9.075 1.688 9.075 2.227V3.213C9.653 3.205 10.278 3.205 10.954 3.205H13.046C13.722 3.205 14.347 3.205 14.925 3.213V2.227C14.925 1.688 15.361 1.25 15.9 1.25C16.439 1.25 16.875 1.688 16.875 2.227V3.299C17.051 3.316 17.221 3.334 17.384 3.356C18.554 3.514 19.54 3.851 20.322 4.636C21.105 5.42 21.441 6.408 21.599 7.58C21.683 8.207 21.72 8.928 21.737 9.75H2.263C2.28 8.928 2.317 8.207 2.401 7.58C2.559 6.408 2.895 5.42 3.678 4.636C4.46 3.851 5.446 3.514 6.616 3.356C6.779 3.334 6.949 3.316 7.125 3.299V2.227C7.125 1.688 7.562 1.25 8.1 1.25Z"
			fill="currentColor"
		/>
	</Glyph>
);

export const ExternalLinkIcon = ({
	size,
	className,
}: {
	size?: number;
	className?: string;
}) => (
	<Glyph size={size} className={className}>
		<path
			d="M11.1 3.002C7.452 3.009 5.541 3.098 4.32 4.319C3.002 5.637 3.002 7.758 3.002 12C3.002 16.241 3.002 18.362 4.32 19.68C5.637 20.998 7.758 20.998 12 20.998C16.242 20.998 18.363 20.998 19.681 19.68C20.902 18.459 20.992 16.548 20.998 12.9"
			{...STROKE}
		/>
		<path
			d="M20.48 3.518L14.931 9.052M20.48 3.518C19.986 3.023 16.659 3.069 15.955 3.079M20.48 3.518C20.974 4.012 20.928 7.343 20.918 8.048"
			{...STROKE}
		/>
	</Glyph>
);

export const EditIcon = ({
	size,
	className,
}: {
	size?: number;
	className?: string;
}) => (
	<Glyph size={size} className={className}>
		<path
			d="M3.5 18.985V20.5H5.014C6.241 20.5 6.854 20.5 7.405 20.272C7.957 20.043 8.39 19.61 9.257 18.743L19.121 8.879C20.004 7.996 20.445 7.555 20.494 7.013C20.502 6.924 20.502 6.834 20.494 6.744C20.445 6.203 20.004 5.761 19.121 4.879C18.238 3.996 17.797 3.555 17.256 3.506C17.166 3.498 17.076 3.498 16.986 3.506C16.445 3.555 16.004 3.996 15.121 4.879L5.257 14.743C4.39 15.61 3.957 16.043 3.728 16.595C3.5 17.146 3.5 17.759 3.5 18.985Z"
			{...STROKE}
		/>
		<path d="M13.5 6.5L17.5 10.5" {...STROKE} />
	</Glyph>
);

export const SkillsIcon = ({
	size,
	className,
}: {
	size?: number;
	className?: string;
}) => (
	<Glyph size={size} className={className}>
		<path
			d="M17.506 2.019C12.829 2.835 12 7.5 12 7.5V22C12 22 12.887 17.127 18 16.559C18.549 16.498 19 16.058 19 15.506V3.393C19 2.565 18.322 1.876 17.506 2.019Z"
			{...STROKE}
		/>
		<path
			d="M5.333 5C7.794 4.997 10.168 5.887 12 7.5V22C10.168 20.387 7.794 19.497 5.333 19.5C3.771 19.5 2.99 19.5 2.645 19.279C2.438 19.147 2.353 19.062 2.221 18.855C2 18.51 2 17.894 2 16.663V8.403C2 6.975 2 6.262 2.549 5.683C3.097 5.104 3.659 5.074 4.783 5.015C4.965 5.005 5.149 5 5.333 5Z"
			{...STROKE}
		/>
		<path
			d="M12 22.001C13.832 20.388 16.206 19.498 18.667 19.501C20.229 19.501 21.01 19.501 21.355 19.28C21.562 19.148 21.646 19.063 21.779 18.856C22 18.511 22 17.895 22 16.664V8.404C22 6.976 22 6.263 21.451 5.684C20.902 5.105 20.123 5.06 19 5"
			{...STROKE}
		/>
	</Glyph>
);

/** The bolt a skill card carries, filled rather than drawn. */
export const SkillIcon = ({
	size,
	className,
}: {
	size?: number;
	className?: string;
}) => (
	<Glyph size={size} className={className}>
		<path
			d="M13.608 1.147C14.314 1.448 14.797 2.163 14.797 3.017L14.798 9.785C14.798 9.895 14.887 9.985 14.998 9.985H18.099C18.985 9.985 19.595 10.583 19.847 11.21C20.097 11.837 20.064 12.642 19.563 13.285L12.565 22.268C12.003 22.988 11.12 23.163 10.392 22.852C9.685 22.551 9.202 21.837 9.202 20.983L9.202 14.215C9.202 14.104 9.112 14.015 9.002 14.015H5.9C5.014 14.015 4.404 13.417 4.153 12.789C3.902 12.163 3.936 11.357 4.437 10.715L11.435 1.732C11.996 1.011 12.879 0.837 13.608 1.147Z"
			fill="currentColor"
		/>
	</Glyph>
);

/** The caret the panel's groups and its menus collapse behind. */
export const ChevronIcon = ({
	size,
	className,
}: {
	size?: number;
	className?: string;
}) => (
	<Glyph size={size} className={className}>
		<path d="M18 9C18 9 13.581 15 12 15C10.419 15 6 9 6 9" {...STROKE} />
	</Glyph>
);

export const MenuIcon = ({
	size,
	className,
}: {
	size?: number;
	className?: string;
}) => (
	<Glyph size={size} className={className}>
		{[6, 12, 18].map((cy) => (
			<circle key={cy} cx="12" cy={cy} r="1.75" fill="currentColor" />
		))}
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
 * After Figma's pointer. Drawn twice: the wider stroke underneath is the white
 * outline, and stroking each path with its own fill is what rounds the corners.
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

/** Ordered from the bottom left clockwise, which is the order they light in. */
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
