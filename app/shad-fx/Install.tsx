import { A, Code, P, Section, Table } from "./Prose";
import { Snippet } from "./Snippet";

const REPO = "https://github.com/sekeidesign/shad-fx";

const INSTALL = `npx shadcn@latest add @sekei/shad-fx
npx shadcn@latest add @sekei/shad-fx-dither
npx shadcn@latest add @sekei/shad-fx-dither-fire`;

const REGISTRY_CONFIG = `{
  "registries": {
    "@sekei": "https://www.sekei.xyz/registry/{name}.json"
  }
}`;

const ITEMS = [
	{
		key: "shad-fx",
		cells: [
			<Code key="n">shad-fx</Code>,
			"Every renderer, plus an index.ts barrel",
		],
	},
	{
		key: "dither",
		cells: [
			<Code key="n">shad-fx-dither</Code>,
			"The dither canvas and every dither effect",
		],
	},
	{
		key: "canvas",
		cells: [
			<Code key="n">shad-fx-dither-canvas</Code>,
			"Engine, the reduced-motion hook, utils",
		],
	},
	{
		key: "fire",
		cells: [<Code key="n">shad-fx-dither-fire</Code>, "Dither canvas"],
	},
	{
		key: "rings",
		cells: [<Code key="n">shad-fx-dither-rings</Code>, "Dither canvas"],
	},
	{
		key: "beam",
		cells: [<Code key="n">shad-fx-dither-beam</Code>, "Dither canvas"],
	},
	{
		key: "bolt",
		cells: [<Code key="n">shad-fx-dither-bolt</Code>, "Dither canvas"],
	},
	{
		key: "fluid",
		cells: [<Code key="n">shad-fx-dither-fluid</Code>, "Dither canvas"],
	},
	{
		key: "rain",
		cells: [<Code key="n">shad-fx-dither-rain</Code>, "Dither canvas"],
	},
	{
		key: "snow",
		cells: [<Code key="n">shad-fx-dither-snow</Code>, "Dither canvas"],
	},
	{
		key: "engine",
		cells: [
			<Code key="n">shad-fx-dither-engine</Code>,
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
			<P>Take the whole library, one renderer, or one effect:</P>
			<Snippet code={INSTALL} />
			<P>
				Nothing to configure. <Code>@sekei</Code> is in the shadcn registry
				directory, so the CLI resolves it and writes the <Code>registries</Code>{" "}
				entry into your components.json itself. To pin it yourself, by hand or in
				package.json — the CLI reads both:
			</P>
			<Snippet code={REGISTRY_CONFIG} lang="json" />
			<P>
				Files land under <Code>components/shad-fx/</Code> and{" "}
				<Code>hooks/</Code>, following your components.json aliases.
			</P>
			<Table head={["Item", "Pulls in"]} rows={ITEMS} />
			<P>
				If the namespace ever fails to resolve, the CLI can read the{" "}
				<A href={REPO}>repo</A> directly: prefix any item with{" "}
				<Code>sekeidesign/shad-fx/</Code>.
			</P>
		</Section>
	);
}
