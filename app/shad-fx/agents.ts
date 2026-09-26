import { siteUrl } from "@/lib/site";
import {
	EFFECTS,
	INSTALL,
	ITEMS,
	PROPS,
	REGISTRY_CONFIG,
	REPO,
	SKILLS,
	SUMMARY,
	USAGE,
} from "./content";

export const AGENTS_PATH = "/shad-fx/agents.md";

export const agentsUrl = () => `${siteUrl}${AGENTS_PATH}`;

export const agentPrompt = () =>
	`Read ${agentsUrl()} and follow it to install shad-fx and add a dither effect to this project.`;

// Pipes would end the cell early; defaults like `number | (() => number)` have them.
const cell = (text: string) => text.replaceAll("|", "\\|");

const table = (head: string[], rows: string[][]) =>
	[
		`| ${head.join(" | ")} |`,
		`| ${head.map(() => "---").join(" | ")} |`,
		...rows.map((row) => `| ${row.map(cell).join(" | ")} |`),
	].join("\n");

const code = (lang: string, body: string) => `\`\`\`${lang}\n${body}\n\`\`\``;

export function agentsMarkdown() {
	const effects = EFFECTS.map((effect) =>
		[
			`### ${effect.name}`,
			effect.summary,
			table(
				["Option", "Type", "Default", "Description"],
				effect.options.map((option) => [
					`\`${option.name}\``,
					`\`${option.type}\``,
					`\`${option.fallback}\``,
					option.description,
				]),
			),
		].join("\n\n"),
	);

	return `# shad-fx

${SUMMARY}

This page is the complete guide for AI agents adding shad-fx to a project. The
same content, for people, is at ${siteUrl}/shad-fx.

- Source: ${REPO}
- Registry namespace: \`@sekei\` (listed in the shadcn registry directory)

## When to use it

Reach for shad-fx when a React project wants a pixelated, dithered, retro or
8-bit animated background or accent on a card, hero, button, avatar or section:
flames, lightning, sonar or ripple rings, a spotlight beam, a liquid fill, rain
or snow. It is decoration, not content: the canvas is \`aria-hidden\` and
\`pointer-events-none\`.

It needs React and a shadcn-style project (a \`components.json\`, the \`@/\`
alias and a \`cn\` helper in \`@/lib/utils\`). There is no npm dependency: the
shadcn CLI copies the source into the project.

## Install

${code("bash", INSTALL)}

The first installs everything, the second the dither renderer, the third one
effect. Nothing to configure: the CLI resolves \`@sekei\` and writes the
\`registries\` entry into \`components.json\` itself. To pin it by hand:

${code("json", REGISTRY_CONFIG)}

If the namespace fails to resolve, prefix any item with \`sekeidesign/shad-fx/\`
to read the GitHub repo directly. Files land under \`components/shad-fx/\` and
\`hooks/\`, following the project's aliases.

${table(
	["Item", "Pulls in"],
	ITEMS.map((item) => [`\`${item.name}\``, item.pullsIn]),
)}

## Usage

${code("tsx", USAGE)}

Four rules, each the cause of a common bug:

1. **The parent is positioned and clips.** The canvas is \`absolute inset-0\`
   and fills its nearest positioned ancestor. Give the parent \`relative\` and
   \`overflow-hidden\`.
2. **Content sits above it.** Give text and controls \`relative\` (or a
   \`z-index\`), or a positioned canvas paints over them.
3. **The effect is built once.** A new \`effect\` reference restarts the
   simulation. Use \`useMemo\` with the reactive options as dependencies, or
   module scope when they are constant. Never call \`fire()\` inline in JSX.
4. **The component that builds the effect is a client component.** An effect
   is an object of functions and cannot cross the server/client boundary.

### DitherCanvas props

${table(
	["Prop", "Default", "Notes"],
	PROPS.map((prop) => [
		`\`${prop.name}\``,
		prop.fallback === "—" ? "—" : `\`${prop.fallback}\``,
		prop.notes,
	]),
)}

Drive \`active\` from hover or visibility for a reveal. Do not mount and unmount
the canvas, which throws the simulation away.

## Effects

Every effect is a factory returning a \`DitherEffect\`, and every option is
optional. \`RgbInput\` is a hex string or an \`[r, g, b]\` tuple; CSS variables
do not work, because the painter writes raw bytes. Where a count is given at
full intensity, it scales down as the effect eases out.

\`origin\` and \`target\` take an \`Anchor\`: an \`[x, y]\` pair in 0–1 of the box,
or a getter. \`height\`, \`level\` and \`slant\` take a number or a getter. A
getter is re-read every frame, so an effect can follow a pointer without being
rebuilt. Feed it a ref, not state, so pointer moves do not re-render.

${effects.join("\n\n")}

## Reduced motion

Handled. Under \`prefers-reduced-motion: reduce\` each effect paints one settled
frame and the frame loop parks. Do not gate the canvas on it yourself.

## Cost

The engine runs \`requestAnimationFrame\` only while something is changing and
parks once the effect settles, so an inactive effect costs nothing. Each frame
is one \`putImageData\` over a grid capped at 640×400 cells. Use \`cell={1}\` on
small elements and \`3\` or \`4\` on a full-bleed hero.

## Agent skills

${code("bash", SKILLS)}

Installs two skills: \`use-shad-fx\` for setting effects up, and
\`create-shad-fx\` for writing a new effect against the \`DitherEffect\`
contract. Install them when the project will keep working with shad-fx.
`;
}
