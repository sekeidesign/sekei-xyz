export const RainIcon = ({
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
				fillRule="evenodd"
				clipRule="evenodd"
				d="M12.5 20.5C6.35 20.5 3.58 13.67 6.23 9.51C8.71 5.96 12.5 3.5 12.5 3.5C12.5 3.5 16.29 5.96 18.77 9.51C21.42 13.67 18.65 20.5 12.5 20.5ZM9.76 13.98C9.6 13.57 9.13 13.37 8.73 13.53C8.32 13.7 8.12 14.16 8.28 14.57C8.81 15.91 10.02 17.05 11.74 17.25C12.17 17.3 12.57 16.98 12.62 16.55C12.67 16.11 12.35 15.72 11.92 15.67C10.86 15.54 10.11 14.85 9.76 13.98Z"
				fill="currentColor"
			/>
		</svg>
	);
};
