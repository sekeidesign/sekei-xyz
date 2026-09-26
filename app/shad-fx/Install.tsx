import { INSTALL, ITEMS, REGISTRY_CONFIG, REPO } from "./content";
import { A, Code, P, Section, Table } from "./Prose";
import { Snippet } from "./Snippet";

export function Install() {
	return (
		<Section title="Install" id="install">
			<P>Take the whole library, or a renderer and the effects you want:</P>
			<Snippet code={INSTALL} />
			<P>
				An effect on its own has nothing to draw on, so always take a renderer
				with it.
			</P>
			<P>
				Nothing to configure. <Code>@sekei</Code> is in the shadcn registry
				directory, so the CLI resolves it and writes the <Code>registries</Code>{" "}
				entry into your components.json itself. To pin it yourself, by hand or in
				package.json — the CLI reads both:
			</P>
			<Snippet code={REGISTRY_CONFIG} lang="json" />
			<P>
				Files land under <Code>components/shad-fx/</Code> and{" "}
				<Code>hooks/</Code>, following your components.json aliases: renderers
				in <Code>dither/</Code>, effects in <Code>effects/</Code>. With the full
				library, import everything from <Code>@/components/shad-fx</Code>. With
				a renderer and a few effects, import from{" "}
				<Code>@/components/shad-fx/dither</Code> and{" "}
				<Code>@/components/shad-fx/effects/&lt;name&gt;</Code>.
			</P>
			<Table
				head={["Item", "Pulls in"]}
				rows={ITEMS.map((item) => ({
					key: item.name,
					cells: [<Code key="n">{item.name}</Code>, item.pullsIn],
				}))}
			/>
			<P>
				If the namespace ever fails to resolve, the CLI can read the{" "}
				<A href={REPO}>repo</A> directly: prefix any item with{" "}
				<Code>sekeidesign/shad-fx/</Code>.
			</P>
		</Section>
	);
}
