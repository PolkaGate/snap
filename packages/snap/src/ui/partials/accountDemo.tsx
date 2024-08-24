// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Balances } from '../../util/getBalance';
import { getFormatted } from '../../util/getFormatted';

import { Copyable, Box, Heading, Divider } from '@metamask/snaps-sdk/jsx';

import { BalanceInfo, ChainSwitch, MenuBar } from '../components';
import { HexString } from '@polkadot/util/types';

export const accountDemo = (address: string, genesisHash: HexString, balances: Balances, logo: string, price: number) => {
  console.info(`Lets show account demo for ${address} on ${genesisHash}`)

  const formatted = genesisHash ? getFormatted(genesisHash, address) : address;

  return (
    <Box >
      <Heading>Account</Heading>
      <Copyable value={formatted} />
      <ChainSwitch genesisHash={genesisHash} logo={logo} />
      <Divider />
      <Heading>Balance</Heading>
      <BalanceInfo balances={balances} price={price} />
      <Divider />
      <MenuBar />
    </Box>
  );
};
