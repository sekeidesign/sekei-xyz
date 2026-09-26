export const ActionIcon = ({
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
				d="M19.92 10.1C19.66 9.6 19.15 9.29 18.58 9.29H13.61V4C13.61 3.34 13.2 2.78 12.57 2.57C11.94 2.37 11.29 2.58 10.9 3.12H10.9L4.21 12.34C3.87 12.8 3.83 13.39 4.09 13.9C4.34 14.4 4.85 14.71 5.42 14.71H10.39V20C10.39 20.66 10.8 21.22 11.43 21.43C11.59 21.48 11.75 21.5 11.9 21.5C12.37 21.5 12.81 21.28 13.1 20.88L19.79 11.66C20.13 11.2 20.17 10.61 19.92 10.1Z"
				fill="currentColor"
			/>
		</svg>
	);
};
