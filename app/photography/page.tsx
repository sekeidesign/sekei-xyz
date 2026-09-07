import type { Metadata } from "next";
import { Experiment } from "../ui-kit/Experiment";
import { PhotographyGrid } from "./PhotographyGrid";

export const metadata: Metadata = {
	title: "Photography",
	description: "Concert & festival photography, Montréal, QC.",
};

export default function PhotographyPage() {
	return (
		<Experiment className="p-0 md:p-0 gap-px bg-gray-200! flex flex-col xl:max-w-3xl">
			<div className="panel p-4 md:p-6">
				<h1 className="font-[550] text-gray-800 w-full">Photography</h1>
				<p className="font-[450] text-gray-500 w-full">
					Concert &amp; festival photography, Montréal, QC — film &amp; digital
				</p>
			</div>
			<PhotographyGrid />
		</Experiment>
	);
}
