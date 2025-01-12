// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OnInstallHandler } from '@metamask/snaps-sdk';
import { Box, Heading, Text, Bold, Link, Icon, Section, SnapComponent, Image, Row } from "@metamask/snaps-sdk/jsx";

import { POLKADOT_GENESIS } from '@polkadot/apps-config';
import { setSnapState } from '../rpc/stateManagement';
import { home } from '../ui/image/screenshots';
import { polkadotMedium } from '../ui/image/chains';

/**
 *  This handler is called when the snap is installed.
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
  return (
    <Box direction='vertical'>

      <Box direction='horizontal' alignment='space-between'>
        <Box direction='vertical' >
          <Heading size='md'>Welcome to Polkadot eco.!</Heading>
          <Text color='muted'>
            <Bold>To View the </Bold><Link href="metamask://snap/npm:@polkagate/snap/home">Home</Link> <Bold> Screen:</Bold>
          </Text>
        </Box>
        <Image src={polkadotMedium} />
      </Box>


      <Section>
        <Text>
          1.	Open MetaMask.
        </Text>
        <Text>
          2.	Navigate to the <Bold>Menu</Bold> and select <Bold>Snaps</Bold>.
        </Text>
        <Text>
          3.	Click on the <Bold>PolkaGate logo</Bold>.
        </Text>
      </Section>


      <Text color='muted'>
        Scroll down to see the full screenshot of the Home screen for reference.
      </Text>

      <Image src={home} />
    </Box>
  );
};