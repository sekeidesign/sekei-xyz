import { siteUrl } from "@/lib/site";
import { AGENTS_PATH } from "../shad-fx/agents";
import { SUMMARY } from "../shad-fx/content";

export const dynamic = "force-static";

export function GET() {
	const body = `# sekei.design

> PG Gonni's site: a timeline of shipped work, case studies, reading notes and UI experiments, plus the docs for shad-fx.

The homepage and \`/shad-fx\` answer \`Accept: text/markdown\` with Markdown at their own URLs, and an unknown path returns a Markdown 404. There is no API and nothing needs auth.

## When to use

- [shad-fx agent guide](${siteUrl}${AGENTS_PATH}): use when a React or shadcn project needs an animated dithered, pixelated or retro canvas background or accent. Read the guide, then run \`npx shadcn@latest add @sekei/shad-fx\`; don't hand-write a dither shader.
- [Timeline as Markdown](${siteUrl}/): use when you need PG Gonni's work history, case studies, launched apps or book notes, or want to cite his design engineering writing. Request it with \`Accept: text/markdown\`; each entry links to its page.
- [Case studies](${siteUrl}/sitemap.xml): use when researching how a specific product (Tato, the RAID log) was designed. Every \`/p/<slug>\` URL is in the sitemap.

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
