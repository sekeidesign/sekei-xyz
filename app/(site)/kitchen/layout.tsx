import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "PG's UI Kitchen",
	description: "Design Engineer cooking up some UI experiments",
	openGraph: {
		title: "PG's UI Kitchen",
		description: "Design Engineer cooking up some UI experiments",
		images: "/og-image.jpg",
	},
};

export default function KitchenLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return children;
}
