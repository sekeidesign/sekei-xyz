"use client";

import { ActionIcon } from "@ui-kit/icons/ActionIcon";
import { ArrowIcon } from "@ui-kit/icons/ArrowIcon";
import { BackIcon } from "@ui-kit/icons/BackIcon";
import { CameraIcon } from "@ui-kit/icons/CameraIcon";
import { ChainLinkIcon } from "@ui-kit/icons/ChainLinkIcon";
import { ChevronDownIcon } from "@ui-kit/icons/ChevronDownIcon";
import { CheckCircleIcon } from "@ui-kit/icons/CheckCircleIcon";
import { CopyIcon } from "@ui-kit/icons/CopyIcon";
import { DecisionIcon } from "@ui-kit/icons/DecisionIcon";
import { FireIcon } from "@ui-kit/icons/FireIcon";
import { GithubIcon } from "@ui-kit/icons/GithubIcon";
import { IssueIcon } from "@ui-kit/icons/IssueIcon";
import {
	AppLaunchKindIcon,
	BookKindIcon,
	CodeIcon,
	ExperimentKindIcon,
	WorkKindIcon,
	WritingKindIcon,
} from "@ui-kit/icons/KindIcons";
import { LampIcon } from "@ui-kit/icons/LampIcon";
import { PlayIcon } from "@ui-kit/icons/PlayIcon";
import { PullRequestIcon } from "@ui-kit/icons/PullRequestIcon";
import { RainIcon } from "@ui-kit/icons/RainIcon";
import { ResetIcon } from "@ui-kit/icons/ResetIcon";
import { RiskIcon } from "@ui-kit/icons/RiskIcon";
import { StarIcon } from "@ui-kit/icons/StarIcon";
import { TatoMark } from "@ui-kit/icons/TatoMark";
import {
	ClaudeMark,
	FigmaMark,
	MotionMark,
	PaperMark,
	SwiftMark,
	TailwindMark,
} from "@ui-kit/icons/ToolMarks";
import { TooltipTrigger } from "@ui-kit/Tooltip";

const GLYPHS: [string, React.ReactNode][] = [
	["Action", <ActionIcon key="a" />],
	["Arrow", <ArrowIcon key="b" rotate={45} />],
	["Back", <BackIcon key="c" />],
	["Camera", <CameraIcon key="d" />],
	["ChainLink", <ChainLinkIcon key="e" />],
	["CheckCircle", <CheckCircleIcon key="f" />],
	["ChevronDown", <ChevronDownIcon key="f2" />],
	["Copy", <CopyIcon key="g" />],
	["Decision", <DecisionIcon key="h" />],
	["Fire", <FireIcon key="i" />],
	["Fire filled", <FireIcon key="j" filled />],
	["Github", <GithubIcon key="k" />],
	["Issue", <IssueIcon key="l" />],
	["Lamp", <LampIcon key="m" />],
	["Play", <PlayIcon key="n" />],
	["PullRequest", <PullRequestIcon key="o" className="size-4" />],
	["Rain", <RainIcon key="p" />],
	["Reset", <ResetIcon key="q" />],
	["Risk", <RiskIcon key="r" />],
	["Star", <StarIcon key="s" size={16} />],
];

function IconCell({ name, children }: { name: string; children: React.ReactNode }) {
	return (
		<TooltipTrigger
			payload={name}
			render={<div />}
			className="flex aspect-square items-center justify-center bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900"
		>
			{children}
			<span className="sr-only">{name}</span>
		</TooltipTrigger>
	);
}

export function IconGrid() {
	return (
		<div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-px bg-gray-100">
			{GLYPHS.map(([name, icon]) => (
				<IconCell key={name} name={name}>
					{icon}
				</IconCell>
			))}
		</div>
	);
}

const KINDS = [
	["Writing", WritingKindIcon],
	["Book", BookKindIcon],
	["Work", WorkKindIcon],
	["AppLaunch", AppLaunchKindIcon],
	["Experiment", ExperimentKindIcon],
	["Code", CodeIcon],
] as const;

export function KindIconGrid() {
	return (
		<div className="grid grid-cols-6 gap-px bg-gray-100">
			{KINDS.map(([name, Icon]) => (
				<div key={name} className="flex flex-col items-center gap-3 bg-white py-5">
					<div className="flex gap-3 text-gray-600">
						<Icon />
						<Icon filled />
					</div>
					<span className="font-mono text-[11px] text-gray-400">{name}</span>
				</div>
			))}
		</div>
	);
}

export function MarkGrid() {
	return (
		<div className="flex flex-wrap items-center justify-center gap-8 text-gray-400">
			<FigmaMark />
			<ClaudeMark />
			<PaperMark />
			<MotionMark />
			<TailwindMark />
			<SwiftMark />
			<TatoMark className="h-5 w-auto" />
		</div>
	);
}

export function IconThumb() {
	return (
		<div className="grid grid-cols-4 gap-4 text-gray-600">
			{GLYPHS.slice(0, 8).map(([name, icon]) => (
				<span key={name}>{icon}</span>
			))}
		</div>
	);
}
