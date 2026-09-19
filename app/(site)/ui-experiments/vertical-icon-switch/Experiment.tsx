"use client";

import { Experiment } from "@ui-kit/Experiment";
import { TextLink } from "@ui-kit/TextLink";
import { VerticalIconSwitch } from "@/content/vertical-icon-switch/VerticalIconSwitch";

export function VerticalIconSwitchExperiment() {
	return (
		<Experiment sourceUrl="https://github.com/sekeidesign/sekei-xyz/blob/main/app/ui-experiments/VerticalIconSwitch.tsx">
			<Experiment.Title pageUrl="/ui-experiments/vertical-icon-switch">
				Vertical icon switch
			</Experiment.Title>
			<Experiment.Tags>
				<Experiment.Tag>motion</Experiment.Tag>
				<Experiment.Tag>clip-path</Experiment.Tag>
				<Experiment.Tag>useTransform</Experiment.Tag>
				<Experiment.Tag>tailwind</Experiment.Tag>
				<Experiment.Tag>react</Experiment.Tag>
			</Experiment.Tags>
			<Experiment.Example>
				<VerticalIconSwitch />
			</Experiment.Example>
			<Experiment.Description>
				<p>
					Based on{" "}
					<TextLink
						href="https://www.threads.com/@ozanoz/post/DDUEYvaCf4M"
						target="_blank"
						hasFavicon
					>
						this Threads post
					</TextLink>
					by{" "}
					<TextLink
						href="https://www.threads.com/@ozanoz"
						target="_blank"
						hasFavicon
					>
						Ozan Öztaskiran.
					</TextLink>
				</p>
				<p>
					The original example was a more typical switch, with a checkmark icon
					that moves up and down based on the selection.
					<br />I left{" "}
					<TextLink
						href="https://www.threads.com/@sekeidesign/post/DDUnuo4xL7v"
						target="_blank"
						hasFavicon
					>
						a comment
					</TextLink>{" "}
					suggesting that the switch use a specific icon for each direction for
					added clarity.
					<br />I also wanted to use this as an opportunity to make use of
					clip-path, which I learned about in one of the earlier modules of Emil
					Kowalski&apos;s{" "}
					<TextLink href="https://animations.dev/" target="_blank" hasFavicon>
						Animations for the Web,
					</TextLink>{" "}
					while also trying to learn to use Motion&apos;s{" "}
					<TextLink
						href="https://motion.dev/docs/react-use-transform"
						target="_blank"
						hasFavicon
					>
						useTransform
					</TextLink>{" "}
					function.
				</p>
				<p>
					Finally, I decided to animate the icons when the state switches, which
					added complexity to the code but also a nice little flair.
				</p>
				<p>
					While I like the final effect, I&apos;m not super happy with all the
					magic numbers I&apos;m using to make the clip-path move smoothly
					between the two states.
				</p>
			</Experiment.Description>
		</Experiment>
	);
}
