// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DialogResult } from '@metamask/snaps-sdk';
import { metadata } from '../image/icons';
import { Bold, Box, Heading, Image, Link, Section, Text } from '@metamask/snaps-sdk/jsx';

const ui = () => (
  <Box>
    <Heading size='sm'>
      Metadata not found for this Network
    </Heading>
    <Text color='muted' size='sm'>
      Import metadata into the extension to sign transactions originating from this network.
    </Text>
    <Section direction='vertical'>
      <Text>
        To import or update metadata, go to <Bold>Settings/Metadata</Bold> on <Link href='https://apps.polkagate.xyz'> apps.polkagate.xyz </Link>
      </Text>
      <Image src={metadata} />
    </Section>
  </Box>
);

export async function metadataAlert(): Promise<DialogResult> {

  return await snap.request({
    method: 'snap_dialog',
    params: {
      content: ui(),
      type: 'alert',
    },
  });
}
