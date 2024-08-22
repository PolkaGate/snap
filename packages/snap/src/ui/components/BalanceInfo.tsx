// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN } from '@polkadot/util';
import type { Balances } from '../../util/getBalance';

import { Box, Text, Row, SnapComponent } from "@metamask/snaps-sdk/jsx";
import { Balance } from '@polkadot/types/interfaces';
import React from 'react';

type Props = {
  balances: Balances;
  price: number
}

type BalanceRowProps = {
  balance: Balance | undefined;
  decimal: number;
  label: string;
  price: number;
}

const balanceToValue = (total: BN, decimal: number, price: number) => (total.toNumber() * price / (10 ** decimal)).toFixed(1)

const BalanceRow: SnapComponent<BalanceRowProps> = ({ label, balance, decimal, price }: BalanceRowProps) => {

  const value = balance ? balanceToValue(balance, decimal, price) : 0;

  return (
    <Row label={label}>
      <Text>{balance ? balance.toHuman() : '0'}   |   {String(value)} USD</Text>
    </Row>
  );
};

export const BalanceInfo: SnapComponent<Props> = ({ balances, price }: Props) => {
  const { total, transferable, locked, soloTotal, pooledBalance, decimal } = balances;

  return (
    <Box>
      <BalanceRow
        label={'Total'}
        balance={total}
        decimal={decimal}
        price={price}
      />
      <BalanceRow
        label={'Transferable'}
        balance={transferable}
        decimal={decimal}
        price={price}
      />
      <BalanceRow
        label={'Locked'}
        balance={locked}
        decimal={decimal}
        price={price}
      />
      <BalanceRow
        label={'Staked (solo)'}
        balance={soloTotal}
        decimal={decimal}
        price={price}
      />
      <BalanceRow
        label={'Staked (pool)'}
        balance={pooledBalance}
        decimal={decimal}
        price={price}
      />
    </Box>
  );
};
