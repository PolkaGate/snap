// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OnInstallHandler } from '@metamask/snaps-sdk';
import { Box, Heading, Divider, Text, Bold, Link, Icon, Section, SnapComponent } from "@metamask/snaps-sdk/jsx";

import { POLKADOT_GENESIS } from '@polkadot/apps-config';
import { setSnapState } from '../rpc/stateManagement';
import { UpdateInfo } from './onUpdate';

/**
 * Handle installation of the snap. This handler is called when the snap is
 * installed.
 */
export const onInstall: OnInstallHandler = async () => {
  setSnapState({ currentGenesisHash: POLKADOT_GENESIS }).catch(console.error);

  await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: <WelcomeScreen />
    },
  });
};


const WelcomeScreen: SnapComponent = () => {
  console.info(`Let's show welcome screen ...`)

  return (
    <Box >
      <Heading>Welcome to Polkadot eco.! ✋</Heading>
      <Divider />
      <Text color='muted'>
        Explore features like managing balances, staking, voting in governance, and more—all from the <Link href="metamask://snap/npm:@polkagate/snap/home">PolkaGate Snap Home</Link>.
      </Text>
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
