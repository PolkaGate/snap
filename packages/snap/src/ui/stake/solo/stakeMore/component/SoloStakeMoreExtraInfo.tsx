// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SnapComponent } from "@metamask/snaps-sdk/jsx";
import { InfoRow } from "../../../components/InfoRow";

interface Props {
}

export const SoloStakeMoreExtraInfo: SnapComponent<Props> = () => (
  <InfoRow
    text=' Your rewards will increase starting in the next era.'
  />
);