import { agentsMarkdown } from "../agents";

export const dynamic = "force-static";

export function GET() {
	return new Response(agentsMarkdown(), {
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
			Vary: "Accept",
		},
	});
}
