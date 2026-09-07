import { AboutPanel } from "../AboutPanel";
import { AppsPanel } from "../AppsPanel";
import { GlobePanel } from "../GlobePanel";
import { LibraryPanel } from "../LibraryPanel";
import { Experiment } from "../ui-kit/Experiment";
import { HoverProvider } from "../ui-kit/HoverContext";
import { WipBanner } from "../WipBanner";
import { WorkExperiencePanel } from "../WorkExperiencePanel";

export default function HomeAlt() {
	return (
		<HoverProvider>
			<Experiment className="p-0 md:p-0 gap-px bg-gray-200! flex flex-col xl:max-w-5xl">
				<h1 className="sr-only">PG Gonni — building software in Montréal</h1>
				<WipBanner />
				<div className="flex gap-px bg-gray-200">
					<AboutPanel />
					<GlobePanel />
				</div>
				<WorkExperiencePanel />
				<div className="flex gap-px bg-gray-200">
					<AppsPanel />
					<LibraryPanel />
				</div>
			</Experiment>
		</HoverProvider>
	);
}
