// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, SnapComponent } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../../util/amountToHuman";
import { InfoRow } from "../../components/InfoRow";

interface Props {
  claimable: string;
  decimal: number;
  token: string;
}

export const PoolStakeMoreExtraInfo: SnapComponent<Props> = ({ claimable, decimal, token }) => (
  <Box>
    <InfoRow
      text='Your rewards will increase starting in the next era.'
    />
    <InfoRow
      text={`Your rewards (${amountToHuman(claimable, decimal, 5)} ${token}) will be claimed and credited to your free balance.`}
    />
  </Box>
);