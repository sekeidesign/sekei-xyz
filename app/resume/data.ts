export interface Role {
	company: string;
	title: string;
	dates: string;
	logo?: string;
	summary?: string;
	points?: string[];
}

export const ROLES: Role[] = [
	{
		company: "Tato",
		title: "Founding Product Design Engineer",
		dates: "Sep 2025 - Present",
		logo: "/logos/tato.webp",
		summary:
			"I own the product end to end: scoping the work, thinking through the flows, and writing the code that ships it.",
		points: [
			"Design and build in one loop. Figma or Paper, then a prototype, then production React and Tailwind",
			"Build and maintain the design system in Next.js, Tailwind, Motion and Base UI",
			"Set priorities and strategy, and keep everyone clear on what we ship and why",
			"Own quality after launch. Measure it, then take what we learn into the next round",
		],
	},
	{
		company: "Planned",
		title: "Head of Product Design",
		dates: "Mar 2024 - Sep 2025",
		logo: "/logos/planned.webp",
		summary:
			"Joined an AI-native product and revamped its design language end to end.",
		points: [
			"Rebuilt UX and UI across the product, and the design system behind it in Figma and React",
			"Layered tokens from primitive to semantic so Figma and React stayed in step",
			"Prototyped interactions in code to work out new AI patterns before they were built",
			"Managed a team of two designers, taking the company from Series A to B",
		],
	},
	{
		company: "Metafy",
		title: "Design Engineer",
		dates: "Feb 2023 - Feb 2024",
		logo: "/logos/metafy.webp",
		summary: "Designed experiences from the first sketch to the shipped code.",
		points: [
			"Created and maintained the design system in Figma and in our SvelteKit app",
			"Designed and built the product's interactions, and the marketing pages, myself",
		],
	},
	{
		company: "Metalab",
		title: "Product Designer",
		dates: "Oct 2021 - Jan 2023",
		logo: "/logos/metalab.webp",
		summary:
			"Client work across industries and company sizes, from scoping to launch.",
		points: [
			"Ran workshops, design reviews and research with client teams",
			"Bridged design and engineering so client teams got implementation-ready designs",
			"Built design systems that design and engineering teams shared",
		],
	},
];

export const EARLIER: Role[] = [
	{
		company: "Memorisely",
		title: "Instructor & Content Creator",
		dates: "Dec 2021 - Dec 2022",
	},
	{
		company: "Field Effect",
		title: "Product Designer",
		dates: "Jan 2021 - Sep 2021",
		logo: "/logos/field-effect.webp",
	},
	{
		company: "Samuel Associates",
		title: "Digital Designer",
		dates: "Jan 2020 - Dec 2020",
	},
	{
		company: "Roboroots",
		title: "Lead Marketing & Web Designer",
		dates: "Sep 2019 - Jan 2020",
	},
	{
		company: "Golden Hour Media",
		title: "Web Developer & UX Designer",
		dates: "Oct 2017 - Aug 2021",
	},
];

export const TOOLS = [
	"React",
	"TypeScript",
	"Next.js",
	"Tailwind",
	"Motion",
	"SwiftUI",
	"Figma",
	"Paper",
];
