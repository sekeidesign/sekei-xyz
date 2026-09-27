import type { ComponentType } from "react";
import * as Actions from "./stories/actions";
import * as Content from "./stories/content";
import * as Controls from "./stories/controls";
import * as Icons from "./stories/icons";
import * as Showcase from "./stories/showcase";

export type Surface = "white" | "panel" | "stripes" | "dots";

export interface Example {
	name: string;
	Component: ComponentType;
	surface?: Surface;
	/** Drops the canvas's centring and padding, for a specimen that lays itself out. */
	bleed?: boolean;
}

export interface Entry {
	slug: string;
	name: string;
	group: Group;
	description: string;
	/** Path under app/ui-kit. */
	source?: string;
	exports?: string[];
	examples: Example[];
	/** The overview card's preview, when the first example is too big for it. */
	Thumb?: ComponentType;
	/** Where the entry's artwork comes from, shown under its description. */
	credit?: { lead: string; name: string; href: string };
}

export const GROUPS = ["Basics", "Content", "Controls", "Showcase"] as const;

export type Group = (typeof GROUPS)[number];

/** The index section a group heads, for linking straight to it. */
export const groupAnchor = (group: Group) => group.toLowerCase();

export const REPO_BLOB = "https://github.com/sekeidesign/sekei-xyz/blob/main";

