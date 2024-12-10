// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Balances } from '../../util/getBalance';

import { Box, Heading, Section, Icon, Text, Button, SnapComponent, IconName } from '@metamask/snaps-sdk/jsx';

import { BalanceInfo } from '../components';
import { amountToHuman } from '../../util/amountToHuman';
import { PriceValue } from '../../util/getPrices';
import { BALANCE_FETCH_TYPE } from '../../util/handleBalancesAll';

type CTAProps = {
  icon: `${IconName}`;
  label: string;
  name: string;
}
const CTA: SnapComponent<CTAProps> = ({ name, icon, label }) => (
  <Box direction='vertical' alignment='center' center>
    <Button name={name} variant='primary' >
      <Icon size='md' color='primary' name={icon} />
    </Button >
    <Text alignment='center'> {label}</Text>
  </Box>
)

type CTAProps = {
  icon: `${IconName}`;
  label: string;
  name: string;
}
const CTA: SnapComponent<CTAProps> = ({ name, icon, label }) => (
  <Box direction='vertical' alignment='center' center>
    <Button name={name} variant='primary' >
      <Icon size='md' color='primary' name={icon} />
    </Button >
    <Text alignment='center'> {label}</Text>
  </Box>
)

export const accountDemo = (
  balancesAll: Balances[],
  logos: { genesisHash: string, logo: string }[],
  prices: { genesisHash: string, price: PriceValue }[],
  showDetails?: boolean
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
          <Text alignment='start' color='muted'>
            {`available $${availableBalance.toFixed(2)}`}
          </Text>
          <Text alignment='start' color={colorOfChanges}>
            {`${signOfChanges}$${Math.abs(totalBalanceChanges).toFixed(2)}`}
          </Text>
        </Box>
        <Section>
          <Box alignment='space-around' direction='horizontal'>
            <CTA icon='send-1' name='send' label='Send' />
            <CTA icon='qr-code' name='receive' label='Receive' />
            <CTA icon='stake' name='stake' label='Stake' />
            <CTA icon='people' name='vote' label='Vote' />
            <CTA icon='more-horizontal' name='more' label='More' />
          </Box>
        </Section>
      </Section>
      <Box alignment='space-between' direction='horizontal'>
        <Heading>Tokens</Heading>
        <Box center direction='horizontal'>
          {!!nonZeroBalances?.length &&
            <Button name='balanceDetails' variant='primary' >
              <Icon size='md' color={showDetails ? 'muted' : 'primary'} name='card-token' />
            </Button >
          }
          <Button name='customizeChains' variant='primary' >
            <Icon size='md' color='primary' name='customize' />
          </Button >
        </Box>
      </Box>
      {nonZeroBalances?.length
        ? nonZeroBalances.map((balances) => {

          const logo = logos.find(({ genesisHash }) => genesisHash === balances.genesisHash)?.logo as string;
          const price = prices.find(({ genesisHash }) => genesisHash === balances.genesisHash)?.price.value as number; // needs that prices be token-based when supporting multi asset chains

          return (
            <Section>
              <BalanceInfo balances={balances} price={price} logo={logo} showDetail={showDetails} />
            </Section>
          )
        })
        : <Section>
          <Text alignment='center'> No tokens on the selected networks!</Text>
          <Box direction='horizontal' alignment='center'>
            <Text alignment='center' color='muted'>Select your preferred networks using the icon above.</Text>
            <Icon size='md' color='muted' name='customize' />
          </Box>
        </Section>
      }
    </Box>
  );
};
