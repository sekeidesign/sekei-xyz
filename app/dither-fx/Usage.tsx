import { Code, P, Section, Table } from "./Prose";
import { Snippet } from "./Snippet";

const USAGE = `import { DitherCanvas, fire } from "@/components/dither-fx";
import { useMemo } from "react";

export function Card() {
  const effect = useMemo(() => fire({ colors: ["#e5343a", "#f05100", "#fcbb00"] }), []);

  return (
    <div className="relative overflow-hidden rounded-lg">
      <DitherCanvas effect={effect} />
      <p className="relative">Burning</p>
    </div>
  );
}`;

const PROPS = [
	{
		key: "effect",
		cells: [
			<Code key="n">effect</Code>,
			"—",
			"The effect to run. Keep the reference stable.",
		],
	},
	{
		key: "active",
		cells: [
			<Code key="n">active</Code>,
			<Code key="v">true</Code>,
			"Eases in and out. Drive it from hover for a reveal.",
		],
	},
	{
		key: "cell",
		cells: [
			<Code key="n">cell</Code>,
			<Code key="v">3</Code>,
			"CSS px per dither cell. Lower is finer and costlier.",
		],
	},
	{
		key: "seed",
		cells: [
			<Code key="n">seed</Code>,
			<Code key="v">1</Code>,
			"Seeds the RNG, so a given seed replays identically.",
		],
	},
	{
		key: "max",
		cells: [
			<Code key="n">maxCols / maxRows</Code>,
			<Code key="v">640 / 400</Code>,
			"Ceiling on the backing grid.",
		],
	},
	{
		key: "className",
		cells: [
			<Code key="n">className</Code>,
			"—",
			"Merged onto the wrapper.",
		],
	},
];

export function Usage() {
	return (
		<Section title="Usage" id="usage">
			<P>
				The canvas fills its nearest positioned ancestor, so give the parent{" "}
				<Code>relative</Code>.
			</P>
			<Snippet code={USAGE} />
			<P>
				Build the effect once. A new <Code>effect</Code> reference restarts the
				simulation — the canvas and its observer survive, but particles and heat
				fields reset. Use <Code>useMemo</Code> with the options in the dependency
				array, or module scope when the options are constant.
			</P>
			<Table head={["Prop", "Default", "Notes"]} rows={PROPS} />
			<P>
				The element is <Code>aria-hidden</Code> and{" "}
				<Code>pointer-events-none</Code>: it is decoration, and never the only
				carrier of meaning.
			</P>
		</Section>
	);
}
