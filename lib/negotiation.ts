/**
 * Whether a request's Accept header ranks Markdown at least as high as HTML.
 * Ties go to Markdown: an agent listing both wants the Markdown, and browsers
 * never list it at all.
 */
export function prefersMarkdown(accept: string | null): boolean {
	if (!accept) return false;

	let markdown = 0;
	let html = 0;
	for (const part of accept.split(",")) {
		const [type, ...params] = part.trim().toLowerCase().split(";");
		const q = params
			.map((param) => param.trim().match(/^q=([\d.]+)$/))
			.find(Boolean);
		const weight = q ? Number(q[1]) : 1;
		if (type.trim() === "text/markdown") markdown = Math.max(markdown, weight);
		if (type.trim() === "text/html") html = Math.max(html, weight);
	}
	return markdown > 0 && markdown >= html;
}

/**
 * Every page route under app/, with route groups stripped. Middleware can't
 * see the route table, so this is how it tells a real page from a 404 when it
 * answers an agent in Markdown. negotiation.test.ts fails when a page is added
 * without being listed here.
 */
export const HTML_ROUTES = [
	"/",
	"/kitchen",
	"/lab/covers",
	"/lab/dither",
	"/lab/quote",
	"/lab/social",
	"/p/[slug]",
	"/resume",
	"/shad-fx",
	"/ui",
	"/ui/[slug]",
	"/ui-experiments/collapsable-menu",
	"/ui-experiments/dynamic-island",
	"/ui-experiments/profile-menu",
	"/ui-experiments/transaction-status-button",
	"/ui-experiments/vertical-icon-switch",
];

const HTML_ROUTE_PATTERNS = HTML_ROUTES.map(
	(route) => new RegExp(`^${route.replace(/\[[^\]]+\]/g, "[^/]+")}/?$`),
);

export function isHtmlRoute(pathname: string): boolean {
	return HTML_ROUTE_PATTERNS.some((pattern) => pattern.test(pathname));
}
