"use client";

import { Experiment } from "@ui-kit/Experiment";
import { TextLink } from "@ui-kit/TextLink";
import { ProfileMenu } from "@/content/profile-menu/ProfileMenu";

export function ProfileMenuExperiment() {
	return (
		<Experiment sourceUrl="https://github.com/sekeidesign/">
			<Experiment.Title pageUrl="/ui-experiments/profile-menu">
				Profile menu
			</Experiment.Title>
			<Experiment.Tags>
				<Experiment.Tag>motion</Experiment.Tag>
				<Experiment.Tag>useMeasure</Experiment.Tag>
				<Experiment.Tag>Base UI</Experiment.Tag>
				<Experiment.Tag>tailwind</Experiment.Tag>
				<Experiment.Tag>react</Experiment.Tag>
			</Experiment.Tags>
			<Experiment.Example className="p-0 h-[320px] items-start">
				<ProfileMenu />
			</Experiment.Example>
			<Experiment.Description>
				<p>
					I wanted to improve upon our profile menu at Tato. When I joined, it
					was a standard shadcn/ui dropdown, the one that ships with the sidebar
					component. While the original dropdown did its job, I wanted to build
					something with a bit more flair. Inspired by liquid glass&apos;s
					shifting forms, I wanted to create something that felt fluid and part
					of a single morphin surface.
				</p>
				<p>
					I&apos;ve also been using{" "}
					<TextLink
						href="https://base-ui.com/react/components/popover"
						target="_blank"
						hasFavicon
					>
						Base UI
					</TextLink>{" "}
					more frequently over Radix, and I&apos;ve been loving the interface and
					the DX improvements the creators have made. In particular, I really love
					the{" "}
					<TextLink
						href="https://base-ui.com/react/handbook/composition#render-function"
						target="_blank"
						hasFavicon
					>
						render function
					</TextLink>{" "}
					which provides easy access to properties and state of the component.
				</p>
			</Experiment.Description>
		</Experiment>
	);
}
