import type { Metadata } from "next";
import { Deck } from "./Deck";

export const metadata: Metadata = {
	title: "Presentation",
	robots: { index: false, follow: false },
};

export default function PresentPage() {
	return <Deck />;
}
