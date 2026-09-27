"use client";

import { useEffect } from "react";

/**
 * Marks <html data-keyboard> while the reader is navigating by keyboard, for
 * the controls whose :focus-visible the browser lights on a click too.
 */
export function InputModality() {
	useEffect(() => {
		const root = document.documentElement;
		const onKey = (event: KeyboardEvent) => {
			if (event.metaKey || event.ctrlKey || event.altKey) return;
			root.dataset.keyboard = "";
		};
		const onPointer = () => {
			delete root.dataset.keyboard;
		};
		window.addEventListener("keydown", onKey, true);
		window.addEventListener("pointerdown", onPointer, true);
		return () => {
			window.removeEventListener("keydown", onKey, true);
			window.removeEventListener("pointerdown", onPointer, true);
		};
	}, []);

	return null;
}
