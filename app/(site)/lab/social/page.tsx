import { notFound } from "next/navigation";
import { PanelRow } from "@ui-kit/PanelRow";
import { SocialSandbox } from "./SocialSandbox";

export const metadata = {
	title: "Social bar sandbox",
	robots: { index: false, follow: false },
};

export default function SocialLabPage() {
	// Never on the live site; available locally and on preview deploys.
	if (process.env.VERCEL_ENV === "production") notFound();

	return (
		<PanelRow className="flex flex-col gap-8 md:p-8 p-4">
			<div>
				<h1 className="text-[20px] leading-[1.375] font-[550] text-gray-900">
					Social bar sandbox
				</h1>
				<p className="text-[15px] leading-[1.625] font-[420] text-gray-500">
					Memory transport — clicks never reach Redis and nothing is stored.
					Reload to reset.
				</p>
			</div>
			<SocialSandbox />
		</PanelRow>
	);
}
