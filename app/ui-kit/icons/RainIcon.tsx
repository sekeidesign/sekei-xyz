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
				d="M12.5002 20.5C6.3526 20.5 3.57838 13.6669 6.23406 9.51157C8.70779 5.95627 12.5002 3.5 12.5002 3.5C12.5002 3.5 16.2925 5.95627 18.7663 9.51157C21.4219 13.6669 18.6477 20.5 12.5002 20.5ZM9.76048 13.9797C9.59773 13.5708 9.13431 13.3713 8.72541 13.534C8.3165 13.6968 8.11695 14.1602 8.2797 14.5691C8.81368 15.9107 10.0151 17.0517 11.7359 17.2486C12.1731 17.2986 12.5681 16.9847 12.6182 16.5474C12.6682 16.1102 12.3543 15.7152 11.9171 15.6651C10.859 15.5441 10.1087 14.8546 9.76048 13.9797Z"
				fill="currentColor"
			/>
		</svg>
	);
};
