import { PROPS, SKILLS, USAGE } from "./content";
import { A, Code, P, Section, Table } from "./Prose";
import { Snippet } from "./Snippet";

export function Usage() {
	return (
		<Section title="Usage" id="usage">
			<P>
				To have an agent set effects up for you, install the{" "}
				<A href="https://agentskills.io">agent skills</A>. One covers placement,
				the stable-reference rule, anchors and cost; the other writes new
				effects.
			</P>
			<Snippet code={SKILLS} />
			<P>
				The canvas fills its nearest positioned ancestor, so give the parent{" "}
				<Code>relative</Code>.
			</P>
			<Snippet code={USAGE} lang="tsx" />
			<P>
				Build the effect once. A new <Code>effect</Code> reference restarts the
				simulation — the canvas and its observer survive, but particles and heat
				fields reset. Use <Code>useMemo</Code> with the options in the dependency
				array, or module scope when the options are constant.
			</P>
			<Table
				head={["Prop", "Default", "Notes"]}
				rows={PROPS.map((prop) => ({
					key: prop.name,
					cells: [
						<Code key="n">{prop.name}</Code>,
						prop.fallback === "—" ? "—" : <Code key="v">{prop.fallback}</Code>,
						prop.notes,
					],
				}))}
			/>
			<P>
				The element is <Code>aria-hidden</Code> and{" "}
				<Code>pointer-events-none</Code>: it is decoration, and never the only
				carrier of meaning.
			</P>
		</Section>
	);
}
