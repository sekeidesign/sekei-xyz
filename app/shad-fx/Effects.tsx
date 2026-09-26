import { EFFECTS, type Effect, SKILLS } from "./content";
import { EffectCard } from "./EffectCard";
import { A, Code, Inline, P, Section, Table } from "./Prose";
import { Snippet } from "./Snippet";

const HEAD = ["Option", "Type", "Default", "Description"];
const WIDTHS = ["6rem", "11rem", "10rem", "auto"];

function Options({ effect }: { effect: Effect }) {
	return (
		<div id={effect.name} className="flex scroll-mt-8 flex-col gap-4">
			<EffectCard name={effect.name} summary={effect.summary} />
			<Table
				head={HEAD}
				widths={WIDTHS}
				rows={effect.options.map((option) => ({
					key: option.name,
					cells: [
						<Code className="wrap-break-word whitespace-normal" key="n">{option.name}</Code>,
						<Code className="wrap-break-word whitespace-normal" key="t">{option.type}</Code>,
						<Code className="wrap-break-word whitespace-normal" key="d">{option.fallback}</Code>,
						<Inline key="i" text={option.description} />,
					],
				}))}
			/>
		</div>
	);
}

export function Effects() {
	return (
		<Section title="Effects" id="effects">
			<P>
				To write an effect this set doesn&apos;t cover, have an agent do it
				with the <A href="https://agentskills.io">agent skills</A>. They cover
				the{" "}
				<Code>DitherEffect</Code> contract, the <Code>Painter</Code>, reduced
				motion and parking.
			</P>
			<Snippet code={SKILLS} />
			<P>
				Every effect is a factory returning a <Code>DitherEffect</Code>, and
				every option is optional. <Code>RgbInput</Code> is a hex string or an{" "}
				<Code>[r, g, b]</Code> tuple. Where a count is given at full intensity,
				it scales down as the effect eases out.
			</P>
			<div className="flex flex-col gap-10">
				{EFFECTS.map((effect) => (
					<Options key={effect.name} effect={effect} />
				))}
			</div>
			<P>
				<Code>origin</Code> and <Code>target</Code> take an <Code>Anchor</Code>:
				an <Code>[x, y]</Code> pair in 0–1 of the box, or a getter, which is
				re-read every frame — so an effect can follow something that moves
				without being rebuilt and losing what it has already simulated. Drag the
				dot in the playground above to see it.
			</P>
		</Section>
	);
}
