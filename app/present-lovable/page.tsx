import type { Metadata } from "next";
import { Deck } from "../present/Deck";
import { SECTIONS, SLIDES } from "./slides";

export const metadata: Metadata = {
	title: "Presentation",
	robots: { index: false, follow: false },
};

export default function PresentLovablePage() {
	return <Deck slides={SLIDES} sections={SECTIONS} path="/present-lovable" />;
}
