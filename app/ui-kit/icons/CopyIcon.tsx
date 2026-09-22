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
				d="M15.2852 5.74802C15.0308 4.10756 13.8495 3 12.0693 3H6.29465C4.28435 3 3.02148 4.42788 3.02148 6.44497V11.8837C3.02148 13.7213 4.07177 15.0754 5.79377 15.2889"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M17.706 8.67969H11.9333C9.92205 8.67969 8.66016 10.1037 8.66016 12.1198V17.5586C8.66016 19.5747 9.91526 20.9987 11.9333 20.9987H17.705C19.7241 20.9987 20.9792 19.5747 20.9792 17.5586V12.1198C20.9792 10.1037 19.7241 8.67969 17.706 8.67969Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};
