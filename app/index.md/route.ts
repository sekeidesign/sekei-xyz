import { homeMarkdown } from "@/lib/agent-content";
import { getTimeline } from "@/lib/timeline";

export const dynamic = "force-static";

export function GET() {
	return new Response(homeMarkdown(getTimeline()), {
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
			Vary: "Accept",
		},
	});
}
