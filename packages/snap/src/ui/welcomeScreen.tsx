// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getFormatted } from '../util/getFormatted';

import { Copyable, Box, Heading, Divider, Text } from "@metamask/snaps-sdk/jsx";

import { MenuBar } from './components';
import { HexString } from '@polkadot/util/types';

export const welcomeScreen = (address: string, genesisHash: HexString, logo: string) => {
  console.info(`Lets show welcome screen for ${address} on ${genesisHash}`)

  const formatted = genesisHash ? getFormatted(genesisHash, address) : address;

  return (
    <Box >
      <Heading>🏠 Your account is now created 🚀</Heading>
      <Copyable value={formatted} />
      <Divider />
      <Text> To access your account's details, navigate to  Metamask's **Menu → Snaps** and click on the PolkaGate icon.</Text>
      <Divider />
      <MenuBar />
    </Box>
  );
};
