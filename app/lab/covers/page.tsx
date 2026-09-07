import { notFound } from "next/navigation";
import { PanelRow } from "@ui-kit/PanelRow";
import { CoverCanvas } from "./CoverCanvas";

export const metadata = {
	title: "Cover canvas",
	robots: { index: false, follow: false },
};

export default function CoverLabPage() {
	// Never on the live site; available locally and on preview deploys.
	if (process.env.VERCEL_ENV === "production") notFound();

	return (
		<PanelRow className="flex flex-col gap-8 md:p-8 p-4">
			<div>
				<h1 className="text-[20px] leading-[1.375] font-[550] text-gray-900">
					Cover canvas
				</h1>
				<p className="text-[15px] leading-[1.625] font-[420] text-gray-500">
					Code-drawn post covers, side by side in the frame they ship in. Add an
					entry to{" "}
					<code className="rounded bg-gray-200/60 px-1 font-mono text-[13px]">
						variants.tsx
					</code>{" "}
					and size it in px — each box crops the cover rather than scaling it.
				</p>
			</div>
			<CoverCanvas />
		</PanelRow>
	);
}
