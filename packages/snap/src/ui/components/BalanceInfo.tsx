// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Balances } from '../../util/getBalance';

import { Box, Card, Divider, Text, SnapComponent, Icon, IconName } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from '../../util/amountToHuman';
import { BN } from '@polkadot/util';

type Props = {
  balances: Balances;
  price: number;
  logo: string;
  showDetail?: boolean;
  hideBalance: boolean | undefined;
}

type DetailRowProps = {
  iconName: `${IconName}`;
  label: string;
  show?: boolean;
  value: string;
}

export const DetailRow: SnapComponent<DetailRowProps> = ({ iconName, label, value, show = true }: DetailRowProps) => {

  return (
    <Box>
      {show &&
        <Box alignment='space-between' direction='horizontal'>
          <Box alignment='start' direction='horizontal' center>
            <Icon size='md' name={iconName} color='muted' />
            <Text color='muted'>{label} </Text>
          </Box>
          <Text color='muted'>{value}</Text>
        </Box>
      }
    </Box>
  );
};

export const BalanceInfo: SnapComponent<Props> = ({ balances, price, logo, showDetail, hideBalance }: Props) => {
  const { total, transferable, locked, soloTotal, pooled, decimal, token } = balances;
  const totalPrice = parseFloat(amountToHuman(total, decimal)) * price;

  return (
    <Box>
      <Card
        image={logo}
        title={token}
        description={`$${price}`}
        value={
          hideBalance
            ? '••••••••'
            : `${amountToHuman(total, decimal)} ${token}`
        }
        extra={
          hideBalance
            ? '••••••••'
            : `$${totalPrice.toFixed(2)}`
        }
      />
      {!!showDetail &&
        <Box>
          <Divider />
          <DetailRow
            iconName='send-2'
            label='Transferable'
            value={`${amountToHuman(transferable, decimal)} ${token}`}
          />
          <DetailRow
            iconName='lock'
            show={!locked.isZero()}
            label='Locked'
            value={`${amountToHuman(locked, decimal)} ${token}`}
          />
          <DetailRow
            iconName='stake'
            show={!!(soloTotal && !soloTotal.isZero())}
            label='Staked (solo)'
            value={`${amountToHuman(soloTotal, decimal)} ${token}`}
          />
          <DetailRow
            iconName='stake'
            show={!new BN(pooled?.total || 0).isZero()}
            label='Staked (pool)'
            value={`${amountToHuman(pooled?.total, decimal)} ${token}`}
          />
          {/* {!locked.isZero() &&
            <Row label="Locked" tooltip='The amount locked in referenda.'>
          } */}
        </Box>
      }
    </Box>
  );
};
