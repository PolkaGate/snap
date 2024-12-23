// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, Text, Icon, SnapComponent } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../../util/amountToHuman";

interface Props {
  claimable: string;
  decimal: number;
  token: string;
}

export const PoolStakeMoreExtraInfo: SnapComponent<Props> = ({ claimable, decimal, token }) => (
  <Box>
    <Box direction="horizontal" alignment="start">
      <Icon name='info' color='muted' />
      <Text color='muted'>
        Your rewards will increase starting in the next era.
      </Text>
    </Box>
    <Box direction="horizontal" alignment="start">
      <Icon name='info' color='muted' />
      <Text color='muted'>
        Your rewards ({amountToHuman(claimable, decimal, 5)} {token}) will be claimed and credited to your free balance.
      </Text>
    </Box>
  </Box>
);