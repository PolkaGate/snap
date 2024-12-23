// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, Text, Icon, SnapComponent } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../../../util/amountToHuman";

interface Props {
  claimable: string;
  decimal: number;
  token: string;
  unbondingDuration: number;
}

interface InoRowProps {
  text: string;
}

const InfoRow: SnapComponent<InoRowProps> = ({ text }) => (
  <Box direction="horizontal" alignment="start">
    <Icon name='info' color='muted' />
    <Text color='muted'>
      {text}
    </Text>
  </Box>
)

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