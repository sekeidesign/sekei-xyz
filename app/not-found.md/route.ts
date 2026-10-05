import type { NextRequest } from "next/server";
import { notFoundMarkdown } from "@/lib/agent-content";

export function GET(request: NextRequest) {
	const path = request.nextUrl.searchParams.get("path") ?? request.nextUrl.pathname;
	return new Response(notFoundMarkdown(path), {
		status: 404,
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
			Vary: "Accept",
		},
	});
}
