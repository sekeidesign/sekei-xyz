import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { HTML_ROUTES, isHtmlRoute, prefersMarkdown } from "@/lib/negotiation";

test("prefersMarkdown follows the Accept header", () => {
	assert.equal(prefersMarkdown("text/markdown"), true);
	assert.equal(prefersMarkdown("text/markdown, text/html"), true);
	assert.equal(prefersMarkdown("text/html;q=0.9, text/markdown"), true);
	assert.equal(prefersMarkdown("text/markdown;q=0.5, text/html"), false);
	assert.equal(prefersMarkdown("text/markdown;q=0"), false);
	assert.equal(
		prefersMarkdown("text/html,application/xhtml+xml,*/*;q=0.8"),
		false,
	);
	assert.equal(prefersMarkdown("*/*"), false);
	assert.equal(prefersMarkdown(null), false);
});

test("isHtmlRoute matches pages and their dynamic segments only", () => {
	assert.equal(isHtmlRoute("/"), true);
	assert.equal(isHtmlRoute("/p/tato"), true);
	assert.equal(isHtmlRoute("/ui/button"), true);
	assert.equal(isHtmlRoute("/lab/quote/"), true);
	assert.equal(isHtmlRoute("/p"), false);
	assert.equal(isHtmlRoute("/p/tato/extra"), false);
	assert.equal(isHtmlRoute("/__ora-404-probe-rr022pj3"), false);
});

function pageRoutes(dir: string, segments: string[] = []): string[] {
	const routes: string[] = [];
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		if (entry.isFile() && /^page\.(tsx?|jsx?|mdx?)$/.test(entry.name)) {
			routes.push(`/${segments.join("/")}`);
		}
		if (entry.isDirectory() && !entry.name.startsWith("_")) {
			const segment = /^\(.+\)$/.test(entry.name) ? [] : [entry.name];
			routes.push(
				...pageRoutes(path.join(dir, entry.name), [...segments, ...segment]),
			);
		}
	}
	return routes;
}

test("HTML_ROUTES lists every page under app/", () => {
	const routes = pageRoutes(path.join(process.cwd(), "app")).sort();
	assert.deepEqual([...HTML_ROUTES].sort(), routes);
});
