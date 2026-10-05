import assert from "node:assert/strict";
import { test } from "node:test";
import { GET as homeMarkdown } from "@/app/index.md/route";
import { GET as llmsTxt } from "@/app/llms.txt/route";
import { GET as notFoundMarkdown } from "@/app/not-found.md/route";
import { personJsonLd, serializeJsonLd } from "@/lib/agent-content";
import { getTimeline } from "@/lib/timeline";
import { NextRequest } from "next/server";

test("/index.md is the homepage as Markdown", async () => {
	const response = homeMarkdown();
	assert.equal(response.status, 200);
	assert.equal(
		response.headers.get("content-type"),
		"text/markdown; charset=utf-8",
	);
	assert.equal(response.headers.get("vary"), "Accept");

	const body = await response.text();
	assert.match(body, /^# PG Gonni/);
	assert.match(body, /\(https:\/\/[^)]+\/llms\.txt\)/);
	for (const entry of getTimeline()) {
		assert.ok(body.includes(entry.title), `missing ${entry.slug}`);
	}
});

test("/not-found.md is a 404 with a Markdown body that links onward", async () => {
	const response = notFoundMarkdown(
		new NextRequest("https://www.sekei.design/not-found.md?path=/nope"),
	);
	assert.equal(response.status, 404);
	assert.equal(
		response.headers.get("content-type"),
		"text/markdown; charset=utf-8",
	);

	const body = await response.text();
	assert.ok(body.length >= 20);
	assert.match(body, /`\/nope`/);
	assert.match(body, /\(https:\/\/[^)]+\/llms\.txt\)/);
	assert.match(body, /\(https:\/\/[^)]+\/sitemap\.xml\)/);
});

test("llms.txt keeps its format and says when to use the site", async () => {
	const body = await llmsTxt().text();
	const lines = body.split("\n");
	assert.match(lines[0], /^# \S/);
	assert.match(body, /^> \S/m);

	const whenToUse = body.split("## When to use\n")[1]?.split("\n## ")[0];
	assert.ok(whenToUse, "no ## When to use section");
	const items = whenToUse.split("\n").filter((line) => line.startsWith("- "));
	assert.ok(items.length >= 2);
	for (const item of items) {
		assert.match(item, /^- \[[^\]]+\]\(https?:\/\/[^)]+\): use when /);
	}
});

test("the homepage JSON-LD describes a Person", () => {
	const person = personJsonLd();
	assert.equal(person["@context"], "https://schema.org");
	assert.equal(person["@type"], "Person");
	assert.equal(person.name, "PG Gonni");
	assert.ok(person.description.length > 20);
	assert.match(person.url, /^https:\/\//);
	assert.ok(person.sameAs.every((url) => url.startsWith("https://")));
});

test("serializeJsonLd can't close its script tag", () => {
	const json = serializeJsonLd({ name: "</script><script>alert(1)</script>" });
	assert.ok(!json.includes("<"));
	assert.deepEqual(JSON.parse(json), {
		name: "</script><script>alert(1)</script>",
	});
});
