import { StarIcon } from "./icons/StarIcon";
import { cn } from "./cn";

export function StarRating({
	rating,
	size = 14,
	className,
}: {
	rating: number;
	size?: number;
	className?: string;
}) {
	return (
		<div
			// aria-label on a role-less div is dropped by most screen readers, so the
			// row has to declare itself an image with the stars hidden behind it.
			role="img"
			aria-label={`Rated ${rating} out of 5`}
			className={cn("flex gap-0.5", className)}
		>
			{Array.from({ length: 5 }, (_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: fixed-length star row
				<StarIcon
					key={i}
					size={size}
					className={cn(i < rating ? "text-gray-800" : "text-gray-300")}
				/>
			))}
		</div>
	);
}
