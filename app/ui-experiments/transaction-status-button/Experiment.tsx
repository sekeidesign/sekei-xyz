"use client";

import { Experiment } from "@ui-kit/Experiment";
import { TextLink } from "@ui-kit/TextLink";
import { FamilyStatusButton } from "@/content/transaction-status-button/FamilyStatusButton";

export function TransactionStatusButtonExperiment() {
	return (
		<Experiment sourceUrl="https://github.com/sekeidesign/sekei-xyz/blob/main/app/ui-experiments/family-status-button.tsx">
			<Experiment.Title pageUrl="/ui-experiments/transaction-status-button">
				Transaction status button
			</Experiment.Title>
			<Experiment.Tags>
				<Experiment.Tag>motion</Experiment.Tag>
				<Experiment.Tag>layout</Experiment.Tag>
				<Experiment.Tag>tailwind</Experiment.Tag>
				<Experiment.Tag>react</Experiment.Tag>
			</Experiment.Tags>
			<Experiment.Example>
				<FamilyStatusButton />
			</Experiment.Example>
			<Experiment.Description>
				<p>
					Based on{" "}
					<TextLink href="https://family.co/" target="_blank" hasFavicon>
						Family
					</TextLink>{" "}
					by{" "}
					<TextLink
						href="https://benji.org/family-values"
						target="_blank"
						hasFavicon
					>
						Benji Taylor
					</TextLink>
				</p>
				<p>
					In my first attempt the text had a &quot;jelly&quot; effect,
					particularly when animating between the &quot;Analyzing&quot; and
					&quot;Success&quot; states. <br />
					Thankfully I had recently read about{" "}
					<TextLink
						href="https://www.nan.fyi/magic-motion"
						target="_blank"
						hasFavicon
					>
						how Motion&apos;s &quot;magic&quot; layout property works
					</TextLink>
					, which made it clear that this was caused by the text trying to
					transform from one string to the next. <br />
					The fix was simply to add a unique key to the text for each state, which
					ensures only the button magically transforms between states, while the
					label simply translates on the x axis and fades in and out.
				</p>
			</Experiment.Description>
		</Experiment>
	);
}
