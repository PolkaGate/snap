// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SnapComponent } from "@metamask/snaps-sdk/jsx";

interface Props {
}

export const SoloStakeMoreExtraInfo: SnapComponent<Props> = () => (
  <InfoRow
    text=' Your rewards will increase starting in the next era.'
  />
);