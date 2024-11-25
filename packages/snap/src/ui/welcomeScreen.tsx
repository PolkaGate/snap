// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getFormatted } from '../util/getFormatted';

import { Copyable, Box, Heading, Divider, Text, Bold, Link, Icon, Section } from "@metamask/snaps-sdk/jsx";

import { HexString } from '@polkadot/util/types';

export const welcomeScreen = (address: string, genesisHash: HexString, logo: string) => {
  console.info(`Lets show welcome screen for ${address} on ${genesisHash}`)

  const formatted = genesisHash ? getFormatted(genesisHash, address) : address;

  return (
    <Box >
      <Heading>Welcome to Polkadot eco.! ✋</Heading>
      <Divider />
      <Text color='muted'>Explore features like managing balances, staking, voting in governance, and more—all from the <Link href="metamask://snap/npm:@polkagate/snap/home">PolkaGate Snap Home</Link>.</Text>
      <Section>
        <Text>To visit Home, open MetaMask, go to</Text>
        <Box direction='horizontal' alignment='start'>
          <Icon size='md' name='more-vertical' />
          <Bold>Menu → Snaps</Bold>
        </Box>
        <Text>Then click on PolkaGate logo.</Text>
      </Section>
    </Box>
  );
};
