export function SourceIcon({
	viewBox,
	paths,
	className,
}: {
	viewBox: string;
	paths: readonly string[];
	className?: string;
}) {
	return (
		<svg
			viewBox={viewBox}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			style={{ flexShrink: 0 }}
			aria-hidden="true"
			focusable="false"
		>
			{paths.map((d) => (
				<path
					key={d}
					fillRule="evenodd"
					clipRule="evenodd"
					d={d}
					fill="currentColor"
				/>
			))}
		</svg>
	);
}
