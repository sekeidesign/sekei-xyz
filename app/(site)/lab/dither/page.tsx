import { notFound } from "next/navigation";
import { PanelRow } from "@ui-kit/PanelRow";
import { DitherStudio } from "./DitherStudio";

export const metadata = {
	title: "Dither studio",
	robots: { index: false, follow: false },
};

export default function DitherLabPage() {
	// Never on the live site; available locally and on preview deploys.
	if (process.env.VERCEL_ENV === "production") notFound();

	return (
		<PanelRow className="flex flex-col gap-8 md:p-8 p-4">
			<div>
				<h1 className="text-[20px] leading-[1.375] font-[550] text-gray-900">
					Dither studio
				</h1>
				<p className="text-[15px] leading-[1.625] font-[420] text-gray-500">
					The RAID types figure with its hover effects exposed. Tune here, then
					carry the values into{" "}
					<code className="rounded bg-gray-200/60 px-1 font-mono text-[13px]">
						raid-effects.ts
					</code>{" "}
					as the new defaults.
				</p>
			</div>
			<DitherStudio />
		</PanelRow>
	);
}
