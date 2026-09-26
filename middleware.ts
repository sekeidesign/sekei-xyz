import { type NextRequest, NextResponse } from "next/server";

// Agents that ask for Markdown get the agent guide at the page's own URL.
// Vary keeps a cache from handing one representation to the other client.
export function middleware(request: NextRequest) {
	const wantsMarkdown = request.headers
		.get("accept")
		?.includes("text/markdown");
	const response = wantsMarkdown
		? NextResponse.rewrite(new URL("/shad-fx/agents.md", request.url))
		: NextResponse.next();
	response.headers.append("Vary", "Accept");
	return response;
}

export const config = { matcher: "/shad-fx" };
