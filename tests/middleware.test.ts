import assert from "node:assert/strict";
import { test } from "node:test";
import { NextRequest } from "next/server";
import { config, middleware } from "@/middleware";

function run(path: string, accept: string) {
	const request = new NextRequest(`https://www.sekei.design${path}`, {
		headers: { accept },
	});
	const response = middleware(request);
	const rewrite = response.headers.get("x-middleware-rewrite");
	return {
		rewrite: rewrite && new URL(rewrite),
		vary: response.headers.get("vary"),
	};
}

const MARKDOWN = "text/markdown";
const HTML = "text/html,application/xhtml+xml,*/*;q=0.8";

test("Markdown requests to the homepage get the Markdown homepage", () => {
	const { rewrite, vary } = run("/", MARKDOWN);
	assert.equal(rewrite?.pathname, "/index.md");
	assert.equal(vary, "Accept");
});

test("Markdown requests to /shad-fx get the agent guide", () => {
	assert.equal(run("/shad-fx", MARKDOWN).rewrite?.pathname, "/shad-fx/agents.md");
});

test("Markdown requests to an unknown path get the Markdown 404", () => {
	const { rewrite, vary } = run("/__ora-404-probe-rr022pj3", MARKDOWN);
	assert.equal(rewrite?.pathname, "/not-found.md");
	assert.equal(rewrite?.searchParams.get("path"), "/__ora-404-probe-rr022pj3");
	assert.equal(vary, "Accept");
});

test("Markdown requests to other pages fall through to HTML", () => {
	assert.equal(run("/p/tato", MARKDOWN).rewrite, null);
	assert.equal(run("/resume", MARKDOWN).rewrite, null);
});

test("browsers always get HTML, with Vary: Accept", () => {
	for (const path of ["/", "/shad-fx", "/nope"]) {
		const { rewrite, vary } = run(path, HTML);
		assert.equal(rewrite, null);
		assert.equal(vary, "Accept");
	}
});

test("the matcher skips files, assets, the API and the registry", () => {
	const matcher = new RegExp(`^${config.matcher}$`);
	for (const path of ["/", "/shad-fx", "/p/tato", "/__probe"]) {
		assert.match(path, matcher);
	}
	for (const path of [
		"/llms.txt",
		"/sitemap.xml",
		"/shad-fx/agents.md",
		"/_next/static/x.js",
		"/api/og",
		"/registry/shad-fx.json",
	]) {
		assert.doesNotMatch(path, matcher);
	}
});
