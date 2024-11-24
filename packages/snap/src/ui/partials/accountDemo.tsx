// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Balances } from '../../util/getBalance';

import { Box, Heading, Section, Icon, Text, Button } from '@metamask/snaps-sdk/jsx';

import { BalanceInfo } from '../components';
import { amountToHuman } from '../../util/amountToHuman';
import { PriceValue } from '../../util/getPrices';

export const accountDemo = (
  address: string,
  balancesAll: Balances[],
  logos: { genesisHash: string, logo: string }[],
  prices: { genesisHash: string, price: PriceValue }[],
  showDetail?: boolean
) => {

  const totalBalance = balancesAll.reduce((acc, { total, decimal }, index) => acc + Number(amountToHuman(total, decimal)) * prices[index].price.value, 0)
  const availableBalance = balancesAll.reduce((acc, { transferable, decimal }, index) => acc + Number(amountToHuman(transferable, decimal)) * prices[index].price.value, 0)
  const nonZeroBalances = balancesAll.filter(({ total }) => !total.isZero());
  const totalBalanceChanges = balancesAll.reduce((acc, { total, decimal }, index) => {
    const value = Number(amountToHuman(total, decimal)) * prices[index].price.value;
    return acc + value * prices[index].price.change / 100
  }, 0)

  const signOfChanges = totalBalanceChanges > 0 ? '+' : totalBalanceChanges < 0 ? '-' : '';
  const colorOfChanges = totalBalanceChanges > 0 ? 'success' : totalBalanceChanges < 0 ? 'error' : 'default';

  return (
    <Box>
      <Section>
        <Box alignment='space-between' direction='horizontal'>
          <Heading> Total balance</Heading>
          <Heading size='lg'>{`$${totalBalance.toFixed(2)}`}</Heading>
        </Box>
        <Box alignment='space-between' direction='horizontal'>
          <Text alignment='start' color='muted'> {`available $${availableBalance.toFixed(2)}`}</Text>
          <Text alignment='start' color={colorOfChanges}> {`${signOfChanges}$${totalBalanceChanges.toFixed(2)}`}</Text>
        </Box>
        <Section>
          <Box alignment='space-around' direction='horizontal'>
            <Button name='send' variant='primary'>
              <Icon size='md' color='primary' name='send-1' />
            </Button>
            <Button name='receive' variant='primary'>
              <Icon size='md' color='primary' name='qr-code' />
            </Button>
            <Button name='stake' variant='primary'>
              <Icon size='md' color='primary' name='stake' />
            </Button>
            <Button name='vote' variant='primary'>
              <Icon size='md' color='primary' name='people' />
            </Button>
            <Button name='more' variant='primary'>
              <Icon size='md' color='primary' name='more-horizontal' />
            </Button>
          </Box>
          <Box alignment='space-around' direction='horizontal'>
            <Text alignment='center'> Send</Text>
            <Text alignment='center'> Receive</Text>
            <Text alignment='center'> Stake</Text>
            <Text alignment='center'> Vote</Text>
            <Text alignment='center'> More</Text>
          </Box>
        </Section>
      </Section>
      <Box alignment='space-between' direction='horizontal'>
        <Heading>Tokens</Heading>
        {!!nonZeroBalances?.length &&
          <Box center direction='horizontal'>
            <Button name='balanceDetails' variant='primary'>
              {showDetail ? 'hide' : 'show'}  details
            </Button>
            <Icon color='muted' name={showDetail ? 'arrow-down' : 'arrow-right'} />
          </Box>}
      </Box>
      {nonZeroBalances?.length
        ? nonZeroBalances.map((balances, index) => {

          const logo = logos.find(({ genesisHash }) => genesisHash === balances.genesisHash)?.logo as string;
          const price = prices.find(({ genesisHash }) => genesisHash === balances.genesisHash)?.price.value as number; // needs that prices be token-based when supporting multi asset chains

          return (
            <Section>
              <BalanceInfo balances={balances} price={price} logo={logo} showDetail={showDetail} />
            </Section>
          )
        })
        : <Section>
          <Text alignment='center'> No tokens to show!</Text>
        </Section>
      }
    </Box>
  );
};
