import { statSync } from "node:fs";
import { pathToFileURL } from "node:url";

// Node strips the types but knows nothing of tsconfig paths or the bundler's
// extensionless imports, so tests resolve both the way Next does.
const root = pathToFileURL(`${process.cwd()}/`);
const ALIASES = { "@/": "./", "@ui-kit/": "./app/ui-kit/" };
const EXTENSIONS = ["", ".ts", ".tsx", "/index.ts"];

const isFile = (url) => statSync(url, { throwIfNoEntry: false })?.isFile();

export async function resolve(specifier, context, nextResolve) {
	for (const [alias, target] of Object.entries(ALIASES)) {
		if (specifier.startsWith(alias)) {
			specifier = new URL(target + specifier.slice(alias.length), root).href;
		}
	}
	if (specifier.startsWith(".") || specifier.startsWith("file:")) {
		const base = new URL(specifier, context.parentURL).href;
		const match = EXTENSIONS.map((ext) => new URL(base + ext)).find(isFile);
		if (match) return nextResolve(match.href, context);
	}
	try {
		return await nextResolve(specifier, context);
	} catch (error) {
		// Packages without an exports map, like next/server, need the extension.
		if (error?.code !== "ERR_MODULE_NOT_FOUND" || specifier.endsWith(".js")) {
			throw error;
		}
		return nextResolve(`${specifier}.js`, context);
	}
}
