import { PROPS, SKILLS, USAGE } from "./content";
import { A, Code, P, Section, Table } from "./Prose";
import { CodeBlock } from "@ui-kit/code/CodeBlock";

export function Usage() {
	return (
		<Section title="Usage" id="usage">
			<P>
				To have an agent set effects up for you, install the{" "}
				<A href="#agent-skills">agent skills</A>. One covers placement,{" "}
				<Code>useFx</Code>, anchors and cost; the other writes new
				effects.
			</P>
			<CodeBlock code={SKILLS} />
			<P>
				The canvas fills its nearest positioned ancestor, so give the parent{" "}
				<Code>relative</Code>.
			</P>
			<CodeBlock code={USAGE} lang="tsx" />
			<P>
				<Code>useFx</Code> builds the effect once and keeps it in step with its
				options. Pass them like any props, inline arrays included: a change
				applies in place, without restarting the simulation, and a removed
				option goes back to its default. Passing a different effect, as in{" "}
				<Code>useFx(on ? fire : rain)</Code>, starts that one fresh.
			</P>
			<P>
				For a value that changes every frame, such as a pointer position, skip
				the re-render and call <Code>fx.set</Code> from the handler. Outside
				React, <Code>createFx(fire, options)</Code> returns the same handle.
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
