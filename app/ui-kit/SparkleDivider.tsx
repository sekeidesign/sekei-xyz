import { cn } from "./cn";

export function SparkleDivider({ className }: { className?: string }) {
	return (
		// An ornament between sections, not a section break of its own — the
		// heading that follows is the real one, so this stays out of the tree.
		<div
			aria-hidden="true"
			className={cn("flex items-center gap-4 w-full", className)}
		>
			<span className="block w-full border-t border-gray-200" />
			<svg
				viewBox="0 0 15 15"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="size-4 text-gray-200 shrink-0"
			>
				<path
					d="M6.59 0.33C6.75-0.11 7.37-0.11 7.53 0.33L9.14 4.68C9.19 4.82 9.3 4.93 9.44 4.98L13.79 6.59C14.23 6.75 14.23 7.37 13.79 7.53L9.44 9.14C9.3 9.19 9.19 9.3 9.14 9.44L7.53 13.79C7.37 14.23 6.75 14.23 6.59 13.79L4.98 9.44C4.93 9.3 4.82 9.19 4.68 9.14L0.33 7.53C-0.11 7.37-0.11 6.75 0.33 6.59L4.68 4.98C4.82 4.93 4.93 4.82 4.98 4.68L6.59 0.33Z"
					fill="currentColor"
				/>
			</svg>
			<span className="block w-full border-t border-gray-200" />
		</div>
	);
}
