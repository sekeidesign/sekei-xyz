import type { ComponentType } from "react";
import type { EntryKind } from "@/lib/timeline";
import {
	AppLaunchKindIcon,
	BookKindIcon,
	ExperimentKindIcon,
	type KindIconProps,
	WorkKindIcon,
	WritingKindIcon,
} from "../icons/KindIcons";

/** Eyebrow label and icon per kind, matching the filter tabs. */
export const KIND_META: Record<
	EntryKind,
	{ label: string; Icon: ComponentType<KindIconProps> }
> = {
	writing: { label: "Essay", Icon: WritingKindIcon },
	book: { label: "Book", Icon: BookKindIcon },
	note: { label: "Work", Icon: WorkKindIcon },
	launch: { label: "Launch", Icon: AppLaunchKindIcon },
	experiment: { label: "Craft", Icon: ExperimentKindIcon },
};