const UNSORTED: Entry[] = [
	{
		slug: "button",
		name: "Button",
		group: "Basics",
		description:
			"One pill in two variants. Renders as anything through Base UI's render prop, so links, back links and the code chip all wear it.",
		source: "Button.tsx",
		exports: ["Button"],
		Thumb: Actions.ButtonOverview,
		examples: [
			{ name: "Default", Component: Actions.ButtonDefault },
			{ name: "Primary", Component: Actions.ButtonPrimary },
			{ name: "Icon only", Component: Actions.ButtonIconOnly },
			{ name: "As a link", Component: Actions.ButtonAsLink },
			{ name: "Icon swap", Component: Actions.ButtonIconSwap },
		],
	},
	{
		slug: "code-block",
		name: "CodeBlock",
		group: "Basics",
		description:
			"Dark code in the nested bezel, with a built-in copy button and a small highlighter for tsx, bash and json.",
		source: "code/CodeBlock.tsx",
		exports: ["CodeBlock"],
		Thumb: Content.CodeThumb,
		examples: [
			{ name: "Shell", Component: Content.CodeInstall },
			{ name: "TSX", Component: Content.CodeTsx },
			{ name: "JSON", Component: Content.CodeJson },
			{ name: "With footer", Component: Content.CodeFooter },
		],
	},
	{
		slug: "icons",
		name: "Icons",
		group: "Basics",
		description: "16px glyphs drawn in currentColor, plus tool marks.",
		source: "icons",
		credit: { lead: "Glyphs from", name: "Iconly Pro", href: "https://iconly.pro" },
		Thumb: Icons.IconThumb,
		examples: [
			{ name: "Glyphs", Component: Icons.IconGrid, bleed: true },
			{ name: "Kind icons", Component: Icons.KindIconGrid, bleed: true },
			{ name: "Marks", Component: Icons.MarkGrid },
		],
	},
	{
		slug: "surface",
		name: "Surface",
		group: "Basics",
		description:
			"The nested bezel: a gray-100 frame holding a white card. Problems, Contributions, media and figures all sit in one.",
		source: "Surface.tsx",
		exports: ["Surface"],
		examples: [
			{ name: "Default", Component: Content.SurfaceDefault },
			{ name: "With header", Component: Content.SurfaceHeader },
		],
	},
	{
		slug: "tooltip",
		name: "Tooltip",
		group: "Content",
		description:
			"One shared popup for every trigger, so moving between controls slides the label rather than remounting it.",
		source: "Tooltip.tsx",
		exports: ["TooltipTrigger"],
		examples: [{ name: "Grouped", Component: Content.Tooltips }],
	},
	{
		slug: "text-link",
		name: "TextLink",
		group: "Content",
		description:
			"Inline link with a hover wash and an Open Graph preview card.",
		source: "TextLink.tsx",
		exports: ["TextLink"],
		examples: [{ name: "In prose", Component: Content.TextLinks }],
	},
	{
		slug: "tags",
		name: "Tags",
		group: "Content",
		description: "Mono chips in a row that fades out at its edges when it overflows.",
		source: "TagRow.tsx",
		exports: ["TagRow"],
		examples: [{ name: "Default", Component: Content.Tags }],
	},
	{
		slug: "avatar",
		name: "Avatar",
		group: "Content",
		description: "The portrait in a white ringed bezel.",
		source: "Avatar.tsx",
		exports: ["Avatar"],
		examples: [{ name: "Sizes", Component: Content.Avatars }],
	},
	{
		slug: "star-rating",
		name: "StarRating",
		group: "Content",
		description: "Five stars, read out as a single image.",
		source: "StarRating.tsx",
		exports: ["StarRating"],
		examples: [{ name: "Ratings", Component: Content.Ratings }],
	},
	{
		slug: "quote",
		name: "Quote",
		group: "Content",
		description: "A pull quote set in Geist Pixel.",
		source: "Quote.tsx",
		exports: ["Quote"],
		Thumb: Content.QuoteThumb,
		examples: [{ name: "With citation", Component: Content.PullQuote }],
	},
	{
		slug: "problems",
		name: "Problems",
		group: "Content",
		description: "A numbered list in a Surface.",
		source: "Problems.tsx",
		exports: ["Problems"],
		Thumb: Content.ProblemsThumb,
		examples: [{ name: "Default", Component: Content.ProblemList }],
	},
	{
		slug: "contributions",
		name: "Contributions",
		group: "Content",
		description: "PR count and line delta, with a GitHub-style split bar.",
		source: "Contributions.tsx",
		exports: ["Contributions"],
		Thumb: Content.ContributionsThumb,
		examples: [
			{ name: "Default", Component: Content.ContributionsDefault },
			{ name: "With note", Component: Content.ContributionsNote },
		],
	},
	{
		slug: "case-study-link",
		name: "CaseStudyLink",
		group: "Content",
		description: "Thumbnail, title and blurb, linking out to a case study.",
		source: "CaseStudyLink.tsx",
		exports: ["CaseStudyLink"],
		Thumb: Content.CaseStudyThumb,
		examples: [
			{ name: "With image", Component: Content.CaseStudyImage },
			{ name: "Placeholder", Component: Content.CaseStudyPlaceholder },
		],
	},
	{
		slug: "next-case-study",
		name: "NextCaseStudy",
		group: "Content",
		description: "The divider and card at the foot of a case study.",
		source: "NextCaseStudy.tsx",
		exports: ["NextCaseStudy"],
		Thumb: Content.NextStudyThumb,
		examples: [{ name: "Default", Component: Content.NextStudy }],
	},
	{
		slug: "framed-icon",
		name: "FramedIcon",
		group: "Content",
		description: "A company or app mark in a tight white frame.",
		source: "post/FramedIcon.tsx",
		exports: ["FramedIcon"],
		examples: [{ name: "Sizes", Component: Content.FramedIcons }],
	},
	{
		slug: "social-bar",
		name: "SocialBar",
		group: "Content",
		description:
			"Reaction and copy-link counts, rolling digit by digit, with a ripple across the dot lattice on press.",
		source: "social/SocialBar.tsx",
		exports: ["SocialBar"],
		examples: [{ name: "Default", Component: Content.Social }],
	},
	{
		slug: "sparkle-divider",
		name: "SparkleDivider",
		group: "Content",
		description: "An ornament between sections, hidden from assistive tech.",
		source: "SparkleDivider.tsx",
		exports: ["SparkleDivider"],
		examples: [{ name: "Default", Component: Content.Divider }],
	},
	{
		slug: "control-panel",
		name: "ControlPanel",
		group: "Controls",
		description:
			"The playground chrome: a titled card of rows, each a label, a control and a readout.",
		source: "controls/ControlPanel.tsx",
		exports: ["ControlPanel", "ControlSection", "ControlRow"],
		Thumb: Controls.PanelThumb,
		examples: [
			{ name: "Every control", Component: Controls.FullPanel },
		],
	},
	{
		slug: "slider",
		name: "Slider",
		group: "Controls",
		description: "A native range input, its fill driven by one CSS variable.",
		source: "controls/Slider.tsx",
		exports: ["Slider"],
		examples: [
			{ name: "Default", Component: Controls.SliderDemo },
			{ name: "With steps", Component: Controls.SliderSteps },
		],
	},
	{
		slug: "toggle",
		name: "Toggle",
		group: "Controls",
		description: "A switch with an on/off readout and optional hint.",
		source: "controls/Toggle.tsx",
		exports: ["Toggle"],
		examples: [{ name: "Default", Component: Controls.ToggleDemo }],
	},
	{
		slug: "select",
		name: "Select",
		group: "Controls",
		description: "A native select, styled as a chip.",
		source: "controls/Select.tsx",
		exports: ["Select"],
		examples: [{ name: "Default", Component: Controls.SelectDemo }],
	},
	{
		slug: "text-field",
		name: "TextField",
		group: "Controls",
		description: "Single-line and multi-line text inputs.",
		source: "controls/TextField.tsx",
		exports: ["TextField", "TextAreaField"],
		examples: [
			{ name: "Text field", Component: Controls.TextFieldDemo },
			{ name: "Text area", Component: Controls.TextAreaDemo },
		],
	},
	{
		slug: "swatches",
		name: "Swatches",
		group: "Controls",
		description: "A row of native color pickers behind ringed chips.",
		source: "controls/Swatches.tsx",
		exports: ["Swatches"],
		examples: [{ name: "Default", Component: Controls.SwatchesDemo }],
	},
	{
		slug: "profile-card",
		name: "ProfileCard",
		group: "Showcase",
		description: "The sidebar's identity card, with a spring tilt and a foil seal.",
		source: "ProfileCard.tsx",
		exports: ["ProfileCard"],
		Thumb: Showcase.ProfileThumb,
		examples: [{ name: "Default", Component: Showcase.Profile }],
	},
	{
		slug: "globe",
		name: "Globe",
		group: "Showcase",
		description: "A cobe globe pinned to a location.",
		source: "Globe.tsx",
		exports: ["Globe"],
		Thumb: Showcase.GlobeThumb,
		examples: [{ name: "Montréal", Component: Showcase.GlobeDemo }],
	},
];

/** Group order, then A→Z within a group, so the nav, the grid and prev/next agree. */
export const ENTRIES = GROUPS.flatMap((group) =>
	UNSORTED.filter((entry) => entry.group === group).sort((a, b) =>
		a.name.localeCompare(b.name),
	),
);

export function getEntry(slug: string) {
	return ENTRIES.find((entry) => entry.slug === slug);
}

export function groupedEntries() {
	return GROUPS.map((group) => ({
		group,
		entries: ENTRIES.filter((entry) => entry.group === group),
	}));
}
