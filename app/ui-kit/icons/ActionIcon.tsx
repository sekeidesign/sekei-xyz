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
				d="M19.9152 10.1047C19.6582 9.60268 19.1482 9.29068 18.5842 9.29068H13.6062V4.00068C13.6062 3.33768 13.2002 2.77668 12.5722 2.57268C11.9412 2.36768 11.2902 2.58268 10.9022 3.11668H10.9012L4.20622 12.3367C3.87422 12.7957 3.82822 13.3927 4.08522 13.8967C4.34222 14.3977 4.85222 14.7097 5.41622 14.7097H10.3932V20.0007C10.3932 20.6627 10.7992 21.2227 11.4272 21.4267C11.5852 21.4787 11.7452 21.5037 11.9022 21.5037C12.3682 21.5037 12.8092 21.2837 13.0992 20.8837L19.7942 11.6637C20.1262 11.2047 20.1722 10.6077 19.9152 10.1047Z"
				fill="currentColor"
			/>
		</svg>
	);
};
