import { Gallery } from "./Gallery";
import { Code, P, Section, Table } from "./Prose";

const OPTIONS = [
	{
		key: "fire",
		cells: [<Code key="n">fire</Code>, "colors (cold → hot), height, rate, embers"],
	},
	{
		key: "bolt",
		cells: [
			<Code key="n">bolt</Code>,
			"color, interval as [min, max] seconds, target, rate",
		],
	},
	{
		key: "rings",
		cells: [<Code key="n">rings</Code>, "color, origin, interval, speed, width"],
	},
	{
		key: "fluid",
		cells: [<Code key="n">fluid</Code>, "color, level, slosh, tempo, bubbles"],
	},
	{
		key: "beam",
		cells: [<Code key="n">beam</Code>, "color, origin (x only), spread, motes"],
	},
	{
		key: "rain",
		cells: [<Code key="n">rain</Code>, "color, drops, speed, slant, length"],
	},
	{
		key: "snow",
		cells: [<Code key="n">snow</Code>, "color, flakes, speed, sway, settle"],
	},
];

export function Effects() {
	return (
		<Section title="Effects" id="effects">
			<P>
				Every effect is a factory returning a <Code>DitherEffect</Code>. Colours
				take a hex string or an <Code>[r, g, b]</Code> tuple.
			</P>
			<Gallery />
			<Table head={["Effect", "Options"]} rows={OPTIONS} />
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
