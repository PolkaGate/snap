// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, SnapComponent } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../../../util/amountToHuman";
import { InfoRow } from "../../../components/InfoRow";

interface Props {
  claimable: string;
  decimal: number;
  token: string;
  unbondingDuration: number;
}

export const PoolUnstakeExtraInfo: SnapComponent<Props> = ({ claimable, decimal, token, unbondingDuration }) => (
  <Box>
    <InfoRow
      text={`Unstaking requires a ~${String(unbondingDuration)}-day waiting period.`}
    />
    <InfoRow
      text='Tokens earn no rewards during the unstaking period.'
    />
    <InfoRow
      text='After the unstaking period, you will need to redeem your tokens.'
    />
    <InfoRow
      text={`Your rewards (${amountToHuman(claimable, decimal, 5)} ${token}) will be claimed and credited to your free balance.`}
    />
  </Box>
);