import { A, Code, P, Section, Table } from "./Prose";
import { Snippet } from "./Snippet";

const REPO = "https://github.com/sekeidesign/dither-fx";

const INSTALL = `npx shadcn@latest add @sekei/dither-fx
npx shadcn@latest add @sekei/dither-fx-fire`;

const REGISTRY_CONFIG = `{
  "registries": {
    "@sekei": "https://www.sekei.xyz/registry/{name}.json"
  }
}`;

const ITEMS = [
	{
		key: "dither-fx",
		cells: [
			<Code key="n">dither-fx</Code>,
			"Everything below, plus an index.ts barrel",
		],
	},
	{
		key: "canvas",
		cells: [
			<Code key="n">dither-fx-canvas</Code>,
			"Engine, the reduced-motion hook, utils",
		],
	},
	{ key: "fire", cells: [<Code key="n">dither-fx-fire</Code>, "Canvas"] },
	{ key: "rings", cells: [<Code key="n">dither-fx-rings</Code>, "Canvas"] },
	{ key: "beam", cells: [<Code key="n">dither-fx-beam</Code>, "Canvas"] },
	{ key: "bolt", cells: [<Code key="n">dither-fx-bolt</Code>, "Canvas"] },
	{ key: "fluid", cells: [<Code key="n">dither-fx-fluid</Code>, "Canvas"] },
	{
		key: "engine",
		cells: [
			<Code key="n">dither-fx-engine</Code>,
			"Nothing — painter, seeded RNG, colour helpers",
		],
	},
	{
		key: "hook",
		cells: [<Code key="n">use-prefers-reduced-motion</Code>, "Nothing"],
	},
];

export function Install() {
	return (
		<Section title="Install" id="install">
			<P>Take the whole library, or one effect:</P>
			<Snippet code={INSTALL} />
			<P>
				Nothing to configure. <Code>@sekei</Code> is in the shadcn registry
				directory, so the CLI resolves it and writes the <Code>registries</Code>{" "}
				entry into your components.json itself. To pin it yourself, by hand or in
				package.json — the CLI reads both:
			</P>
			<Snippet code={REGISTRY_CONFIG} lang="json" />
			<P>
				Files land under <Code>components/dither-fx/</Code> and{" "}
				<Code>hooks/</Code>, following your components.json aliases.
			</P>
			<P>
				The <A href={REPO}>repo</A> is a registry on its own terms too, so the
				owner/repo/item form works without touching any config:
			</P>
			<Snippet code="npx shadcn@latest add sekeidesign/dither-fx/dither-fx" />
			<Table head={["Item", "Pulls in"]} rows={ITEMS} />
		</Section>
	);
}
