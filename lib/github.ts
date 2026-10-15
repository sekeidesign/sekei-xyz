export interface ContributionDay {
	date: string;
	contributionCount: number;
	level: number;
}

export interface ContributionWeek {
	contributionDays: ContributionDay[];
}

// The GraphQL API drops private and org contributions the token can't see;
// the public profile calendar includes them as anonymous counts.
export async function getContributions(
	username: string,
): Promise<ContributionWeek[]> {
	try {
		const res = await fetch(
			`https://github.com/users/${username}/contributions`,
			{ next: { revalidate: 3600 } },
		);
		if (!res.ok) return [];

		return parseContributions(await res.text());
	} catch {
		return [];
	}
}

const getAttr = (tag: string, name: string) =>
	tag.match(new RegExp(`${name}="([^"]*)"`))?.[1];

export function parseContributions(html: string): ContributionWeek[] {
	const counts = new Map<string, number>();
	for (const [, id, text] of html.matchAll(
		/<tool-tip[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g,
	)) {
		const count = text.match(/^\s*([\d,]+)\s+contribution/);
		counts.set(id, count ? Number(count[1].replace(/,/g, "")) : 0);
	}

	const days: ContributionDay[] = [];
	for (const [tag] of html.matchAll(/<td\b[^>]*ContributionCalendar-day[^>]*>/g)) {
		const date = getAttr(tag, "data-date");
		if (!date) continue;
		const id = getAttr(tag, "id");
		days.push({
			date,
			contributionCount: (id && counts.get(id)) || 0,
			level: Number(getAttr(tag, "data-level") ?? 0),
		});
	}

	days.sort((a, b) => a.date.localeCompare(b.date));
	const weeks: ContributionWeek[] = [];
	for (const day of days) {
		const isSunday = new Date(`${day.date}T00:00:00Z`).getUTCDay() === 0;
		if (isSunday || weeks.length === 0) weeks.push({ contributionDays: [] });
		weeks[weeks.length - 1].contributionDays.push(day);
	}

	return weeks;
}
