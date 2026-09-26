import { PanelRow } from "@ui-kit/PanelRow";
import { BackLink } from "@ui-kit/BackLink";

export default function PostLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<PanelRow className="md:px-8 px-3 py-3">
				<BackLink />
			</PanelRow>
			{children}
		</>
	);
}
