"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useMemo, useState } from "react";
import { OpenGraphPreview } from "./OpenGraphPreview";

interface TextLinkProps {
	href: string;
	children: ReactNode;
	target?: string;
	hasFavicon?: boolean;
	/** Skip origin/favicon.ico auto-detection (and its Google-favicon
	 * fallback) and use this local asset instead — for sites whose real
	 * favicon doesn't resolve cleanly. */
	favicon?: string;
}

export const TextLink = ({
	href,
	children,
	target = "_blank",
	hasFavicon = false,
	favicon,
}: TextLinkProps) => {
	// Both candidates are derived from `href`, so neither is state. Only which
	// one is in play is, and that only ever advances on an <img> error.
	const candidates = useMemo(() => {
		if (favicon) return [favicon];
		if (!hasFavicon) return [];
		try {
			const url = new URL(href);
			return [
				`${url.origin}/favicon.ico`,
				`https://www.google.com/s2/favicons?domain=${url.hostname}&sz=32`,
			];
		} catch {
			return [];
		}
	}, [href, hasFavicon, favicon]);

	// Keyed by href so a changed prop resets the attempt during render rather
	// than in an effect, which would show the previous site's favicon first.
	const [attempt, setAttempt] = useState({ href, index: 0 });
	const index = attempt.href === href ? attempt.index : 0;
	const faviconUrl = candidates[index] ?? null;

	return (
		<OpenGraphPreview url={href}>
			<Link
				href={href}
				rel={target === "_blank" ? "noopener noreferrer" : undefined}
				className={`text-gray-900 group font-[500] relative no-underline inline-flex items-center px-0.5 ${hasFavicon ? "gap-1 pl-4.5 ml-px" : ""}`}
				target={target}
			>
				<span className="group-hover:opacity-50 group-hover:scale-100 absolute w-[calc(100%+4px)] h-full -left-0.5 top-0 bg-gray-200 rounded-md -z-10 opacity-0 scale-50 transition-[opacity,transform] duration-200" />
				{hasFavicon && faviconUrl && (
					<Image
						src={faviconUrl}
						alt=""
						className="w-3 h-3 rounded-sm absolute left-0.5"
						onError={() => setAttempt({ href, index: index + 1 })}
						width={12}
						height={12}
					/>
				)}
				{children}
			</Link>
		</OpenGraphPreview>
	);
};

export type { TextLinkProps };
