import { siteUrl } from "@/lib/site";
import {
	EFFECTS,
	INSTALL,
	ITEMS,
	PROPS,
	REGISTRY_CONFIG,
	REPO,
	SKILL_LIST,
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

The first installs everything; the second, the dither renderer and one effect.
An effect alone has nothing to draw on, so always install a renderer with it.
Nothing to configure: the CLI resolves \`@sekei\` and writes the
\`registries\` entry into \`components.json\` itself. To pin it by hand:

${code("json", REGISTRY_CONFIG)}

If the namespace fails to resolve, prefix any item with \`sekeidesign/shad-fx/\`
to read the GitHub repo directly. Files land under \`components/shad-fx/\` and
\`hooks/\`, following the project's aliases. With the full library, import from
\`@/components/shad-fx\`; otherwise import \`DitherCanvas\` from
\`@/components/shad-fx/dither\` and each effect from
\`@/components/shad-fx/effects/<name>\`.

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
3. **The effect comes from \`useFx\`.** Pass options to it as plain props,
   state and inline arrays included: a change applies in place without
   restarting the simulation, and a removed option goes back to its default.
   Do not wrap anything in \`useMemo\`, and never pass \`fire()\` to the
   canvas. A different factory (\`useFx(on ? fire : rain)\`) starts fresh.
4. **The component that calls \`useFx\` is a client component.** An effect
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

Every effect is a factory returning an \`FxEffect\`, passed to \`useFx\`, and
every option is optional and can change at any time. The same effect runs on any renderer. \`RgbInput\` is a hex string or
an \`[r, g, b]\` tuple; CSS variables do not work, because the renderer writes
raw bytes. Where a count is given at
full intensity, it scales down as the effect eases out.

\`origin\` and \`target\` take an \`Anchor\`: an \`[x, y]\` pair in 0–1 of the box.
For a value that changes every frame, such as a position following the
pointer, call \`fx.set({ origin })\` from the handler instead of passing it
through \`useFx\`, so pointer moves do not re-render. A value set this way holds
until the same option passed to \`useFx\` changes, so do not pass it to both.

${effects.join("\n\n")}

## Reduced motion

Handled. Under \`prefers-reduced-motion: reduce\` each effect paints one settled
frame and the frame loop parks. Do not gate the canvas on it yourself.

## Cost

The engine runs \`requestAnimationFrame\` only while something is changing and
parks once the effect settles, so an inactive effect costs nothing. A canvas
scrolled off screen pauses too and resumes where it left off as it comes back,
so do not unmount it or toggle \`active\` on scroll to save work. Each frame
is one \`putImageData\` over a grid capped at 640×400 cells. Use \`cell={1}\` on
small elements and \`3\` or \`4\` on a full-bleed hero.

## Agent skills

${code("bash", SKILLS)}

Install them when the project will keep working with shad-fx.

${SKILL_LIST.map((skill) => `- \`${skill.name}\`: ${skill.use} Covers ${skill.covers.charAt(0).toLowerCase()}${skill.covers.slice(1)}`).join("\n")}
`;
}
