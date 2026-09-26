"use client";

import { CollapsableMenuExperiment } from "../ui-experiments/collapsable-menu/Experiment";
import { DynamicIslandExperiment } from "../ui-experiments/dynamic-island/Experiment";
import { ProfileMenuExperiment } from "../ui-experiments/profile-menu/Experiment";
import { TransactionStatusButtonExperiment } from "../ui-experiments/transaction-status-button/Experiment";
import { VerticalIconSwitchExperiment } from "../ui-experiments/vertical-icon-switch/Experiment";
import { ExperimentDivider } from "../../ui-kit/Experiment";
import { Fragment } from "react";

const experiments = [
  ProfileMenuExperiment,
  DynamicIslandExperiment,
  TransactionStatusButtonExperiment,
  CollapsableMenuExperiment,
  VerticalIconSwitchExperiment,
];

export default function Kitchen() {
  return (
    <>
      {experiments.map((experiment) => {
        const ExperimentComponent = experiment;
        return (
          <Fragment key={experiment.name}>
            <ExperimentComponent />
            <ExperimentDivider />
          </Fragment>
        );
      })}
    </>
  );
}
