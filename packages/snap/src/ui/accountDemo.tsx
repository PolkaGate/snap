// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Balances } from '../util/getBalance';
import { getFormatted } from '../util/getFormatted';

import { Copyable, Box, Heading, Divider, Text } from "@metamask/snaps-sdk/jsx";

import { BalanceInfo, ChainSwitch, MenuBar } from './components';
import { HexString } from '@polkadot/util/types';

export const accountDemo = (address: string, genesisHash: HexString, balances: Balances, logo: string) => {
  const formatted = genesisHash ? getFormatted(genesisHash, address) : address;

  return (
    <Box >
      <Heading>Your Account Information</Heading>
      <ChainSwitch genesisHash={genesisHash} logo={logo} />
      <Text>Address</Text>
      <Copyable value={formatted} />
      <BalanceInfo balances={balances} />
      <Divider />
      <MenuBar />
    </Box>
  );
};
