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
		const controller = new AbortController();
		void (async () => {
			let dataUrl: string | undefined;
			for (const candidate of sources(src)) {
				try {
					const response = await fetch(candidate, {
						signal: controller.signal,
					});
					if (response.ok) {
						dataUrl = await toDataUrl(await response.blob());
						break;
					}
				} catch {
					// An aborted fetch rejects into here too, and every remaining
					// candidate would reject the same way. Stop instead of cascading.
					if (controller.signal.aborted) break;
				}
			}
			if (cancelled) return;
			setEmbedded(dataUrl ?? src);
		})();

		return () => {
			cancelled = true;
			controller.abort();
		};
	}, [src]);

	return embedded;
}
