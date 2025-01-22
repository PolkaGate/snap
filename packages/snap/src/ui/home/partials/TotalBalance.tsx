// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0


import { Box, Heading, Icon, Text, Button, SnapComponent, Tooltip } from '@metamask/snaps-sdk/jsx';
import { amountToHuman } from '../../../util/amountToHuman';
import { Balances } from '../../../util';
import { PriceValue } from '../../../util/getPrices';
import { commifyNumber } from '../../../utils';

interface Props {
  hideBalance: boolean | undefined;
  balancesAll: Balances[];
  prices: { genesisHash: string, price: PriceValue }[]
}

export const TotalBalance: SnapComponent<Props> = ({ hideBalance, balancesAll, prices }) => {

  const { totalBalance, availableBalance, totalBalanceChanges } = balancesAll.reduce(
    (acc, { total, transferable, decimal }, index) => {
      const price = prices[index].price.value;
      const changePercent = prices[index].price.change / 100;
      const totalValue = Number(amountToHuman(total, decimal)) * price;
      const transferableValue = Number(amountToHuman(transferable, decimal)) * price;

      acc.totalBalance += totalValue;
      acc.availableBalance += transferableValue;
      acc.totalBalanceChanges += totalValue * changePercent;

      return acc;
    }, { totalBalance: 0, availableBalance: 0, totalBalanceChanges: 0 });

  const balanceChangePercentage =
    totalBalance !== 0 ? (totalBalanceChanges / totalBalance) * 100 : 0;

  const signOfChanges = totalBalanceChanges > 0 ? '+' : totalBalanceChanges < 0 ? '-' : '';
  const colorOfChanges = totalBalanceChanges > 0 ? 'success' : totalBalanceChanges < 0 ? 'error' : 'muted';
  const locked = totalBalance - availableBalance;

  const decimalToFixForTotal = totalBalance < 100000 ? 2 : 0;
  const decimalToFixForBalanceChange = totalBalanceChanges < 100000 ? 2 : 0;

  const totalBalanceCommified = commifyNumber(totalBalance, { minimumFractionDigits: decimalToFixForTotal, maximumFractionDigits: decimalToFixForTotal })
  const balanceChangeCommified = commifyNumber(Math.abs(totalBalanceChanges), { minimumFractionDigits: decimalToFixForBalanceChange, maximumFractionDigits: decimalToFixForBalanceChange })
  const lockedCommified = commifyNumber(locked, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <Box alignment='start' direction='vertical'>
      <Box alignment='start' direction='horizontal' center>
        <Heading size='lg'>
          {hideBalance
            ? '●●●●●●●●'
            : `$${totalBalanceCommified} USD`
          }
        </Heading>
        <Button name={hideBalance ? 'showBalance' : 'hideBalance'}>
          {hideBalance
            ? <Icon name='eye-slash' size='md' color='muted' />
            : <Icon name='eye' size='md' color='muted' />
          }
        </Button>
      </Box>

      <Box alignment='space-between' direction='horizontal' center>
        <Text alignment='start' color={colorOfChanges}>
          {hideBalance
            ? '••••••••'
            : `${signOfChanges}$${balanceChangeCommified} (${signOfChanges}${Math.abs(balanceChangePercentage).toFixed(decimalToFixForBalanceChange)}%)`
          }
        </Text>
        <Box alignment='end' direction='horizontal'>
          <Tooltip content='Locked balance'>
            <Icon name='lock' color='muted' />
          </Tooltip>
          <Text alignment='end' color='muted'>
            {hideBalance
              ? '••••••••'
              : `$${lockedCommified} USD`
            }
          </Text>
        </Box>
      </Box>

    </Box>
  )
}