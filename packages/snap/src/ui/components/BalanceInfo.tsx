// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Balances } from '../../util/getBalance';

import { Box, Text, Row, SnapComponent } from "@metamask/snaps-sdk/jsx";

type Props = {
  balances: Balances;
}

export const BalanceInfo: SnapComponent<Props> = ({ balances }: Props) => {
  const { total, transferable, locked, soloTotal, pooledBalance } = balances;

  return (
    <Box>
      <Row label="Total">
        <Text>{total.toHuman()}</Text>
      </Row>
      <Row label="Transferable">
        <Text>{transferable.toHuman()}</Text>
      </Row>
      <Row label="Locked">
        <Text>{locked.toHuman()}</Text>
      </Row>
      <Row label="Staked">
        <Text>{soloTotal ? soloTotal.toHuman() : 'N/A'}</Text>
      </Row>
      <Row label="Staked (pool)">
        <Text>{pooledBalance ? pooledBalance.toHuman() : 'N/A'}</Text>
      </Row>
    </Box>
  );
};
