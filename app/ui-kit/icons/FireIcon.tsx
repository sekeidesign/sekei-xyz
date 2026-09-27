export const FireIcon = ({
	size = 16,
	filled = false,
	className,
}: {
	size?: number;
	filled?: boolean;
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
			{filled ? (
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M12.669 5.751C11.868 4.085 10.475 2.724 8.527 1.704 8.416 1.647 8.284 1.655 8.182 1.726 8.079 1.797 8.026 1.919 8.042 2.043 8.24 3.56 7.965 5.678 7.16 6.595 6.899 6.893 6.605 7.043 6.265 7.052 6.039 6.671 5.809 5.041 5.809 4.666 5.809 4.541 5.739 4.427 5.627 4.37 5.517 4.313 5.382 4.322 5.282 4.395 5.027 4.577 4.464 5.103 4.289 5.278 2.526 6.956 2.116 9.411 3.243 11.531 4.188 13.309 5.917 14.333 7.831 14.333 8.223 14.333 8.625 14.29 9.027 14.201 10.682 13.928 12.007 12.956 12.758 11.463 13.627 9.738 13.593 7.55 12.669 5.751Z"
					fill="currentColor"
				/>
			) : (
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M12.369 5.899C13.987 9.046 12.686 13.261 8.971 13.874 4.107 14.939 0.862 9.001 4.516 5.519 4.711 5.326 5.249 4.827 5.473 4.667 5.473 5.001 5.768 7.583 6.229 7.387 8.123 7.387 8.632 4.001 8.371 2 10.076 2.891 11.52 4.133 12.369 5.899Z"
					fill="none"
					stroke="currentColor"
					strokeWidth={4 / 3}
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			)}
		</svg>
	);
};
