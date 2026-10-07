"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Screenshots and recordings that live outside the repo. Until the file is
 * dropped into public/present, the slot shows what belongs there.
 */
export function Asset({
	src,
	label,
	className = "aspect-video",
}: {
	src: string;
	label: string;
	className?: string;
}) {
	const [missing, setMissing] = useState(false);
	const video = /\.(mp4|webm|mov)$/.test(src);
	const imgRef = useRef<HTMLImageElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);

	// A server-rendered element can fail before hydration attaches onError.
	useEffect(() => {
		const img = imgRef.current;
		if (img?.complete && img.naturalWidth === 0) setMissing(true);
		if (videoRef.current?.error) setMissing(true);
	}, []);

	if (missing) {
		return (
			<div
				className={`${className} flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center`}
			>
				<span className="text-base font-[500] text-gray-600">{label}</span>
				<span className="font-mono text-xs text-gray-400">public{src}</span>
			</div>
		);
	}

	return video ? (
		<video
			ref={videoRef}
			src={src}
			onError={() => setMissing(true)}
			className={`${className} w-full rounded-xl bg-gray-200 object-cover ring-1 ring-gray-500/10`}
			autoPlay
			loop
			muted
			playsInline
		/>
	) : (
		// eslint-disable-next-line @next/next/no-img-element -- assets of unknown size, swapped in by hand
		<img // react-doctor-disable-line nextjs-no-img-element -- assets of unknown size, swapped in by hand
			ref={imgRef}
			src={src}
			alt={label}
			onError={() => setMissing(true)}
			className={`${className} w-full rounded-xl bg-gray-200 object-cover object-top ring-1 ring-gray-500/10`}
		/>
	);
}
