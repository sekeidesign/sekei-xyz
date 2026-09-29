"use client";

import { ArrowUpRightIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { useState } from "react";
import { BackLink } from "@ui-kit/BackLink";
import { Button } from "@ui-kit/Button";
import { cn } from "@ui-kit/cn";
import { CheckCircleIcon } from "@ui-kit/icons/CheckCircleIcon";
import { CopyIcon } from "@ui-kit/icons/CopyIcon";
import { GithubIcon } from "@ui-kit/icons/GithubIcon";
import { ResetIcon } from "@ui-kit/icons/ResetIcon";
import { CodeLink } from "@ui-kit/post/PostCodeLink";
import {
	ICON_PRESS,
	ICON_SWAP,
	ICON_SWAP_IN,
	ICON_SWAP_OUT,
} from "@ui-kit/press";

function Outbound({ label = "Download" }: { label?: string }) {
	return (
		<Button
			variant="primary"
			render={
				<Link href="https://www.sekei.design" target="_blank" rel="noopener noreferrer" />
			}
			className="group pl-2.5"
		>
			{label}
			<ArrowUpRightIcon className={`size-3.5 ${ICON_PRESS}`} />
		</Button>
	);
}

export function ButtonOverview() {
	return (
		<div className="flex flex-wrap items-center justify-center gap-2">
			<Button className="group">
				<CopyIcon className={ICON_PRESS} />
				Copy link
			</Button>
			<Outbound />
			<CodeLink href="https://github.com/sekeidesign/sekei-xyz" />
		</div>
	);
}

export function ButtonDefault() {
	return (
		<div className="flex flex-wrap items-center gap-2">
			<Button className="group">
				<CopyIcon className={ICON_PRESS} />
				Copy link
			</Button>
			<Button className="pl-2.5">No icon</Button>
		</div>
	);
}

export function ButtonPrimary() {
	return (
		<div className="flex flex-wrap items-center gap-2">
			<Outbound />
			<Outbound label="Visit site" />
		</div>
	);
}

export function ButtonIconOnly() {
	return (
		<div className="flex items-center gap-2">
			<Button iconOnly aria-label="Copy" className="group">
				<CopyIcon className={ICON_PRESS} />
			</Button>
			<Button iconOnly aria-label="Reset">
				<ResetIcon />
			</Button>
			<CodeLink href="https://github.com/sekeidesign/sekei-xyz" />
		</div>
	);
}

export function ButtonAsLink() {
	return (
		<div className="flex items-center gap-2">
			<Button
				render={
					<Link
						href="https://github.com/sekeidesign"
						target="_blank"
						rel="noopener noreferrer"
					/>
				}
			>
				<GithubIcon />
				GitHub
			</Button>
			<BackLink />
			<BackLink iconOnly />
		</div>
	);
}

export function ButtonIconSwap() {
	const [done, setDone] = useState(false);

	return (
		<Button onClick={() => setDone((value) => !value)} className="group">
			<span className="relative size-4">
				<span
					className={cn(
						"absolute inset-0",
						ICON_SWAP,
						done ? ICON_SWAP_OUT : ICON_SWAP_IN,
					)}
				>
					<CopyIcon className={ICON_PRESS} />
				</span>
				<span
					className={cn(
						"absolute inset-0",
						ICON_SWAP,
						done ? ICON_SWAP_IN : ICON_SWAP_OUT,
					)}
				>
					<CheckCircleIcon className={ICON_PRESS} />
				</span>
			</span>
			{done ? "Copied" : "Copy"}
		</Button>
	);
}
