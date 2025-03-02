// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OnInstallHandler } from '@metamask/snaps-sdk';
import { Box, Heading, Text, Bold, Link, Section, SnapComponent, Image } from "@metamask/snaps-sdk/jsx";

import { POLKADOT_GENESIS } from '@polkadot/apps-config';
import { setSnapState } from '../rpc/stateManagement';
import { home } from '../ui/image/screenshots';
import { polkadotMedium } from '../ui/image/chains';
import { noop } from '@polkadot/util/cjs/noop';

/**
 *  This handler is called when the snap is installed.
 */
export const onInstall: OnInstallHandler = async () => {
  setSnapState({ currentGenesisHash: POLKADOT_GENESIS }).catch(noop);

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
          <Text color='alternative'>
            <Bold>To View the </Bold><Link href="metamask://snap/npm:@polkagate/snap/home">Home</Link> <Bold> Screen:</Bold>
          </Text>
        </Box>
        <Image src={polkadotMedium} />
      </Box>

      <Section>
        <Text color='alternative'>
          1.	Open MetaMask.
        </Text>
        <Text color='alternative'>
          2.	Navigate to the <Bold>Menu</Bold> and select <Bold>Snaps</Bold>.
        </Text>
        <Text color='alternative'>
          3.	Click on the <Bold>PolkaGate logo</Bold>.
        </Text>
      </Section>

      <Text color='muted' size='sm'>
        Scroll down to see the full screenshot of the Home screen for reference.
      </Text>

      <Image src={home} />
    </Box>
  );
};