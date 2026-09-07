import { toCanvas } from "html-to-image";

export type CardFormat = "webp" | "png";

const MIME: Record<CardFormat, string> = {
	webp: "image/webp",
	png: "image/png",
};

/**
 * The pen's edge filter is defined in an SVG the highlighter parks on
 * document.body, so a mark's `filter: url(#id)` has nothing to resolve against
 * once the card is serialised on its own — and an unresolvable filter drops the
 * element entirely. Lending the card a copy for the length of the capture is
 * enough; sized to nothing so it can't disturb the layout being measured.
 */
function lendFilterDefs(node: HTMLElement) {
	const lent: SVGElement[] = [];
	for (const svg of document.querySelectorAll("svg")) {
		if (node.contains(svg)) continue;
		if (!svg.querySelector('filter[id^="highlighters-"]')) continue;
		const copy = svg.cloneNode(true) as SVGElement;
		copy.style.position = "absolute";
		copy.style.width = "0";
		copy.style.height = "0";
		node.appendChild(copy);
		lent.push(copy);
	}
	return () => {
		for (const copy of lent) copy.remove();
	};
}

export async function renderCard(node: HTMLElement, scale: number) {
	// html-to-image inlines the @font-face sources it finds in the stylesheets,
	// but a face the browser hasn't loaded yet still measures wrong in the clone.
	await document.fonts.ready;

	const returnDefs = lendFilterDefs(node);
	try {
		return await toCanvas(node, { pixelRatio: scale, cacheBust: true });
	} finally {
		returnDefs();
	}
}

export function encode(
	canvas: HTMLCanvasElement,
	format: CardFormat,
): Promise<Blob> {
	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) =>
				blob
					? resolve(blob)
					: reject(new Error(`The browser could not encode ${format}.`)),
			MIME[format],
			0.98,
		);
	});
}

export function download(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	link.click();
	URL.revokeObjectURL(url);
}

/**
 * Chrome's clipboard writer only sanitises a short list of image types, and
 * WebP isn't on it. Returns the type that actually landed, so the caller can
 * say when it fell back.
 */
export async function copyImage(
	canvas: HTMLCanvasElement,
	format: CardFormat,
): Promise<CardFormat> {
	const blob = await encode(canvas, format);
	try {
		await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
		return format;
	} catch {
		const png = await encode(canvas, "png");
		await navigator.clipboard.write([new ClipboardItem({ "image/png": png })]);
		return "png";
	}
}
