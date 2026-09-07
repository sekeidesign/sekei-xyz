"use client";

import { useEffect, useState } from "react";

/**
 * A canvas that has drawn a cross-origin image can't be read back, so the card's
 * cover has to be a data URL before it can be exported. Remote covers go through
 * the image optimiser, which is same-origin and so readable; a direct fetch is
 * the fallback for hosts it can't serve.
 */
function sources(src: string): string[] {
	if (src.startsWith("/") || src.startsWith("data:")) return [src];
	return [`/_next/image?url=${encodeURIComponent(src)}&w=256&q=90`, src];
}

function toDataUrl(blob: Blob) {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () => reject(reader.error);
		reader.readAsDataURL(blob);
	});
}

export function useEmbeddedImage(src: string | undefined) {
	const [embedded, setEmbedded] = useState<string>();

	useEffect(() => {
		setEmbedded(undefined);
		if (!src) return;

		let cancelled = false;
		void (async () => {
			for (const candidate of sources(src)) {
				try {
					const response = await fetch(candidate);
					if (!response.ok) continue;
					const dataUrl = await toDataUrl(await response.blob());
					if (!cancelled) setEmbedded(dataUrl);
					return;
				} catch {
					// Try the next source.
				}
			}
			if (!cancelled) setEmbedded(src);
		})();

		return () => {
			cancelled = true;
		};
	}, [src]);

	return embedded;
}
