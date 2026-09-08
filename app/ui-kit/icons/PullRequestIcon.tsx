export const PullRequestIcon = ({ className }: { className?: string }) => {
	return (
		<svg
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
				d="M17.44 14.78V8.14C17.44 6.62 16.2 5.38 14.68 5.38H12.48C12.07 5.38 11.73 5.72 11.73 6.13C11.73 6.55 12.07 6.88 12.48 6.88H14.68C15.38 6.88 15.94 7.45 15.94 8.14V14.8C14.74 15.13 13.86 16.22 13.86 17.53C13.86 19.1 15.14 20.37 16.71 20.37C18.28 20.37 19.56 19.1 19.56 17.53C19.56 16.21 18.65 15.11 17.44 14.78Z"
				fill="currentColor"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M10.14 6.47C10.14 4.9 8.86 3.62 7.29 3.62C5.72 3.62 4.44 4.9 4.44 6.47C4.44 7.78 5.34 8.88 6.54 9.21V14.79C5.34 15.12 4.44 16.22 4.44 17.53C4.44 19.1 5.72 20.37 7.29 20.37C8.86 20.37 10.14 19.1 10.14 17.53C10.14 16.22 9.25 15.12 8.04 14.79V9.21C9.25 8.88 10.14 7.78 10.14 6.47Z"
				fill="currentColor"
			/>
		</svg>
	);
};
