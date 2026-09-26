import type { ReactNode } from "react";

export type Lang = "tsx" | "bash" | "json";

// A tokeniser, not a parser: the only snippets it sees are the ones on this
// page, which is a small enough grammar to be worth not shipping a highlighter.
const CLASS = {
	comment: "text-gray-500",
	keyword: "text-purple-300",
	tag: "text-pink-400",
	name: "text-sky-300",
	string: "text-emerald-300",
	number: "text-amber-300",
	punct: "text-gray-400",
	plain: "text-gray-100",
} as const;

type Kind = keyof typeof CLASS;

interface Token {
	text: string;
	kind: Kind;
}

const KEYWORDS =
	/^(import|from|export|const|let|return|function|useMemo|new|as)$/;

// Order matters: whatever matches first at a position wins, so strings come
// before the punctuation that would otherwise eat their quotes.
const TSX =
	/(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(<\/?)([A-Za-z][\w.-]*)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|([{}()[\].,;:=<>/@|&?!+*-])|(\s+)/g;

// A flag only counts at the start of an argument, so the -fx in a package
// name is left alone.
const BASH = /("(?:[^"\\]|\\.)*"|'[^']*')|(\s)(-{1,2}[\w-]+)/g;

const JSON_RE =
	/("(?:[^"\\]|\\.)*")(\s*:)?|(\btrue\b|\bfalse\b|\bnull\b)|(-?\b\d+(?:\.\d+)?\b)|([{}[\],:])|(\s+)/g;

function push(out: Token[], text: string, kind: Kind) {
	if (!text) return;
	const last = out[out.length - 1];
	if (last && last.kind === kind) last.text += text;
	else out.push({ text, kind });
}

function tsx(code: string): Token[] {
	const out: Token[] = [];
	let at = 0;
	for (const m of code.matchAll(TSX)) {
		push(out, code.slice(at, m.index), "plain");
		at = m.index + m[0].length;
		const [, comment, str, bracket, tagName, num, word, punct, space] = m;
		if (comment !== undefined) push(out, comment, "comment");
		else if (str !== undefined) push(out, str, "string");
		else if (bracket !== undefined) {
			push(out, bracket, "punct");
			push(out, tagName, "tag");
		} else if (num !== undefined) push(out, num, "number");
		else if (word !== undefined) {
			const next = code.slice(at).match(/^\s*([({:=])/);
			const kind: Kind = KEYWORDS.test(word)
				? "keyword"
				: next
					? "name"
					: "plain";
			push(out, word, kind);
		} else if (punct !== undefined) push(out, punct, "punct");
		else push(out, space, "plain");
	}
	push(out, code.slice(at), "plain");
	return out;
}

function bash(code: string): Token[] {
	const out: Token[] = [];
	code.split("\n").forEach((line, index) => {
		if (index) push(out, "\n", "plain");
		if (/^\s*#/.test(line)) {
			push(out, line, "comment");
			return;
		}
		const head = /^(\s*)([\w@./-]+)/.exec(line);
		if (!head) {
			push(out, line, "plain");
			return;
		}
		push(out, head[1], "plain");
		push(out, head[2], "name");
		let at = head[0].length;
		for (const m of line.slice(at).matchAll(BASH)) {
			push(out, line.slice(at, at + m.index), "plain");
			at += m.index + m[0].length;
			const [, str, space, flag] = m;
			if (str !== undefined) push(out, str, "string");
			else {
				push(out, space, "plain");
				push(out, flag, "number");
			}
		}
		push(out, line.slice(at), "plain");
	});
	return out;
}

function json(code: string): Token[] {
	const out: Token[] = [];
	let at = 0;
	for (const m of code.matchAll(JSON_RE)) {
		push(out, code.slice(at, m.index), "plain");
		at = m.index + m[0].length;
		const [, str, colon, literal, num, punct, space] = m;
		if (str !== undefined) {
			push(out, str, colon ? "name" : "string");
			if (colon) push(out, colon, "punct");
		} else if (literal !== undefined) push(out, literal, "keyword");
		else if (num !== undefined) push(out, num, "number");
		else if (punct !== undefined) push(out, punct, "punct");
		else push(out, space, "plain");
	}
	push(out, code.slice(at), "plain");
	return out;
}

export function tokenize(code: string, lang: Lang): Token[] {
	if (lang === "bash") return bash(code);
	if (lang === "json") return json(code);
	return tsx(code);
}

export function Highlighted({
	code,
	lang,
}: {
	code: string;
	lang: Lang;
}): ReactNode {
	let at = 0;
	return tokenize(code, lang).map((token) => {
		const key = `${at}:${token.kind}`;
		at += token.text.length;
		return (
			<span key={key} className={CLASS[token.kind]}>
				{token.text}
			</span>
		);
	});
}
