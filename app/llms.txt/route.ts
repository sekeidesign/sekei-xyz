import { siteUrl } from "@/lib/site";
import { AGENTS_PATH } from "../shad-fx/agents";
import { SUMMARY } from "../shad-fx/content";

export const dynamic = "force-static";

export function GET() {
	const body = `# sekei.xyz

> PG Gonni's site: a timeline of shipped work, case studies, reading notes and UI experiments, plus the docs for shad-fx.

## shad-fx

${SUMMARY}

Use it when a React project wants a pixelated, dithered or retro animated background or accent. Install it with the shadcn CLI: \`npx shadcn@latest add @sekei/shad-fx\`.

- [Agent guide](${siteUrl}${AGENTS_PATH}): install, usage rules, every prop and effect option, in one Markdown file
- [Docs and playground](${siteUrl}/shad-fx)
- [Source](https://github.com/sekeidesign/shad-fx)
`;
	return new Response(body, {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
}
