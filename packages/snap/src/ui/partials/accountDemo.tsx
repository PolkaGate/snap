// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Balances } from '../../util/getBalance';
import { getFormatted } from '../../util/getFormatted';

import { Copyable, Box, Heading, Section, Icon } from '@metamask/snaps-sdk/jsx';

import { BalanceInfo, ChainSwitch, MenuBar } from '../components';
import { HexString } from '@polkadot/util/types';

export const accountDemo = (address: string, genesisHash: HexString, balances: Balances, logo: string, price: number) => {
  console.info(`Lets show account demo for ${address} on ${genesisHash}`)

  const formatted = genesisHash ? getFormatted(genesisHash, address) : address;

  return (
    <Box>
      <Section>
        <Box direction='horizontal' alignment='start'>
          <Icon name="wallet" size="md" />
          <Heading>Account</Heading>
        </Box>
        <Copyable value={formatted} />
        <ChainSwitch genesisHash={genesisHash} logo={logo} />
      </Section>
      <Section>
      <Box direction='horizontal' alignment='start'>
          <Icon name="coin" size="md" />
          <Heading>Balance</Heading>
        </Box>
        <BalanceInfo balances={balances} price={price} />
      </Section>
      <MenuBar />
    </Box>
  );
};
