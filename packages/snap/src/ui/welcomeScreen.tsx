// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getFormatted } from '../util/getFormatted';

import { Copyable, Box, Heading, Divider, Text, Bold } from "@metamask/snaps-sdk/jsx";

import { HexString } from '@polkadot/util/types';

export const welcomeScreen = (address: string, genesisHash: HexString, logo: string) => {
  console.info(`Lets show welcome screen for ${address} on ${genesisHash}`)

  const formatted = genesisHash ? getFormatted(genesisHash, address) : address;

  return (
    <Box >
      <Heading>🎉 Polkadot Account Created! 🚀</Heading>
      <Text>Your account address:</Text>
      <Copyable value={formatted} />
      <Divider />
      <Text>Explore features like managing balances, staking, voting in governance, and more—all from the PolkaGate home screen.</Text>
      <Text>To get started, open MetaMask, go to <Bold>Menu → Snaps</Bold>, and click the PolkaGate icon.</Text>
    </Box>
  );
};
