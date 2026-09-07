export interface QuoteSegment {
	id: string;
	text: string;
	marked: boolean;
}

export interface QuoteLine {
	id: string;
	segments: QuoteSegment[];
}

const MARK = /==([\s\S]+?)==/g;

export function parseQuote(source: string): QuoteLine[] {
	return source
		.split(/\n+/)
		.filter((line) => line.trim().length > 0)
		.map((line, lineIndex) => {
			const segments: QuoteSegment[] = [];
			const push = (text: string, marked: boolean) => {
				if (text) {
					segments.push({ id: `${lineIndex}:${segments.length}`, text, marked });
				}
			};

			let cursor = 0;
			for (const match of line.matchAll(MARK)) {
				push(line.slice(cursor, match.index), false);
				push(match[1], true);
				cursor = match.index + match[0].length;
			}
			push(line.slice(cursor), false);

			return { id: `${lineIndex}`, segments };
		});
}

export interface MarkEdit {
	source: string;
	start: number;
	end: number;
}

/** Wraps the selection in `==`, or peels the marks back off if it already carries them. */
export function toggleMark(
	source: string,
	start: number,
	end: number,
): MarkEdit | null {
	if (start === end) return null;

	const before = source.slice(0, start);
	const selection = source.slice(start, end);
	const after = source.slice(end);

	if (before.endsWith("==") && after.startsWith("==")) {
		return {
			source: before.slice(0, -2) + selection + after.slice(2),
			start: start - 2,
			end: end - 2,
		};
	}

	if (selection.length > 4 && selection.startsWith("==") && selection.endsWith("==")) {
		return {
			source: before + selection.slice(2, -2) + after,
			start,
			end: end - 4,
		};
	}

	return {
		source: `${before}==${selection}==${after}`,
		start: start + 2,
		end: end + 2,
	};
}
