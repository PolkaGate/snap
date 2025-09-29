// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Balances } from '../../../util/getBalance';

import { Box, Heading, Section, Icon, Text, Button, SnapComponent, IconName } from '@metamask/snaps-sdk/jsx';

import { BalanceInfo } from '../../components';
import { PriceValue } from '../../../util/getPrices';
import { TotalBalance } from './TotalBalance';
import { NoTokensSection } from './NoTokensSection';

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
    <Text alignment='center' size='sm'>
      {label}
    </Text>
  </Box>
);

export const accountDemo = (
  hideBalance: boolean | undefined,
  balancesAll: Balances[],
  logos: { genesisHash: string, logo: string }[],
  prices: { genesisHash: string, price: PriceValue }[],
  showDetails?: boolean
) => {

  const nonZeroBalances = balancesAll.filter(({ total }) => !total.isZero());

  return (
    <Box>
      <Section>
        <TotalBalance
          hideBalance={hideBalance}
          balancesAll={balancesAll}
          prices={prices}
        />
        <Section alignment='space-around' direction='horizontal'>
          <CTA icon='wallet' name='send' label='Send' />
          <CTA icon='qr-code' name='receive' label='Receive' />
          <CTA icon='stake' name='stakeIndex' label='Stake' />
          <CTA icon='people' name='vote' label='Vote' />
          <CTA icon='setting' name='settings' label='Setting' />
        </Section>
      </Section>
      <Box alignment='space-between' direction='horizontal'>
        <Heading>Tokens</Heading>
        <Box center direction='horizontal'>
          <Button name='refreshBalances' variant='primary' >
            <Icon size='md' color='primary' name='refresh' />
          </Button >
          {!!nonZeroBalances?.length &&
            <Button name='balanceDetails' variant='primary' >
              <Icon size='md' color='primary' name={showDetails ? 'arrow-up' : 'arrow-down'} />
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

          return <BalanceInfo balances={balances} price={price} logo={logo} showDetail={showDetails} hideBalance={hideBalance} />

        })
        : <NoTokensSection />
      }
    </Box>
  );
};
