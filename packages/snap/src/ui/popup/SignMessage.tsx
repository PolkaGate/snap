// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0


import { Bold, Box, Copyable, Icon, Section, SnapComponent, Text } from '@metamask/snaps-sdk/jsx';
import { isAscii, u8aToString, u8aUnwrapBytes } from '@polkadot/util';

type Props = {
  data: string,
  origin: string,
}

export const SignMessage: SnapComponent<Props> = ({ data, origin }) => {

  const message = isAscii(data)
    ? u8aToString(u8aUnwrapBytes(data))
    : data;

  return (
    <Box  >
      <Box center >
        <Box direction='horizontal' center>
          <Icon name='key' size='inherit' />
          <Text size='md'>
            <Bold>
              Signing request
            </Bold>
          </Text>
        </Box>
        <Text alignment='center' size='md'>
          {origin}
        </Text>
      </Box>

      <Section>
        <Text size='sm' color='muted'>
          Message to sign
        </Text>
        <Copyable value={message} />
      </Section>
      <Section direction='horizontal' alignment='start'>
        <Icon name='warning' color='muted' />
        <Text size='sm' color='warning'>
          Proceed only if you understand the message above!
        </Text>
      </Section>
    </Box>
  )
};
