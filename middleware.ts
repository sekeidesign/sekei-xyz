import { type NextRequest, NextResponse } from "next/server";
import { isHtmlRoute, prefersMarkdown } from "@/lib/negotiation";

const MARKDOWN_ROUTES: Record<string, string> = {
	"/": "/index.md",
	"/shad-fx": "/shad-fx/agents.md",
};

// Agents that ask for Markdown get it at the page's own URL, and a Markdown
// 404 for a path that isn't a page. Vary keeps a cache from handing one
// representation to the other client.
export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	let response = NextResponse.next();

	if (prefersMarkdown(request.headers.get("accept"))) {
		const markdown = MARKDOWN_ROUTES[pathname];
		if (markdown) {
			response = NextResponse.rewrite(new URL(markdown, request.url));
		} else if (!isHtmlRoute(pathname)) {
			const notFound = new URL("/not-found.md", request.url);
			notFound.searchParams.set("path", pathname);
			response = NextResponse.rewrite(notFound);
		}
	}

	response.headers.append("Vary", "Accept");
	return response;
}

// Files (anything with a dot), framework assets, the API and the registry
// rewrite never negotiate.
export const config = {
	matcher: "/((?!_next/|api/|registry/|.*\\.).*)",
};
