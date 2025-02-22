// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Balances } from '../../util/getBalance';

import { Box, Card, Divider, Text, SnapComponent, Icon, IconName, Section, Tooltip } from "@metamask/snaps-sdk/jsx";
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
  hideBalance: boolean | undefined;
  label: string;
  value: string;
  tooltip?: string;
}

const maskedText = (numDots = 9): string => '•'.repeat(numDots);

export const DetailRow: SnapComponent<DetailRowProps> = ({ iconName, hideBalance, label, value, tooltip }: DetailRowProps) => {

  return (
    <Box alignment='space-between' direction='horizontal'>
      <Box alignment='start' direction='horizontal'>
        <Icon name={iconName} color='muted' />
        <Text color='muted' size='sm'>
          {label}
        </Text>
      </Box>
      <Box alignment='end' direction='horizontal'>
        {!!tooltip &&
          <Tooltip content={tooltip}>
            <Icon name='info' color='muted' />
          </Tooltip>
        }
        <Text color='muted' size='sm'>
          {hideBalance ? maskedText(6) : value}
        </Text>
      </Box>
    </Box>
  );
};

export const BalanceInfo: SnapComponent<Props> = ({ balances, price, logo, showDetail, hideBalance }: Props) => {
  const { total, transferable, locked, soloTotal, pooled, decimal, token } = balances;
  const totalPrice = parseFloat(amountToHuman(total, decimal)) * price;

  return (
    <Section>
      <Card
        image={logo}
        title={token}
        description={`$${price}`}
        value={
          hideBalance
            ? maskedText()
            : `${amountToHuman(total, decimal)} ${token}`
        }
        extra={
          hideBalance
            ? maskedText(6)
            : `$${totalPrice.toFixed(2)}`
        }
      />
      {!!showDetail &&
        <Box>
          <Divider />
          <DetailRow
            iconName='send-2'
            hideBalance={hideBalance}
            label='Transferable'
            value={`${amountToHuman(transferable, decimal)} ${token}`}
          />
          {!locked.isZero() &&
            <DetailRow
              iconName='lock'
              hideBalance={hideBalance}
              label='Locked'
              tooltip='The amount locked in staking or governance.'
              value={`${amountToHuman(locked, decimal)} ${token}`}
            />}
          {!!(soloTotal && !soloTotal.isZero()) &&
            <DetailRow
              iconName='stake'
              hideBalance={hideBalance}
              label='Staked (solo)'
              value={`${amountToHuman(soloTotal, decimal)} ${token}`}
            />}
          {!new BN(pooled?.total || 0).isZero() &&
            <DetailRow
              iconName='stake'
              hideBalance={hideBalance}
              label='Staked (pool)'
              value={`${amountToHuman(pooled?.total, decimal)} ${token}`}
            />}
        </Box>
      }
    </Section>
  );
};
