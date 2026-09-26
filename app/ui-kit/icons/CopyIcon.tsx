export const CopyIcon = ({
	size = 16,
	className,
}: {
	size?: number;
	className?: string;
}) => {
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
			<path
				d="M15.29 5.75C15.03 4.11 13.85 3 12.07 3H6.29C4.28 3 3.02 4.43 3.02 6.44V11.88C3.02 13.72 4.07 15.08 5.79 15.29"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M17.71 8.68H11.93C9.92 8.68 8.66 10.1 8.66 12.12V17.56C8.66 19.57 9.92 21 11.93 21H17.7C19.72 21 20.98 19.57 20.98 17.56V12.12C20.98 10.1 19.72 8.68 17.71 8.68Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};
