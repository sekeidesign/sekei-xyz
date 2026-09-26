import { SKILL_LIST, SKILLS } from "./content";
import { Code, Inline, P, Section, Table } from "./Prose";
import { Snippet } from "./Snippet";

export function Skills() {
	return (
		<Section title="Agent skills" id="agent-skills">
			<P>
				Two skills, installed together, for an agent working in a project that
				uses shad-fx.
			</P>
			<Snippet code={SKILLS} />
			<Table
				head={["Skill", "Use it to", "Covers"]}
				rows={SKILL_LIST.map((skill) => ({
					key: skill.name,
					cells: [
						<Code key="n">{skill.name}</Code>,
						<Inline key="u" text={skill.use} />,
						<Inline key="c" text={skill.covers} />,
					],
				}))}
			/>
		</Section>
	);
}
