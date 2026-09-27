export const ChainLinkIcon = ({
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
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			style={{ flexShrink: 0 }}
			aria-hidden="true"
			focusable="false"
		>
			<path
				d="M3.923 6.471L3.159 7.236C1.614 8.781 1.614 11.299 3.159 12.843 4.698 14.383 7.221 14.388 8.766 12.843L9.531 12.079"
				stroke="currentColor"
				strokeWidth={4 / 3}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M12.077 9.534L12.841 8.769C14.386 7.225 14.386 4.707 12.841 3.162 11.302 1.623 8.779 1.617 7.234 3.162L6.469 3.927"
				stroke="currentColor"
				strokeWidth={4 / 3}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M9.758 6.305L6.269 9.793"
				stroke="currentColor"
				strokeWidth={4 / 3}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};
