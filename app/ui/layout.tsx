import type { Metadata } from "next";
import { groupedEntries } from "./registry";
import { SystemNav } from "./SystemNav";

export const metadata: Metadata = {
	title: {
		default: "UI kit",
		template: "%s | UI kit",
	},
	description: "The components behind sekei.xyz.",
	robots: { index: false, follow: false },
};

export default function SystemLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const groups = groupedEntries().map(({ group, entries }) => ({
		group,
		entries: entries.map(({ slug, name }) => ({ slug, name })),
	}));

	return (
		<div className="mx-auto box-border flex min-h-screen w-full flex-col gap-px p-px md:flex-row">
			<SystemNav groups={groups} />
			<div className="panel flex min-w-0 flex-1 flex-col">
				<main id="main" className="mx-auto flex w-full max-w-5xl flex-col p-4 md:p-10">
					{children}
				</main>
			</div>
		</div>
	);
}
