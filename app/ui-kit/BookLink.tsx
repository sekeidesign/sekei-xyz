"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { BookPreview } from "./BookPreview";

interface BookLinkProps {
	href: string;
	children: ReactNode;
	target?: string;
	cover: string;
	coverAlt?: string;
	author?: string;
	description?: string;
}

export const BookLink = ({
	href,
	children,
	target = "_blank",
	cover,
	coverAlt = "",
	author,
	description,
}: BookLinkProps) => {
	return (
		<BookPreview
			cover={cover}
			title={children}
			author={author}
			description={description}
		>
			<Link
				href={href}
				rel={target === "_blank" ? "noopener noreferrer" : undefined}
				className="text-gray-900 group font-[500] relative no-underline inline-flex items-center px-0.5 gap-1.5 pl-5 ml-px"
				target={target}
			>
				<span className="group-hover:opacity-50 group-hover:scale-100 absolute w-[calc(100%+4px)] h-full -left-0.5 top-0 bg-gray-200 rounded-md -z-10 opacity-0 scale-50 transition-[opacity,transform] duration-200" />

				<span
					className="absolute left-0 w-3.5 h-4 shrink-0"
					style={{ perspective: "24px" }}
				>
					{/* page edge, sits behind and peeks out from the tilted cover */}
					<span
						className="absolute inset-y-px right-0 w-2 rounded-r-[1px] bg-gradient-to-b from-white via-gray-100 to-white"
						style={{
							boxShadow:
								"0 0 0 0.5px rgba(0,0,0,0.04), 1px 1px 1px rgba(0,0,0,0.8)",
						}}
					/>

					{/* front cover */}
					<span
						className="absolute inset-0 rounded-[1.5px] overflow-hidden origin-left group-hover:-rotate-y-15 transition-transform duration-200"
						style={{
							boxShadow:
								"1px 1px 2px rgba(0,0,0,0.10), 0 0 0 0.5px rgba(0,0,0,0.5)",
						}}
					>
						<Image
							src={cover}
							alt={coverAlt}
							fill
							sizes="14px"
							className="object-cover"
						/>
						{/* spine shading */}
						<span className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-r from-black/45 to-transparent" />
						{/* glossy highlight */}
						<span className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10" />
					</span>
				</span>

				{children}
			</Link>
		</BookPreview>
	);
};

export type { BookLinkProps };
